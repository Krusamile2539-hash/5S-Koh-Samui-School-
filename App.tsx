
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import { InspectionProvider } from './useInspections';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import InspectionForm from './InspectionForm';

const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen font-sans">กำลังโหลด...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
    const { user, loading } = useAuth();
     
    if (loading) {
        return <div className="flex justify-center items-center h-screen font-sans">กำลังโหลด...</div>;
    }

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
                <Route path="/inspect" element={<InspectionForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<Navigate to={user ? "/inspect" : "/home"} replace />} />
        </Routes>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <InspectionProvider>
                <HashRouter>
                    <AppRoutes />
                </HashRouter>
            </InspectionProvider>
        </AuthProvider>
    );
};

export default App;