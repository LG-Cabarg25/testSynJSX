import React, { useState } from 'react';
import UpdateTestCase from './UpdateTestCase'; // Modal de actualización
import CommentTestCase from './CommentTestCase'; // Modal para agregar comentarios
import ExecuteTestCaseModal from './ExecuteTestCaseModal'; // Modal para ejecutar el caso de prueba
import { updateTestCase } from '../../services/testCasesService'; // Servicio de actualización

interface TestCaseCardProps {
  testCaseId: number;
  testCaseName: string;
  assignedTo: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  onUpdate: (updatedDetails: { description: string; status: string; priority: string }) => void;
  onExecute: () => void;
  userRole: string;
  token: string;
  userId: number; // Aseguramos que el userId esté disponible para el modal de comentarios
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({
  testCaseId,
  testCaseName,
  assignedTo,
  description,
  status,
  priority,
  createdAt,
  onUpdate,
  onExecute,
  userRole, // Aquí estamos usando el rol asignado al usuario
  token,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Este projectRoleId puede ahora depender del userRole
  const projectRoleId = userRole === 'QA' ? 1 : userRole === 'Tester' ? 2 : null;

  // Funciones para abrir y cerrar modales
  const handleOpenUpdateModal = () => setIsUpdateModalOpen(true);
  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);
  const handleOpenCommentModal = () => setIsCommentModalOpen(true);
  const handleCloseCommentModal = () => setIsCommentModalOpen(false);
  const handleOpenExecuteModal = () => setIsExecuteModalOpen(true);
  const handleCloseExecuteModal = () => setIsExecuteModalOpen(false);

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateTestCase(testCaseId, { status: newStatus }, token);
      onUpdate({ description, status: newStatus, priority });
    } catch (error) {
      console.error('Error al actualizar el caso de prueba:', error);
    } finally {
      setIsUpdating(false);
      handleCloseUpdateModal();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border mb-4">
      <p className={`inline-block px-2 py-1 rounded text-white ${priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
        Prioridad: {priority}
      </p>
      <h3 className="text-xl font-bold">{testCaseName}</h3>
      <p>Asignado a: {assignedTo}</p>
      <p>Descripción: {description}</p>
      <p>Estado: {status}</p>
      <p>Fecha de creación: {new Date(createdAt).toLocaleDateString()}</p>

      <div className="flex justify-end mt-4 space-x-2">
        {(userRole === 'QA' || userRole === 'Tester') && (
          <>
            <button onClick={handleOpenUpdateModal} className="bg-blue-500 text-white px-2 py-1 rounded">
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </button>
            <button onClick={handleOpenCommentModal} className="bg-purple-500 text-white px-2 py-1 rounded">
              Comentar
            </button>
          </>
        )}
        {userRole === 'Tester' && (
          <button onClick={handleOpenExecuteModal} className="bg-green-500 text-white px-2 py-1 rounded">
            Ejecutar Caso
          </button>
        )}
      </div>

      {isUpdateModalOpen && (
        <UpdateTestCase
          currentStatus={status}
          onClose={handleCloseUpdateModal}
          onSave={handleUpdateStatus}
        />
      )}

      {isCommentModalOpen && projectRoleId && (
        <CommentTestCase
          testCaseId={testCaseId}
          projectRoleId={projectRoleId}
          onClose={handleCloseCommentModal}
          token={token}
        />
      )}

      {isExecuteModalOpen && (
        <ExecuteTestCaseModal
          testCaseId={testCaseId}
          onClose={handleCloseExecuteModal}
          token={token}
        />
      )}
    </div>
  );
};

export default TestCaseCard;
