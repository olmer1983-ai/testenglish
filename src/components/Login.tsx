import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { User } from '../types';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [role, setRole] = useState<'teacher' | 'student'>('student');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const { login } = useAppContext();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (fullName.trim().length < 3) {
            setError('Пожалуйста, введите ваше полное ФИО.');
            return;
        }
        const user: User = { role, fullName: fullName.trim() };
        login(user);
        onLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать</h1>
                    <p className="mt-2 text-gray-600">Система тестирования по английскому языку</p>
                </div>
                <div className="flex border-2 border-indigo-500 rounded-xl p-1">
                    <button
                        onClick={() => setRole('student')}
                        className={`w-1/2 py-3 rounded-lg font-semibold transition-colors duration-300 ${role === 'student' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                    >
                        Я Ученик
                    </button>
                    <button
                        onClick={() => setRole('teacher')}
                        className={`w-1/2 py-3 rounded-lg font-semibold transition-colors duration-300 ${role === 'teacher' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                    >
                        Я Учитель
                    </button>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="fullName" className="text-sm font-bold text-gray-700 tracking-wide">
                            Ваше ФИО
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full mt-2 p-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Иванов Иван Иванович"
                        />
                         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 duration-300"
                        >
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
