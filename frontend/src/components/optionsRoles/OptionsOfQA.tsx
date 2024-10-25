import React from 'react';
import {  canDeleteTestPlan, canManageTestPlan,  } from '../../utils/roleValidations';
import DeletePlanButton from '../buttons/DeletePlanButton';
import EditPlanButton from '../buttons/EditTestPlanButton';

interface OptionsOfQAProps {
  userRole: string;
  onClickUpdateTestPlan: () => void; // Este prop se utiliza para abrir el modal
  onOpenConfirmDelete: () => void; // Prop para manejar la confirmación de eliminación
  onOpenTaskModal: () => void; // Prop para abrir el modal de tareas
}

const OptionsOfQA: React.FC<OptionsOfQAProps> = ({
  userRole,
  onClickUpdateTestPlan,
  onOpenConfirmDelete,
}) => {
  return (
    <div className="flex space-x-3">
      {canManageTestPlan(userRole) && (
        <EditPlanButton userRole={userRole} onClick={onClickUpdateTestPlan} />
      )}
      {canDeleteTestPlan(userRole) && (
        <DeletePlanButton onClick={onOpenConfirmDelete} />
      )}
    </div>
  );
};

export default OptionsOfQA;
