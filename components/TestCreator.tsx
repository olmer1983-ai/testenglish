import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Test, Question, AnswerOption } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface TestCreatorProps {
    onSave: () => void;
    onCancel: () => void;
    existingTest: Test | null;
}

const TestCreator: React.FC<TestCreatorProps> = ({ onSave, onCancel, existingTest }) => {
    const { currentUser, addTest, updateTest } = useAppContext();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (existingTest) {
            setTitle(existingTest.title);
            setQuestions(existingTest.questions);
        } else {
            setTitle('');
            setQuestions([]);
        }
    }, [existingTest]);

    const createId = () => Date.now().toString() + Math.random().toString(36).substring(2);

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: createId(),
            questionText: '',
            options: [],
            correctAnswerId: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleQuestionChange = (qIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionText = value;
        setQuestions(newQuestions);
    };
    
    const handleDeleteQuestion = (qIndex: number) => {
        setQuestions(questions.filter((_, index) => index !== qIndex));
    };

    const handleAddOption = (qIndex: number) => {
        const newOption: AnswerOption = { id: createId(), text: '' };
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push(newOption);
        setQuestions(newQuestions);
    };
    
    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuestions(newQuestions);
    };
    
    const handleDeleteOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, index) => index !== oIndex);
        setQuestions(newQuestions);
    };

    const handleSetCorrectAnswer = (qIndex: number, optionId: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswerId = optionId;
        setQuestions(newQuestions);
    };
    
    const validateTest = (): boolean => {
        if (!title.trim()) return false;
        if (questions.length === 0) return false;
        for (const q of questions) {
            if (!q.questionText.trim()) return false;
            if (q.options.length < 2) return false;
            if (!q.correctAnswerId) return false;
            for (const o of q.options) {
                if (!o.text.trim()) return false;
            }
        }
        return true;
    };

    const handleSaveTest = () => {
        if (!validateTest()) {
            alert("Пожалуйста, заполните все поля, добавьте как минимум 2 варианта ответа на каждый вопрос и выберите правильный ответ.");
            return;
        }
        
        if (existingTest) {
             const updatedTest: Test = { ...existingTest, title, questions };
             updateTest(updatedTest);
        } else {
             const newTest: Test = {
                id: createId(),
                title,
                teacherName: currentUser!.fullName,
                questions
            };
            addTest(newTest);
        }
        onSave();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onCancel} className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition">
                         <ChevronLeftIcon />
                        <span>Назад</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">{existingTest ? 'Редактирование теста' : 'Создание нового теста'}</h1>
                     <div className="w-24"></div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="mb-6">
                        <label htmlFor="testTitle" className="block text-lg font-semibold text-gray-700 mb-2">Название теста</label>
                        <input
                            id="testTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например: Present Simple Tense"
                            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <div key={q.id} className="border border-gray-200 p-6 rounded-xl bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <textarea
                                        value={q.questionText}
                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                        placeholder={`Текст вопроса №${qIndex + 1}`}
                                        className="w-full p-2 text-md font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                                        rows={2}
                                    />
                                    <button onClick={() => handleDeleteQuestion(qIndex)} className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition">
                                        <TrashIcon />
                                    </button>
                                </div>
                                
                                <p className="text-sm font-semibold text-gray-600 mb-3 pl-4">Выберите правильный ответ:</p>

                                <div className="space-y-3 pl-4">
                                {q.options.map((opt, oIndex) => (
                                    <div key={opt.id} className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name={`correct-answer-${q.id}`}
                                            checked={q.correctAnswerId === opt.id}
                                            onChange={() => handleSetCorrectAnswer(qIndex, opt.id)}
                                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            aria-label={`Отметить как правильный для варианта ${oIndex + 1}`}
                                        />
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Вариант ответа ${oIndex + 1}`}
                                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400"
                                        />
                                        <button onClick={() => handleDeleteOption(qIndex, oIndex)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                </div>

                                <button onClick={() => handleAddOption(qIndex)} className="mt-4 flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition">
                                    <PlusIcon className="w-4 h-4"/>
                                    Добавить вариант ответа
                                </button>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleAddQuestion} className="mt-6 flex items-center gap-2 bg-indigo-100 text-indigo-700 font-bold py-3 px-5 rounded-lg hover:bg-indigo-200 transition w-full justify-center">
                        <PlusIcon />
                        Добавить вопрос
                    </button>
                    
                    <div className="mt-8 flex justify-end gap-4">
                        <button onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition">
                            Отмена
                        </button>
                        <button onClick={handleSaveTest} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition">
                            {existingTest ? 'Сохранить изменения' : 'Сохранить тест'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCreator;