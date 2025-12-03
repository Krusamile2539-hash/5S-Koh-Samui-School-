import React, { useState, useEffect } from 'react';

interface EvidenceCardProps {
  classroom: string;
  images: string[];
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({ classroom, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // รีเซ็ตสถานะ Error เมื่อรูปภาพเปลี่ยนไป
  useEffect(() => {
    setImageError(false);
  }, [currentIndex, images]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const renderImageContent = () => {
    if (imageError) {
      return (
        <div className="text-center p-2 flex flex-col items-center justify-center h-full text-red-600 bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-semibold text-sm">ไม่สามารถโหลดรูปได้</p>
          <p className="text-xs">กรุณาตรวจสอบการตั้งค่าสิทธิ์</p>
        </div>
      );
    }
    return (
       <img 
        src={images[currentIndex]} 
        alt={`หลักฐานห้อง ${classroom} ${currentIndex + 1}`} 
        className="w-full h-full object-cover" 
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  };


  return (
    <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col transition-transform hover:scale-105 hover:shadow-xl">
      <h3 className="font-bold text-gray-800 mb-2 text-center truncate">{classroom}</h3>
      <div className="relative w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {images.length > 0 ? (
          <>
            {renderImageContent()}
            {images.length > 1 && !imageError && (
              <>
                <button 
                  onClick={goToPrevious} 
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 focus:outline-none transition-opacity opacity-50 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button 
                  onClick={goToNext} 
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 focus:outline-none transition-opacity opacity-50 hover:opacity-100"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-mono">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            <p className="text-gray-500 text-sm mt-2">ไม่มีรูปภาพ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceCard;
