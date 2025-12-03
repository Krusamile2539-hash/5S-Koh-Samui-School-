
import React from 'react';
import type { ClassroomScore } from './types';

interface ReportTableProps {
  title: string;
  scores: ClassroomScore[];
}

const ReportTable: React.FC<ReportTableProps> = ({ title, scores }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">อันดับ</th>
            <th className="border border-gray-300 p-2 text-left">ห้องเรียน</th>
            <th className="border border-gray-300 p-2 text-left">คะแนนเฉลี่ย</th>
          </tr>
        </thead>
        <tbody>
          {scores.length > 0 ? (
            scores.map((s, index) => (
              <tr key={s.classroom}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{s.classroom}</td>
                <td className="border border-gray-300 p-2">{s.score.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border border-gray-300 p-2 text-center text-gray-500">ไม่มีข้อมูลสำหรับช่วงเวลานี้</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
