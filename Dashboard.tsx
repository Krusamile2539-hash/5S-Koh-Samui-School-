
import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInspections } from './useInspections';
import type { ClassroomScore, Inspection, SchoolLevel } from './types';
import { JUNIOR_HIGH_PREFIXES, SENIOR_HIGH_PREFIXES, APP_VERSION } from './constants';
import Podium from './Podium';
import ReportTable from './ReportTable';
import Header from './Header';

// Fix: Add global declarations for html2canvas and jspdf which are loaded from scripts.
declare global {
    interface Window {
        html2canvas: any;
        jspdf: any;
    }
}

const BackgroundWallpaper = () => {
    // Use a long string of the 5S words repeated to ensure seamless looping
    const text = "สะสาง สะดวก สะอาด สุขลักษณะ สร้างนิสัย ";
    // Create a very long string to cover wide screens before wrapping
    const repeatedText = Array(20).fill(text).join(" • ");
  
    return (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <style>
              {`
              @keyframes marquee-left {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
              }
              @keyframes marquee-right {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0); }
              }
              `}
          </style>
          {/* Container is rotated and scaled up to cover the corners */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] flex flex-col justify-center gap-16 transform -rotate-12 opacity-10">
              {/* Render multiple rows */}
              {[...Array(20)].map((_, i) => (
                  <div 
                      key={i} 
                      className="whitespace-nowrap text-6xl font-black text-white"
                      style={{ 
                          // Alternate direction and vary speed slightly
                          animation: `${i % 2 === 0 ? 'marquee-left' : 'marquee-right'} ${40 + (i % 3) * 10}s linear infinite`
                      }}
                  >
                      {/* Render text twice to allow for seamless -50% translate loop */}
                      <span>{repeatedText}</span>
                      <span>{repeatedText}</span>
                  </div>
              ))}
          </div>
      </div>
    );
};

const ScoreCard: React.FC<{ rank: number; classroom: string; score: number }> = ({ rank, classroom, score }) => (
    <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md h-full">
        <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-brand-blue text-sm">{rank}</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm truncate">{classroom}</span>
        </div>
        <span className="font-bold text-brand-blue text-sm whitespace-nowrap">{score.toFixed(2)}</span>
    </div>
);

