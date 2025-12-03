
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { CLASSROOMS, FIVE_S_CRITERIA, BUILDING_ROOM_MAPPING } from './constants';
import EvaluationModal from './EvaluationModal';
import { Score, Inspection } from './types';
import { db } from './firebase';
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import Header from './Header';

const initialScores: Score[] = FIVE_S_CRITERIA.map(c => ({
  criterionId: c.id,
  criterionName: c.name,
  score: 0,
}));

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
              {[...Array(15)].map((_, i) => (
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

// Simple Toast Notification Component
const Toast = ({ show, message, onClose }: { show: boolean; message: string; onClose: () => void }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-bounce-in">
             <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3">
                <div className="bg-white/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="font-semibold shadow-black">{message}</span>
            </div>
        </div>
    );
};

const InspectionForm: React.FC = () => {
    const { user } = useAuth();
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [classroom, setClassroom] = useState('');
    const [timeSlot, setTimeSlot] = useState<'morning' | 'evening'>('morning');
    const [scores, setScores] = useState<Score[]>(initialScores);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State to hold existing data if we are in "Edit Mode"
    const [existingInspection, setExistingInspection] = useState<Inspection | null>(null);
    const [loadingExisting, setLoadingExisting] = useState(false);
    
    // Toast State
    const [toast, setToast] = useState({ show: false, message: '' });

    // Generate the document ID deterministically to prevent duplicates
    // Format: YYYY-MM-DD_Classroom_TimeSlot
    // Use 'en-CA' locale to ensure YYYY-MM-DD format
    const getDocId = (date: string, room: string, slot: string) => {
        // Sanitize classroom name for ID (replace / with -)
        const safeRoom = room.replace('/', '-');
        return `${date.split('T')[0]}_${safeRoom}_${slot}`;
    };

    // Effect to check if data already exists for this slot
    useEffect(() => {
        if (!classroom || !timeSlot) {
            setExistingInspection(null);
            return;
        }

        setLoadingExisting(true);
        // We use local date YYYY-MM-DD for consistency
        const todayDate = new Date().toLocaleDateString('en-CA'); 
        const docId = getDocId(new Date().toISOString(), classroom, timeSlot);

        // Real-time listener
        const unsubscribe = onSnapshot(doc(db, 'inspections', docId), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setExistingInspection(docSnapshot.data() as Inspection);
            } else {
                setExistingInspection(null);
            }
            setLoadingExisting(false);
        }, (err) => {
            console.error("Error checking existing record:", err);
            setLoadingExisting(false);
        });

        return () => unsubscribe();
    }, [classroom, timeSlot]);

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuilding(e.target.value);
        setClassroom(''); // Reset classroom when building changes
    };

    const handleStartEvaluation = () => {
        if (!classroom || !timeSlot) {
            setError("กรุณาเลือกห้องเรียนและช่วงเวลา");
            return;
        }
        setError(null);
        
        // If editing existing data, load it. Otherwise, use initial scores.
        if (existingInspection) {
            // Map existing scores to ensure structure matches
            const loadedScores = initialScores.map(initScore => {
                const found = existingInspection.scores.find(s => s.criterionId === initScore.criterionId);
                return found || initScore;
            });
            setScores(loadedScores);
        } else {
            setScores(initialScores);
        }
        
        setIsModalOpen(true);
    };

    const handleSaveEvaluation = async (updatedScores: Score[]) => {
        setIsSubmitting(true);
        setError(null);

        if (!user) {
            setError("ไม่พบข้อมูลผู้ใช้");
            setIsSubmitting(false);
            return;
        }

        try {
            const scoresToSave = updatedScores.map(score => ({
                criterionId: score.criterionId,
                criterionName: score.criterionName,
                score: score.score,
            }));
            
            const totalScore = scoresToSave.reduce((acc, s) => acc + (s.score || 0), 0);
            const now = new Date();
            const docId = getDocId(now.toISOString(), classroom, timeSlot);

            const finalInspection: Omit<Inspection, 'id'> = {
                date: now.toISOString(), // Keep full timestamp for display
                timeSlot,
                classroom,
                inspector: user.name,
                inspectorId: user.code,
                scores: scoresToSave,
                totalScore,
            };

            // use setDoc with a specific ID to Update or Create (Upsert)
            // This prevents duplicates effectively.
            await setDoc(doc(db, 'inspections', docId), finalInspection, { merge: true });
            
            setIsModalOpen(false); 
            setToast({ 
                show: true, 
                message: existingInspection ? 'แก้ไขคะแนนเรียบร้อยแล้ว' : 'บันทึกผลการประเมินเรียบร้อยแล้ว' 
            });
            
            // We don't need to manually reset form or savedClassrooms, 
            // the useEffect will auto-detect the new data and switch to "Edit Mode"
        } catch (e) {
            console.error("Error saving inspection: ", e);
            setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine available classrooms based on selected building
    const availableClassrooms = selectedBuilding 
        ? BUILDING_ROOM_MAPPING.find(b => b.name === selectedBuilding)?.rooms || []
        : [];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-light p-4 overflow-hidden">
            <BackgroundWallpaper />
            
            {/* Toast Notification */}
            <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

            <div className="relative z-10 max-w-xl mx-auto">
                <main className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                    <div className="-mb-2">
                        <Header />
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-brand-blue">บันทึกผลการตรวจ 5ส</h2>
                        <p className="text-gray-500">กรุณาเลือกอาคารและห้องเรียนที่ตรวจ</p>
                    </div>

                    {error && <p className="text-red-500 text-center bg-red-100 p-3 rounded-lg">{error}</p>}
                    
                    <div className="space-y-4">
                        {/* Building Selection */}
                        <div>
                            <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">อาคาร</label>
                            <div className="relative">
                                <select
                                    id="building"
                                    value={selectedBuilding}
                                    onChange={handleBuildingChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue appearance-none"
                                >
                                    <option value="" disabled>-- เลือกอาคาร --</option>
                                    {BUILDING_ROOM_MAPPING.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Classroom Selection */}
                        <div className="relative transition-all duration-300">
                            <label htmlFor="classroom" className="block text-sm font-medium text-gray-700 mb-1">
                                ห้องเรียน 
                                {selectedBuilding && <span className="text-brand-blue text-xs ml-2">({selectedBuilding})</span>}
                            </label>
                            <select
                                id="classroom"
                                value={classroom}
                                onChange={(e) => setClassroom(e.target.value)}
                                disabled={!selectedBuilding}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue transition-colors
                                    ${!selectedBuilding ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-900'}
                                `}
                            >
                                <option value="" disabled>
                                    {selectedBuilding ? '-- เลือกห้องเรียน --' : '-- กรุณาเลือกอาคารก่อน --'}
                                </option>
                                {availableClassrooms.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            
                            {/* Option to view all rooms fallback (optional, hidden for now based on request) */}
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="timeSlot" value="morning" checked={timeSlot === 'morning'} onChange={() => setTimeSlot('morning')} className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300" />
                                    <span className="ml-2 text-gray-700">รอบเช้า</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="timeSlot" value="evening" checked={timeSlot === 'evening'} onChange={() => setTimeSlot('evening')} className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300" />
                                    <span className="ml-2 text-gray-700">รอบเย็น</span>
                                 </label>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicator Area */}
                    {classroom && (
                        <div className="flex justify-center animate-fade-in-up">
                            {loadingExisting ? (
                                <span className="text-sm text-gray-400">กำลังตรวจสอบข้อมูล...</span>
                            ) : existingInspection ? (
                                <div className="text-center bg-orange-50 border border-orange-200 rounded-lg p-3 w-full">
                                    <p className="text-orange-600 font-semibold text-sm">
                                        ⚠️ ห้องนี้ได้รับการประเมินแล้ววันนี้
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        โดย {existingInspection.inspector} (คะแนนรวม: {existingInspection.totalScore.toFixed(2)})
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center bg-green-50 border border-green-200 rounded-lg p-3 w-full">
                                    <p className="text-green-600 font-semibold text-sm">
                                        ✨ ยังไม่มีการประเมินในรอบนี้
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="border-t pt-6 space-y-4">
                        <button 
                            onClick={handleStartEvaluation}
                            disabled={!classroom || isSubmitting || loadingExisting}
                            className={`w-full text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed shadow-md flex justify-center items-center gap-2
                                ${existingInspection ? 'bg-orange-500 hover:bg-orange-600' : 'bg-brand-blue hover:bg-brand-blue-light'}
                            `}
                        >
                           {isSubmitting ? (
                               'กำลังบันทึก...'
                           ) : existingInspection ? (
                               <>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                   แก้ไขคะแนนเดิม
                               </>
                           ) : (
                               <>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                                   เริ่มประเมิน
                               </>
                           )}
                        </button>
                         <Link to="/dashboard" className="block text-center w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                            ดู Dashboard
                        </Link>
                    </div>
                </main>
            </div>
            <EvaluationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                scores={scores}
                onSave={handleSaveEvaluation}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default InspectionForm;
