
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
      <div className="relative z-10 w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <AppLogo className="w-32 h-32 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">5ส Check-in</h1>
        <p className="text-gray-500 mb-8">โรงเรียนเกาะสมุย</p>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="กรุณาใส่รหัสครูผู้ตรวจ"
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-lg p-3 text-center text-gray-700 focus:outline-none focus:border-brand-blue"
              aria-label="รหัสครูผู้ตรวจ"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !code}
              className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blue-light transition-transform transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:scale-100"
            >
              {isLoading ? 'กำลังตรวจสอบ...' : 'ลงชื่อเข้าใช้'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Version {APP_VERSION}</p>
            <p className="text-xs text-gray-400 mt-1">ผู้พัฒนา: คุณครูภานุวัฒน์ ทองจันทร์</p>
            <button onClick={handleReset} className="mt-2 text-xs text-brand-blue/70 underline hover:text-brand-blue">
                หากพบปัญหา หรือแอปไม่อัปเดต กดที่นี่
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
