import React from 'react';

interface TestPlanCardProps {
  testPlan: {
    plan_name: string;
    total_test_cases: number;
    passed_test_cases: string;
    failed_test_cases: string;
  };
}

const TestPlanCard: React.FC<TestPlanCardProps> = ({ testPlan }) => {
  return (
    <div className="bg-purple-50 shadow-lg rounded-lg p-4 mb-4 border-l-4 border-purple-500">
      <h3 className="text-xl font-semibold text-purple-700">{testPlan.plan_name}</h3>
      <p className="text-gray-800">Total de Casos de Prueba: {testPlan.total_test_cases}</p>
      <p className="text-green-600 font-semibold">Aprobados: {testPlan.passed_test_cases}</p>
      <p className="text-red-600 font-semibold">Fallidos: {testPlan.failed_test_cases}</p>
    </div>
  );
};

export default TestPlanCard;
