
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Header from './common/Header';

interface StudentDashboardProps {
    onTakeTest: (testId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onTakeTest }) => {
    const { tests } = useAppContext();

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Доступные тесты</h1>
                {tests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map(test => (
                            <div key={test.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{test.title}</h2>
                                    <p className="text-gray-500 mt-2">Составитель: {test.teacherName}</p>
                                    <p className="text-gray-500">{test.questions.length} вопросов</p>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={() => onTakeTest(test.id)}
                                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                                    >
                                        Начать тест
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700">Пока нет доступных тестов</h2>
                        <p className="text-gray-500 mt-2">Попросите вашего учителя создать тест.</p>
                    </div>
                )}
            </main>
        </>
    );
};

export default StudentDashboard;
