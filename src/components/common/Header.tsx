import React from 'react';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
    const { currentUser, logout } = useAppContext();

    if (!currentUser) return null;

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <span className="text-lg font-semibold text-gray-800">{currentUser.fullName}</span>
                    <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                        {currentUser.role === 'teacher' ? 'Учитель' : 'Ученик'}
                    </span>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Выйти
                </button>
            </div>
        </header>
    );
};

export default Header;
