

import React, { useMemo } from 'react';
import { JUNIOR_HIGH_PREFIXES, SENIOR_HIGH_PREFIXES } from './constants';
import type { Inspection } from './types';
import EvidenceCard from './EvidenceCard';

interface EvidenceViewProps {
  inspections: Inspection[];
  onClose: () => void;
}

const EvidenceView: React.FC<EvidenceViewProps> = ({ inspections, onClose }) => {
  const photosByClassroom = useMemo(() => {
    const data: { [classroom: string]: string[] } = {};
    inspections.forEach(inspection => {
      if (!data[inspection.classroom]) {
        data[inspection.classroom] = [];
      }
      inspection.scores.forEach(score => {
        if (score.photo) {
          // Add only unique photos
          if (!data[inspection.classroom].includes(score.photo)) {
             data[inspection.classroom].push(score.photo);
          }
        }
      });
    });
    return data;
  }, [inspections]);

  const { juniorClassrooms, seniorClassrooms } = useMemo(() => {
    const inspectedClassrooms = [...new Set(inspections.map(i => i.classroom))];
    
    // Fix: Explicitly type the parameters in the filter and sort callbacks to
    // resolve a potential type inference issue where they are treated as `unknown`.
    // This ensures that string methods like `startsWith` and `localeCompare` can be safely called.
    const junior = inspectedClassrooms
      .filter((c: string) => JUNIOR_HIGH_PREFIXES.some(p => c.startsWith(p)))
      .sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }));

    const senior = inspectedClassrooms
      .filter((c: string) => SENIOR_HIGH_PREFIXES.some(p => c.startsWith(p)))
      .sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }));

    return { juniorClassrooms: junior, seniorClassrooms: senior };
  }, [inspections]);


  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-blue">หลักฐานรูปภาพ</h1>
          <button onClick={onClose} className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-brand-blue-light transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>กลับไปแดชบอร์ด</span>
          </button>
        </div>

        {/* Junior High Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-brand-blue-light">ระดับมัธยมศึกษาตอนต้น</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {juniorClassrooms.length > 0 ? (
                juniorClassrooms.map(classroom => (
                  <EvidenceCard
                    key={classroom}
                    classroom={classroom}
                    images={photosByClassroom[classroom] || []}
                  />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 py-4">ไม่มีข้อมูลการประเมินสำหรับระดับชั้นนี้ในช่วงเวลาที่เลือก</p>
            )}
          </div>
        </div>

        {/* Senior High Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-brand-blue-light">ระดับมัธยมศึกษาตอนปลาย</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {seniorClassrooms.length > 0 ? (
                seniorClassrooms.map(classroom => (
                  <EvidenceCard
                    key={classroom}
                    classroom={classroom}
                    images={photosByClassroom[classroom] || []}
                  />
                ))
             ) : (
                <p className="col-span-full text-center text-gray-500 py-4">ไม่มีข้อมูลการประเมินสำหรับระดับชั้นนี้ในช่วงเวลาที่เลือก</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceView;