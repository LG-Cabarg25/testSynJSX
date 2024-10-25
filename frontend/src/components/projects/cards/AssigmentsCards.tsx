import React from 'react';
import ButtonMoveTask from '../../buttons/ButtonMoveTask';
import ViewTaskAssigmentButton from '../../buttons/ViewTaskAssigmentButton';

interface AssignmentCardProps {
  taskDescription: string;
  taskStatus: string;
  assignedAt: string;
  assignedToUserName: string; // Nombre del usuario asignado
  onMoveTask: () => void;
  onViewTaskDetails: () => void;
  userRole: string; // El rol del usuario actual
}
const AssignmentCard: React.FC<AssignmentCardProps> = ({
  taskDescription, // Aquí recibes el `taskDescription` (task_name)
  taskStatus,
  assignedToUserName,
  onMoveTask,
  onViewTaskDetails,
  userRole,
}) => {
  const canMoveTask = userRole === 'PM' || userRole === 'QA' || userRole === 'Developer';

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border mb-4">
      <p className="text-sm text-gray-600">{taskDescription || 'Sin descripción'}</p> {/* Asegúrate de que estás mostrando taskDescription */}
      <p className="text-xs text-gray-500">Estado: {taskStatus || 'Sin estado'}</p>
      <p className="text-xs text-gray-500">Asignado a: {assignedToUserName || 'Usuario desconocido'}</p>

      <div className="flex justify-end mt-4 space-x-2">
        <ViewTaskAssigmentButton onClick={onViewTaskDetails} />
        {canMoveTask && <ButtonMoveTask onClick={onMoveTask} />}
      </div>
    </div>
  );
};


export default AssignmentCard;