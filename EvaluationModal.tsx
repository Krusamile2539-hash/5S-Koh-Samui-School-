
import React, { useState, useEffect } from 'react';
import { FIVE_S_CRITERIA } from './constants';
import type { Score } from './types';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: Score[];
  onSave: (scores: Score[]) => void;
  isSubmitting: boolean;
}

const StarRating: React.FC<{ score: number; onChange: (score: number) => void }> = ({ score, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => onChange(star)}
          className={`w-6 h-6 cursor-pointer ${star <= score ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.447a1 1 0 00-1.176 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
};

const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, onClose, scores, onSave, isSubmitting }) => {
  const [internalScores, setInternalScores] = useState<Score[]>(scores);

  useEffect(() => {
    setInternalScores(scores);
  }, [scores, isOpen]);

  const handleScoreChange = (criterionId: string, score: number) => {
    setInternalScores(prev => prev.map(s => s.criterionId === criterionId ? { ...s, score } : s));
  };
  
  const handleSave = () => {
    onSave(internalScores);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={isSubmitting ? undefined : onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-center text-gray-800">ประเมิน 5 ส</h2>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            {FIVE_S_CRITERIA.map(criterion => {
              const currentScore = internalScores.find(s => s.criterionId === criterion.id);
              return (
                <div key={criterion.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">{criterion.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{criterion.description}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <StarRating score={currentScore?.score || 0} onChange={(score) => !isSubmitting && handleScoreChange(criterion.id, score)} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t flex justify-end space-x-3">
            <button onClick={onClose} disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">ยกเลิก</button>
            <button 
                onClick={handleSave} 
                disabled={isSubmitting} 
                className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] transition-all duration-200"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังบันทึก...
                    </>
                ) : 'บันทึก'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvaluationModal;
