import React, { createContext, useContext, useState } from 'react';

// Define la estructura del caso de prueba
export interface TestCase {
  test_case_id: number; // Incluye el ID del caso de prueba para identificarlo
  name: string;
  assignedTo: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
}

// Define el tipo del contexto
interface TestCaseContextType {
  testCases: TestCase[];
  addTestCase: (testCase: TestCase) => void;
  updateTestCase: (updatedTestCase: TestCase) => void; // Nueva función para actualizar un caso de prueba
}

// Crea el contexto
const TestCaseContext = createContext<TestCaseContextType | undefined>(undefined);

// Proveedor del contexto
export const TestCaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const addTestCase = (testCase: TestCase) => {
    setTestCases((prev) => [...prev, testCase]);
  };

  // Función para actualizar un caso de prueba existente
  const updateTestCase = (updatedTestCase: TestCase) => {
    setTestCases((prevTestCases) =>
      prevTestCases.map((testCase) =>
        testCase.test_case_id === updatedTestCase.test_case_id ? updatedTestCase : testCase
      )
    );
  };
  return (
    <TestCaseContext.Provider value={{ testCases, addTestCase, updateTestCase }}>
      {children}
    </TestCaseContext.Provider>
  );
};

// Hook para usar el contexto
export const useTestCaseContext = () => {
  const context = useContext(TestCaseContext);
  if (!context) {
    throw new Error('useTestCaseContext must be used within a TestCaseProvider');
  }
  return context;
};
