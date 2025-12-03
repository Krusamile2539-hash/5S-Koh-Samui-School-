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
        <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <AppLogo className="w-12 h-12" />
                <div>
                    <p className="text-sm text-gray-600">ยินดีต้อนรับ</p>
                    <h1 className="font-bold text-gray-800">{user?.name}</h1>
                </div>
            </div>
            <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:text-red-800">
                ออกจากระบบ
            </button>
        </header>
    );
};

export default Header;
