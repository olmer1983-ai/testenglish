import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { User, Test, TestResult } from '../types';

interface AppContextType {
  currentUser: User | null;
  tests: Test[];
  results: TestResult[];
  login: (user: User) => void;
  logout: () => void;
  addTest: (test: Test) => void;
  updateTest: (updatedTest: Test) => void;
  deleteTest: (testId: string) => void;
  addResult: (result: TestResult) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [tests, setTests] = useLocalStorage<Test[]>('tests', []);
  const [results, setResults] = useLocalStorage<TestResult[]>('results', []);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const addTest = (test: Test) => {
    setTests(prev => [...prev, test]);
  };
  
  const updateTest = (updatedTest: Test) => {
    setTests(prev => prev.map(t => t.id === updatedTest.id ? updatedTest : t));
  };

  const deleteTest = (testId: string) => {
    setTests(prev => prev.filter(t => t.id !== testId));
  };

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  return (
    <AppContext.Provider value={{ currentUser, tests, results, login, logout, addTest, updateTest, deleteTest, addResult }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext должен использоваться внутри AppProvider');
  }
  return context;
};
