import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Header from './common/Header';
import Modal from './common/Modal';
import EditIcon from './icons/EditIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import type { Test } from '../types';


interface TeacherDashboardProps {
    onCreateTest: () => void;
    onViewResults: (testId: string) => void;
    onEditTest: (test: Test) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onCreateTest, onViewResults, onEditTest }) => {
    const { currentUser, tests, deleteTest } = useAppContext();
    const [testToDelete, setTestToDelete] = useState<Test | null>(null);

    const myTests = tests.filter(test => test.teacherName === currentUser?.fullName);

    const handleDeleteClick = (test: Test) => {
        setTestToDelete(test);
    };

    const confirmDelete = () => {
        if (testToDelete) {
            deleteTest(testToDelete.id);
            setTestToDelete(null);
        }
    };

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Мои тесты</h1>
                    <button
                        onClick={onCreateTest}
                        className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                    >
                        <PlusIcon />
                        Создать новый тест
                    </button>
                </div>
                {myTests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTests.map(test => (
                            <div key={test.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{test.title}</h2>
                                    <p className="text-gray-500 mt-2">{test.questions.length} вопросов</p>
                                </div>
                                <div className="mt-6 flex flex-col space-y-3">
                                     <button onClick={() => onViewResults(test.id)} className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                                        Посмотреть результаты
                                    </button>
                                    <div className="flex space-x-3">
                                        <button onClick={() => onEditTest(test)} className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">
                                            <EditIcon />
                                            <span>Редактировать</span>
                                        </button>
                                        <button onClick={() => handleDeleteClick(test)} className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-200 transition duration-300">
                                            <TrashIcon />
                                           <span>Удалить</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700">У вас пока нет тестов</h2>
                        <p className="text-gray-500 mt-2">Нажмите "Создать новый тест", чтобы начать.</p>
                    </div>
                )}
            </main>
            {testToDelete && (
                <Modal
                    title="Подтвердите удаление"
                    onClose={() => setTestToDelete(null)}
                    onConfirm={confirmDelete}
                >
                    <p>Вы уверены, что хотите удалить тест "{testToDelete.title}"? Это действие нельзя будет отменить.</p>
                </Modal>
            )}
        </>
    );
};

export default TeacherDashboard;
