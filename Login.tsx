
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';
import { useAuth } from './useAuth';
import { APP_VERSION } from './constants';

const BackgroundWallpaper = () => {
  // Use a long string of the 5S words repeated to ensure seamless looping
  const text = "สะสาง สะดวก สะอาด สุขลักษณะ สร้างนิสัย ";
  // Create a very long string to cover wide screens before wrapping
  const repeatedText = Array(20).fill(text).join(" • ");

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
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
            
            /* New Animations */
            @keyframes text-shimmer {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
            }
            @keyframes slide-up-fade {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes float-logo {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-8px) rotate(2deg); }
            }
            @keyframes underline-expand {
                0% { width: 0%; opacity: 0; }
                100% { width: 50%; opacity: 1; }
            }
            .title-animate {
                background-size: 200% auto;
                animation: slide-up-fade 0.8s ease-out forwards, text-shimmer 3s linear infinite;
            }
            .fade-in-delayed {
                animation: slide-up-fade 0.8s ease-out forwards;
                opacity: 0;
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

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
        const success = login(code);
        if (success) {
            navigate('/inspect');
        } else {
            setError('รหัสไม่ถูกต้อง กรุณาลองอีกครั้ง');
        }
        setIsLoading(false);
    }, 500);
  };

  const handleReset = async () => {
    if (!window.confirm('ยืนยันการรีเซ็ตเพื่ออัปเดตแอป? (จะต้องลงชื่อเข้าใช้ใหม่)')) return;
    
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-light p-4 overflow-hidden">
      <BackgroundWallpaper />
      <div className="relative z-10 w-full max-w-sm mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border border-white/50">
        
        {/* Animated Logo */}
        <div className="mb-6" style={{ animation: 'float-logo 5s ease-in-out infinite' }}>
          <AppLogo className="w-32 h-32 mx-auto drop-shadow-lg" />
        </div>
        
        {/* Animated Title Section */}
        <div className="mb-8">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-blue-400 to-brand-blue title-animate mb-2" style={{ animationDelay: '0.1s' }}>
                5ส Check-in
            </h1>
            
            {/* Expanding Underline */}
            <div className="h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent mx-auto rounded-full mb-3" style={{ animation: 'underline-expand 0.8s ease-out forwards 0.5s', width: '0%', opacity: 0 }}></div>
            
            <p className="text-gray-500 font-medium text-lg fade-in-delayed" style={{ animationDelay: '0.3s' }}>
                โรงเรียนเกาะสมุย
            </p>
        </div>
        
        <form onSubmit={handleLogin} className="fade-in-delayed" style={{ animationDelay: '0.5s' }}>
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="กรุณาใส่รหัสครูผู้ตรวจ"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all shadow-inner"
              aria-label="รหัสครูผู้ตรวจ"
            />
            {error && <p className="text-red-500 text-sm animate-pulse">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !code}
              className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blue-light transition-all transform hover:scale-[1.02] active:scale-95 shadow-md disabled:bg-gray-400 disabled:scale-100"
            >
              {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังตรวจสอบ...
                  </span>
              ) : 'ลงชื่อเข้าใช้'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-4 border-t border-gray-100 fade-in-delayed" style={{ animationDelay: '0.7s' }}>
            <p className="text-xs text-gray-400">Version {APP_VERSION}</p>
            <p className="text-xs text-gray-400 mt-1">ผู้พัฒนา: คุณครูภานุวัฒน์ ทองจันทร์</p>
            <button onClick={handleReset} className="mt-2 text-xs text-brand-blue/70 underline hover:text-brand-blue transition-colors">
                หากพบปัญหา หรือแอปไม่อัปเดต กดที่นี่
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
