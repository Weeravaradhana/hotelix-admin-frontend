import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
   /* const userRole = getUserRole();*/

    const handleLogout = () => {
       /* removeAccessToken();*/
        setMenuOpen(false);
        window.location.href = '/login';
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 bg-blue-700 border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/tenants')}
                    >
                        <div className="text-3xl">🏢</div>
                        <h1 className="text-lg font-bold tracking-wide  text-white">
                            Tenant Management
                        </h1>
                    </div>

                    <div className="relative flex items-center gap-4">
            <span className="text-sm font-semibold text-yellow-500">
             {/* {userRole}*/}
            </span>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400 text-blue-900 font-bold hover:opacity-90"
                        >
                            👤
                        </button>

                        {/* Dropdown */}
                        {menuOpen && (
                            <div className="absolute right-0 top-12 w-40 bg-white border border-gray-200 rounded-lg shadow-md">
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-grow px-6 py-8">
                <div className="max-w-screen-xl mx-auto">
                    {children}
                </div>
            </main>
            <footer className="bg-blue-900 text-white text-center py-4">
                <p className="text-sm">
                    © {new Date().getFullYear()} Tenant Management System. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Layout;
