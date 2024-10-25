import React from 'react';

interface DefectCardProps {
  defect: {
    defect_description: string;
    severity: 'High' | 'Medium' | 'Low'; // Asegurar que severity solo puede ser uno de estos valores
    status: string;
  };
}

const DefectCard: React.FC<DefectCardProps> = ({ defect }) => {
  const severityColors: { [key in 'High' | 'Medium' | 'Low']: string } = {
    High: 'text-red-600',
    Medium: 'text-yellow-600',
    Low: 'text-green-600',
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 border-l-4 border-red-500">
      <h3 className="text-lg font-semibold mb-2 text-blue-700">Defecto</h3>
      <p className="text-gray-800">{defect.defect_description}</p>
      <p className={`mt-2 ${severityColors[defect.severity]}`}>Severidad: {defect.severity}</p>
      <p className="text-gray-700 font-semibold mt-2">Estado: {defect.status}</p>
    </div>
  );
};

export default DefectCard;
