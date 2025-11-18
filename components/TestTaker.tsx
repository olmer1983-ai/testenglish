
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { TestResult } from '../types';

interface TestTakerProps {
    testId: string;
    onFinish: (result: TestResult) => void;
}

const TestTaker: React.FC<TestTakerProps> = ({ testId, onFinish }) => {
    const { currentUser, tests, addResult } = useAppContext();
    const test = tests.find(t => t.id === testId);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    if (!test) {
        return <div className="p-8 text-center text-red-500">Тест не найден.</div>;
    }

    const { questions } = test;
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Finish test
            let score = 0;
            questions.forEach(q => {
                if (answers[q.id] === q.correctAnswerId) {
                    score++;
                }
            });

            const result: TestResult = {
                id: Date.now().toString(),
                studentName: currentUser!.fullName,
                testId: test.id,
                testTitle: test.title,
                score,
                totalQuestions: questions.length,
                date: new Date().toLocaleString('ru-RU'),
            };

            addResult(result);
            onFinish(result);
        }
    };

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                             <h1 className="text-xl font-bold text-gray-800">{test.title}</h1>
                             <p className="text-gray-500 font-semibold">Вопрос {currentQuestionIndex + 1} из {questions.length}</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{currentQuestion.questionText}</h2>
                        <div className="space-y-4">
                            {currentQuestion.options.map(option => (
                                <label key={option.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${answers[currentQuestion.id] === option.id ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={option.id}
                                        checked={answers[currentQuestion.id] === option.id}
                                        onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className="ml-4 text-lg text-gray-800">{option.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-8 text-right">
                        <button
                            onClick={handleNext}
                            disabled={!answers[currentQuestion.id]}
                            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestTaker;
