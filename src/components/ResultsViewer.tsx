import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface ResultsViewerProps {
    testId: string;
    onBack: () => void;
}

const ResultsViewer: React.FC<ResultsViewerProps> = ({ testId, onBack }) => {
    const { tests, results } = useAppContext();
    const test = tests.find(t => t.id === testId);
    const testResults = results.filter(r => r.testId === testId).sort((a,b) => b.score - a.score);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResults = testResults.filter(r => 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!test) {
        return <div className="p-8 text-center text-red-500">Тест не найден.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-4xl">
                 <div className="flex items-center mb-6">
                    <button onClick={onBack} className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition mr-4">
                         <ChevronLeftIcon />
                        <span>Назад</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Результаты теста: {test.title}</h1>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Поиск по ФИО ученика..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {filteredResults.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО Ученика</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Результат</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата прохождения</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredResults.map(result => (
                                    <tr key={result.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.studentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="font-semibold text-lg text-indigo-600">{result.score}</span> / {result.totalQuestions}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="text-center py-20">
                            <h2 className="text-xl font-semibold text-gray-700">Результаты не найдены</h2>
                            <p className="text-gray-500 mt-2">{testResults.length > 0 ? 'Попробуйте изменить поисковый запрос.' : 'Этот тест еще никто не прошел.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsViewer;
