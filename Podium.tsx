
import React from 'react';
import type { ClassroomScore } from './types';

interface PodiumItemProps {
  rank: number;
  scoreData?: ClassroomScore;
  trophy: string;
  color: string;
  height: string;
  order: string;
}

const FireworksBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <style>
      {`
        @keyframes firework-rise {
          0% { transform: translateY(100%) scale(0); opacity: 0; }
          50% { transform: translateY(-20%) scale(1); opacity: 1; }
          100% { transform: translateY(-20%) scale(1.5); opacity: 0; }
        }
        @keyframes particle-burst {
           0% { transform: translate(0, 0); opacity: 1; }
           100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
        }
        .particle {
            position: absolute;
            top: 0; left: 0;
            width: 4px; 
            height: 4px;
            border-radius: 50%;
            opacity: 0;
        }
      `}
    </style>
    {/* Simple CSS Fireworks simulation */}
    {[...Array(3)].map((_, i) => (
        <div key={i} className="absolute bottom-0" style={{ 
            left: `${20 + i * 30}%`, 
            animation: `firework-rise 2.5s infinite ${i * 0.8}s ease-out` 
        }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF'][i] }}>
                 {/* Explosion particles */}
                 {[...Array(12)].map((__, j) => {
                     const angle = (j * 30) * (Math.PI / 180);
                     const dist = 40;
                     const tx = Math.cos(angle) * dist + 'px';
                     const ty = Math.sin(angle) * dist + 'px';
                     return (
                         <div key={j} className="particle" style={{
                             backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF'][i],
                             '--tx': tx,
                             '--ty': ty,
                             animation: `particle-burst 1s infinite ${0.5 + i * 0.8}s ease-out`
                         } as any} />
                     );
                 })}
            </div>
        </div>
    ))}
  </div>
);

const PodiumItem: React.FC<PodiumItemProps> = ({ rank, scoreData, trophy, color, height, order }) => (
    <div className={`flex flex-col items-center w-1/5 text-center px-1 ${order}`}>
        <div className="h-20 flex flex-col justify-end items-center">
            {scoreData ? (
                <>
                    <span className="text-4xl">{trophy}</span>
                    <p className="font-bold text-gray-800 text-md truncate w-full" title={scoreData.classroom}>{scoreData.classroom}</p>
                    <p className="text-sm text-gray-600 font-semibold">{scoreData.score.toFixed(2)}</p>
                </>
            ) : <span className="text-4xl opacity-30">?</span>}
        </div>
        <div className={`${height} ${color} w-full rounded-t-lg flex items-center justify-center text-white text-4xl font-extrabold shadow-lg border-b-4 border-black/20`}>
            {rank}
        </div>
    </div>
);


const Podium: React.FC<{ scores: ClassroomScore[] }> = ({ scores }) => {
  return (
    <div className="relative h-64 bg-gray-100 rounded-xl p-4 overflow-hidden">
        <FireworksBackground />
        <div className="relative z-10 flex justify-center items-end h-full w-full">
            {/* Rank 4 */}
            <PodiumItem rank={4} scoreData={scores[3]} trophy="🏆" color="bg-pink-400" height="h-24" order="order-3" />
            
            {/* Rank 2 */}
            <PodiumItem rank={2} scoreData={scores[1]} trophy="🥈" color="bg-slate-400" height="h-32" order="order-1" />

            {/* Rank 1 */}
            <PodiumItem rank={1} scoreData={scores[0]} trophy="🥇" color="bg-yellow-400" height="h-40" order="order-2" />

            {/* Rank 3 */}
            <PodiumItem rank={3} scoreData={scores[2]} trophy="🥉" color="bg-orange-400" height="h-28" order="order-4" />
            
            {/* Rank 5 */}
            <PodiumItem rank={5} scoreData={scores[4]} trophy="🏆" color="bg-pink-400" height="h-20" order="order-5" />
        </div>
    </div>
  );
};

export default Podium;
