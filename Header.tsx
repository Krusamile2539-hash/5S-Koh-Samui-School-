
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import AppLogo from './AppLogo';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center mb-6 relative z-20">
            <style>
                {`
                @keyframes float-logo-mini {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-3px) rotate(2deg); }
                }
                @keyframes pop-up-header {
                    0% { opacity: 0; transform: scale(0.9) translateY(5px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes shimmer-header {
                    0% { background-position: -100% 50%; }
                    100% { background-position: 200% 50%; }
                }
                @keyframes underline-expand-header {
                    0% { width: 0%; opacity: 0; }
                    100% { width: 100%; opacity: 1; }
                }
                .text-shimmer-header {
                    background: linear-gradient(90deg, #1f2937 0%, #0077C8 45%, #1f2937 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }
                `}
            </style>
            <div className="flex items-center gap-3">
                <div style={{ animation: 'float-logo-mini 4s ease-in-out infinite' }}>
                    <AppLogo className="w-14 h-14 drop-shadow-md" />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-xs text-gray-500 font-medium" style={{ animation: 'pop-up-header 0.5s ease-out forwards' }}>
                        ยินดีต้อนรับ
                    </p>
                    <div className="relative inline-block">
                        <h1 
                            className="font-bold text-lg text-shimmer-header" 
                            style={{ 
                                animation: 'pop-up-header 0.6s ease-out 0.1s forwards, shimmer-header 3s linear infinite', 
                                opacity: 0 
                            }}
                        >
                            {user?.name}
                        </h1>
                        {/* Animated Underline */}
                        <div 
                            className="h-0.5 bg-gradient-to-r from-brand-blue to-cyan-400 rounded-full absolute -bottom-0.5 left-0" 
                            style={{ 
                                animation: 'underline-expand-header 0.6s ease-out 0.3s forwards', 
                                width: '0%', 
                                opacity: 0 
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <button 
                onClick={handleLogout} 
                className="text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
            >
                ออกจากระบบ
            </button>
        </header>
    );
};

export default Header;