const Dashboard: React.FC = () => {
    const { inspections, loading } = useInspections();
    const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly' | 'term1' | 'term2'>('daily');
    
    // State for historical data selection
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    
    // State for Time Slot Filter (Morning/Evening)
    const [timeSlotFilter, setTimeSlotFilter] = useState<'all' | 'morning' | 'evening'>('all');

    const reportRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<string>('');


    const { filteredInspections, periodLabel } = useMemo(() => {
        const now = new Date();
        let label = '';
        let filtered: Inspection[] = [];

        if (filter === 'daily') {
            const [y, m, d] = selectedDate.split('-').map(Number);
            const targetStart = new Date(y, m - 1, d, 0, 0, 0);
            const targetEnd = new Date(y, m - 1, d, 23, 59, 59);

            const timeLabel = timeSlotFilter === 'all' ? '' : timeSlotFilter === 'morning' ? ' (รอบเช้า)' : ' (รอบเย็น)';
            label = `รายวัน${timeLabel} (${targetStart.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })})`;
            
            filtered = inspections.filter(i => {
                const d = new Date(i.date);
                const isSameDay = d >= targetStart && d <= targetEnd;
                if (!isSameDay) return false;
                
                if (timeSlotFilter !== 'all') {
                    return i.timeSlot === timeSlotFilter;
                }
                return true;
            });
        } else if (filter === 'weekly') {
            const [y, m, d] = selectedDate.split('-').map(Number);
            const anchorDate = new Date(y, m - 1, d);
            
            // Calculate start of week (Monday)
            const day = anchorDate.getDay(); // 0=Sun, 1=Mon...
            const diff = anchorDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
            
            const startOfWeek = new Date(anchorDate);
            startOfWeek.setDate(diff);
            startOfWeek.setHours(0, 0, 0, 0);
            
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            label = `รายสัปดาห์ (${startOfWeek.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })})`;

            filtered = inspections.filter(i => {
                const d = new Date(i.date);
                return d >= startOfWeek && d <= endOfWeek;
            });
        } else if (filter === 'monthly') {
            const [y, m] = selectedMonth.split('-').map(Number);
            
            label = `รายเดือน (${new Date(y, m - 1, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })})`;
            
            filtered = inspections.filter(i => {
                const d = new Date(i.date);
                return d.getMonth() === m - 1 && d.getFullYear() === y;
            });
        } else {
            // Term logic remains based on current academic year structure but checks actual dates
            const currentMonth = now.getMonth(); // 0-11
            let academicYearStart = now.getFullYear();
            if (currentMonth < 4) { // Before May (Jan-Apr)
                academicYearStart--;
            }
            
            if (filter === 'term1') {
                label = `เทอม 1 ปีการศึกษา ${academicYearStart + 543}`;
                // May (4) to September (8)
                filtered = inspections.filter(i => {
                    const d = new Date(i.date);
                    return d.getFullYear() === academicYearStart && d.getMonth() >= 4 && d.getMonth() <= 8;
                });
            } else if (filter === 'term2') {
                label = `เทอม 2 ปีการศึกษา ${academicYearStart + 543}`;
                // November (10) of start year to March (2) of next year
                filtered = inspections.filter(i => {
                    const d = new Date(i.date);
                    const m = d.getMonth();
                    const y = d.getFullYear();
                    return (y === academicYearStart && m >= 10) || (y === academicYearStart + 1 && m <= 2);
                });
            }
        }
        
        return { filteredInspections: filtered, periodLabel: label };
    }, [inspections, filter, selectedDate, selectedMonth, timeSlotFilter]);
    
    const processedScores = useMemo(() => {
        const classroomData: { [key: string]: { totalScore: number; count: number } } = {};
        filteredInspections.forEach(inspection => {
            if (!classroomData[inspection.classroom]) {
                classroomData[inspection.classroom] = { totalScore: 0, count: 0 };
            }
            classroomData[inspection.classroom].totalScore += inspection.totalScore;
            classroomData[inspection.classroom].count += 1;
        });

        const averagedScores: ClassroomScore[] = Object.entries(classroomData).map(([classroom, data]) => {
            const level: SchoolLevel = JUNIOR_HIGH_PREFIXES.some(p => classroom.startsWith(p)) ? 'junior' : 'senior';
            return {
                classroom,
                score: data.totalScore / data.count,
                level,
            };
        }).sort((a, b) => b.score - a.score);
        
        return {
            junior: averagedScores.filter(s => s.level === 'junior'),
            senior: averagedScores.filter(s => s.level === 'senior'),
        };
    }, [filteredInspections]);

    // Helper to download blob as file (fallback for share)
    const downloadBlob = (blob: Blob, fileName: string) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const handleExportPDF = async () => {
        const reportElement = reportRef.current;
        if (!reportElement || !window.html2canvas || !window.jspdf) {
            alert('ไม่สามารถส่งออก PDF ได้ในขณะนี้ กรุณารอโหลดสักครู่');
            return;
        }

        setIsExporting(true);
        setExportStatus('กำลังสร้าง PDF...');
        
        // Give UI time to update
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            // Use slightly lower scale for mobile stability
            const canvas = await window.html2canvas(reportElement, { 
                scale: 1.5,
                useCORS: true,
                logging: false,
                allowTaint: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            const filename = `5s-kohsamui-${filter}-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
            
        } catch (err) {
            console.error('Export PDF Error:', err);
            alert('เกิดข้อผิดพลาดในการสร้าง PDF ลองใหม่อีกครั้ง');
        } finally {
            setIsExporting(false);
            setExportStatus('');
        }
    };

    const handleShare = async () => {
        const reportElement = reportRef.current;
        if (!reportElement || !window.html2canvas) {
            alert('ไม่สามารถสร้างรูปภาพได้ในขณะนี้');
            return;
        }

        setIsExporting(true);
        setExportStatus('กำลังสร้างรูปภาพเพื่อแชร์...');

        // Give UI time to update
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            // Ensure high enough resolution for text readability
            const canvas = await window.html2canvas(reportElement, { 
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false
            });
            
            canvas.toBlob(async (blob: Blob | null) => {
                if (!blob) {
                    setIsExporting(false);
                    return;
                }

                const fileName = `5s-summary-${new Date().toISOString().split('T')[0]}.png`;
                const file = new File([blob], fileName, { type: 'image/png' });
                
                const shareData = {
                    files: [file],
                    title: 'สรุปคะแนน 5ส โรงเรียนเกาะสมุย',
                    text: `สรุปผลการตรวจ 5ส ${periodLabel} #5sKohSamui`,
                };

                // Try Web Share API Level 2 (Files)
                if (navigator.canShare && navigator.canShare(shareData)) {
                    try {
                        await navigator.share(shareData);
                        // If successful, we are done.
                    } catch (error) {
                        // If user cancelled, do nothing. 
                        // If error (not AbortError), fall back to download.
                        if ((error as Error).name !== 'AbortError') {
                             console.log('Share failed, falling back to download');
                             downloadBlob(blob, fileName);
                             alert('บันทึกรูปภาพเรียบร้อยแล้ว\nคุณสามารถนำรูปภาพนี้ไปโพสต์ลง Facebook ได้เลยครับ');
                        }
                    }
                } else {
                    // Fallback: Download the image
                    downloadBlob(blob, fileName);
                    alert('บันทึกรูปภาพลงเครื่องเรียบร้อยแล้ว\nคุณสามารถนำรูปภาพนี้ไปโพสต์ลง Facebook ได้เลยครับ');
                }
                
                setIsExporting(false);
                setExportStatus('');
            }, 'image/png');
        } catch (err) {
            console.error('Export Error:', err);
            alert('เกิดข้อผิดพลาดในการสร้างรูปภาพ');
            setIsExporting(false);
            setExportStatus('');
        }
    };

    if (loading) return <div className="p-4 text-center font-sans">กำลังโหลดข้อมูล...</div>;

    return (
        <div className="bg-gradient-to-br from-brand-blue to-brand-blue-light min-h-screen p-4 md:p-8 relative overflow-hidden">
            {/* Background Animation */}
            <BackgroundWallpaper />

            {/* Loading Overlay */}
            {isExporting && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center text-white">
                    <svg className="animate-spin h-10 w-10 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-bold text-lg">{exportStatus}</p>
                </div>
            )}

            <div className="max-w-4xl mx-auto relative z-10">
                 {/* Header & Nav in a white container for readability on blue bg */}
                 <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border border-white/50">
                     <Header />
                     <div>
                         <Link to="/inspect" className="text-brand-blue font-semibold flex items-center space-x-2 w-max hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            <span>กลับไปหน้าประเมิน</span>
                        </Link>
                     </div>
                 </div>

                {/* 3D Dashboard Title Frame */}
                <div className="relative mb-8 mx-auto max-w-3xl text-center">
                    <div className="relative inline-block group cursor-default">
                        {/* 3D Depth Layer behind */}
                        <div className="absolute inset-0 bg-blue-800 rounded-3xl transform translate-x-1.5 translate-y-2 opacity-30 transition-transform duration-300 group-hover:translate-x-2.5 group-hover:translate-y-3"></div>
                        
                        {/* Main Frame */}
                        <div className="relative bg-white border-[3px] border-blue-100 rounded-3xl px-8 py-6 shadow-[0_8px_20px_-6px_rgba(0,119,200,0.15)] transition-all duration-300 hover:shadow-[0_12px_24px_-6px_rgba(0,119,200,0.2)] hover:-translate-y-0.5">
                            {/* Inner decorative gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-transparent rounded-2xl pointer-events-none"></div>
                            
                            {/* Decorative screw/rivet details */}
                            <div className="absolute top-3 left-3 w-2.5 h-2.5 bg-gray-200 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"></div>
                            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-gray-200 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"></div>
                            <div className="absolute bottom-3 left-3 w-2.5 h-2.5 bg-gray-200 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"></div>
                            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 bg-gray-200 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"></div>

                            <div className="relative z-10">
                                <h1 className="text-3xl md:text-5xl font-black text-brand-blue drop-shadow-sm tracking-tight leading-tight">
                                    Dashboard 5ส
                                </h1>
                                <p className="text-xl md:text-2xl font-bold text-gray-500 mt-1">
                                    โรงเรียนเกาะสมุย
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg mb-6 flex flex-col gap-4 border border-white/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap justify-center space-x-2 bg-gray-100 p-1 rounded-lg">
                            {([
                                { key: 'daily', label: 'รายวัน' },
                                { key: 'weekly', label: 'รายสัปดาห์' },
                                { key: 'monthly', label: 'รายเดือน' },
                                { key: 'term1', label: 'เทอม 1' },
                                { key: 'term2', label: 'เทอม 2' }
                            ] as const).map(({key, label}) => (
                                <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === key ? 'bg-brand-blue text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                         <div className="text-center md:text-right flex items-center gap-2">
                             <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">สรุปข้อมูล</h3>
                                <div className="flex gap-2">
                                    <button onClick={handleShare} disabled={isExporting} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-700 disabled:bg-gray-400 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                                        <span>แชร์ (FB)</span>
                                    </button>
                                    <button onClick={handleExportPDF} disabled={isExporting} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-green-600 disabled:bg-gray-400 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                        <span>PDF</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Data Selectors */}
                    {(filter === 'daily' || filter === 'weekly' || filter === 'monthly') && (
                        <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-50 p-3 rounded-lg border border-gray-200 gap-3">
                            <span className="text-gray-700 font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                {filter === 'daily' ? 'เลือกวันที่ต้องการดูข้อมูล:' : 
                                 filter === 'weekly' ? 'เลือกวันในสัปดาห์ที่ต้องการ:' : 'เลือกเดือน:'}
                            </span>
                            {filter === 'monthly' ? (
                                <input 
                                    type="month" 
                                    value={selectedMonth} 
                                    onChange={(e) => setSelectedMonth(e.target.value)} 
                                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:outline-none bg-white"
                                />
                            ) : (
                                <input 
                                    type="date" 
                                    value={selectedDate} 
                                    onChange={(e) => setSelectedDate(e.target.value)} 
                                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:outline-none bg-white"
                                />
                            )}
                            <span className="text-sm text-gray-500">
                                {filter === 'weekly' && "(ระบบจะแสดงข้อมูลทั้งสัปดาห์ของวันที่เลือก)"}
                            </span>
                            
                            {/* Morning/Evening Toggle for Daily View */}
                            {filter === 'daily' && (
                                <div className="flex bg-white rounded-md border border-gray-300 overflow-hidden ml-2">
                                    <button 
                                        onClick={() => setTimeSlotFilter('all')}
                                        className={`px-3 py-2 text-sm font-medium transition-colors ${timeSlotFilter === 'all' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        ทั้งหมด
                                    </button>
                                    <button 
                                        onClick={() => setTimeSlotFilter('morning')}
                                        className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${timeSlotFilter === 'morning' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        เช้า
                                    </button>
                                    <button 
                                        onClick={() => setTimeSlotFilter('evening')}
                                        className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${timeSlotFilter === 'evening' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        เย็น
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
                     <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-700 bg-white inline-block px-6 py-2 rounded-full shadow-sm border border-gray-100">
                            {periodLabel}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Junior High */}
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-gray-600 text-sm mb-1 font-medium bg-white/50 inline-block px-3 py-1 rounded-full">{periodLabel}</p>
                                <h2 className="text-2xl font-bold text-white drop-shadow-md">5 อันดับแรก (ม.ต้น)</h2>
                            </div>
                            <Podium scores={processedScores.junior.slice(0, 5)} />
                             <div className="bg-white p-4 rounded-2xl shadow-lg mt-6">
                                <h3 className="font-semibold text-gray-700 text-lg mb-3">ตารางคะแนนรวม</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {processedScores.junior.slice(5).length > 0 ? processedScores.junior.slice(5).map((s, i) => (
                                        <ScoreCard key={s.classroom} rank={i + 6} classroom={s.classroom} score={s.score} />
                                    )) : <div className="col-span-2 text-gray-500 text-center p-4">ไม่มีข้อมูลอันดับอื่น</div>}
                                </div>
                            </div>
                        </div>

                        {/* Senior High */}
                         <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-gray-600 text-sm mb-1 font-medium bg-white/50 inline-block px-3 py-1 rounded-full">{periodLabel}</p>
                                <h2 className="text-2xl font-bold text-white drop-shadow-md">5 อันดับแรก (ม.ปลาย)</h2>
                            </div>
                            <Podium scores={processedScores.senior.slice(0, 5)} />
                            <div className="bg-white p-4 rounded-2xl shadow-lg mt-6">
                                <h3 className="font-semibold text-gray-700 text-lg mb-3">ตารางคะแนนรวม</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {processedScores.senior.slice(5).length > 0 ? processedScores.senior.slice(5).map((s, i) => (
                                        <ScoreCard key={s.classroom} rank={i + 6} classroom={s.classroom} score={s.score} />
                                    )) : <div className="col-span-2 text-gray-500 text-center p-4">ไม่มีข้อมูลอันดับอื่น</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* Hidden Report for PDF Generation */}
                <div style={{ position: 'fixed', left: '-9999px', top: '0', width: '800px', zIndex: -50 }}>
                    <div ref={reportRef} className="p-8 bg-white font-sans">
                        <h1 className="text-2xl font-bold text-center mb-2">สรุปคะแนน 5ส โรงเรียนเกาะสมุย</h1>
                        <h2 className="text-xl text-center mb-6">{periodLabel}</h2>
                        <ReportTable title="ระดับมัธยมศึกษาตอนต้น" scores={processedScores.junior} />
                        <div className="mt-8"></div>
                        <ReportTable title="ระดับมัธยมศึกษาตอนปลาย" scores={processedScores.senior} />
                    </div>
                </div>
                <div className="mt-8 text-center text-white/80 text-xs pb-4">
                    <p>Version {APP_VERSION}</p>
                    <p className="mt-1">ผู้พัฒนา: คุณครูภานุวัฒน์ ทองจันทร์</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
