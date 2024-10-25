import React from 'react';

interface AssignmentCardProps {
  assignment: {
    name_task: string;
    description: string;
    status: string;
  };
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-md mb-2">
      <h3 className="text-lg font-semibold text-yellow-700">{assignment.name_task}</h3>
      <p className="text-gray-800 mt-1">{assignment.description}</p>
      <p className="text-sm font-bold text-yellow-600 mt-2">Estado: {assignment.status}</p>
    </div>
  );
};

export default AssignmentCard;
