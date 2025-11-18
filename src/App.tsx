import React, { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import TestCreator from './components/TestCreator';
import TestTaker from './components/TestTaker';
import ResultsViewer from './components/ResultsViewer';
import type { Test, TestResult } from './types';

type View = 'login' | 'teacher_dashboard' | 'student_dashboard' | 'create_test' | 'edit_test' | 'view_results' | 'take_test' | 'view_own_result';

const App: React.FC = () => {
    const { currentUser } = useAppContext();
    const [view, setView] = useState<View>(currentUser ? (currentUser.role === 'teacher' ? 'teacher_dashboard' : 'student_dashboard') : 'login');
    const [activeTestId, setActiveTestId] = useState<string | null>(null);
    const [activeResult, setActiveResult] = useState<TestResult | null>(null);
    const [editingTest, setEditingTest] = useState<Test | null>(null);

    useEffect(() => {
        // Этот эффект синхронизирует вид с состоянием входа пользователя.
        // Он исправляет вид после входа и сбрасывает его после выхода.
        if (currentUser && view === 'login') {
            setView(currentUser.role === 'teacher' ? 'teacher_dashboard' : 'student_dashboard');
        } else if (!currentUser) {
            setView('login');
        }
    }, [currentUser]);

    const handleCreateTest = () => {
        setEditingTest(null);
        setView('create_test');
    };

    const handleEditTest = (test: Test) => {
        setEditingTest(test);
        setView('edit_test');
    };
    
    const handleSaveTest = () => {
        setEditingTest(null);
        setView('teacher_dashboard');
    }

    const handleViewResults = (testId: string) => {
        setActiveTestId(testId);
        setView('view_results');
    };
    
    const handleTakeTest = (testId: string) => {
        setActiveTestId(testId);
        setView('take_test');
    };
    
    const handleFinishTest = (result: TestResult) => {
        setActiveResult(result);
        setView('view_own_result');
    };
    
    const backToDashboard = () => {
        setActiveTestId(null);
        setActiveResult(null);
        setEditingTest(null);
        if (currentUser) {
            setView(currentUser.role === 'teacher' ? 'teacher_dashboard' : 'student_dashboard');
        } else {
            setView('login');
        }
    };
    
    if (!currentUser) {
        return <Login onLogin={() => { /* Теперь обрабатывается через useEffect */ }} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {view === 'teacher_dashboard' && <TeacherDashboard onCreateTest={handleCreateTest} onViewResults={handleViewResults} onEditTest={handleEditTest} />}
            {view === 'student_dashboard' && <StudentDashboard onTakeTest={handleTakeTest} />}
            {(view === 'create_test' || view === 'edit_test') && <TestCreator onSave={handleSaveTest} onCancel={backToDashboard} existingTest={editingTest} />}
            {view === 'view_results' && activeTestId && <ResultsViewer testId={activeTestId} onBack={backToDashboard} />}
            {view === 'take_test' && activeTestId && <TestTaker testId={activeTestId} onFinish={handleFinishTest} />}
            {view === 'view_own_result' && activeResult && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Результаты теста</h1>
                        <p className="text-xl text-gray-600 mb-2">Тест: "{activeResult.testTitle}"</p>
                        <p className="text-5xl font-extrabold text-indigo-600 my-6">
                            {activeResult.score} / {activeResult.totalQuestions}
                        </p>
                        <p className="text-lg text-gray-700">Вы ответили правильно на {activeResult.score} из {activeResult.totalQuestions} вопросов.</p>
                        <button onClick={backToDashboard} className="mt-8 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300">
                            Вернуться на главную
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;