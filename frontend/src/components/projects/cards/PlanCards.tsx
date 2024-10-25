import React, { useContext } from "react";
import { AuthContext } from '../../../context/AuthContext';
import OptionsOfQA from '../../optionsRoles/OptionsOfQA'; 

interface PlanCardProps {
  p_user_id: number;
  p_project_id: number;
  p_plan_name: string;
  p_plan_type: string;
  p_description: string;
  p_start_date: string;
  p_end_date: string;
  document: File | null;
  p_status: string;
  created_at: string;
  document_url: string;
  test_plan_id: number; // Asegúrate de incluir el ID
  onOpenConfirmDelete: () => void;
  onOpenTaskModal: () => void;
  onEditPlan: (planData: any) => void; // Prop para abrir el modal de edición
}

const PlanCard: React.FC<PlanCardProps> = ({
  p_user_id,
  p_project_id,
  p_plan_name,
  p_plan_type,
  p_description,
  p_start_date,
  p_end_date,
  document_url,
  p_status,
  test_plan_id, // Asegúrate de que este ID se esté recibiendo correctamente
  onOpenConfirmDelete,
  onOpenTaskModal,
  onEditPlan // Pasa la función de editar
}) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};
  const userId = user?.user_id || '';

  const user_name = p_user_id === userId ? user?.username : 'Desconocido';
  
  const translatedStatus = {
    Pending: 'Pendiente',
    'In Progress': 'En progreso',
    Completed: 'Completado',
  }[p_status] || p_status;

  const userRoleInProject = p_user_id === userId ? 'QA' : 'Viewer';

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-[#042354]">{p_plan_name}</h3>
        <p className="text-sm text-gray-600">
          Fecha Creación: {new Date(p_start_date).toLocaleDateString()}
        </p>
      </div>
      <h3 className="text-sm mt-2 font-bold text-[#042354]">Tipo de plan: {p_plan_type}</h3>
      <p className="text-sm mt-2 text-gray-600 mb-2">
        Estado: <span className={`font-semibold text-${translatedStatus?.toLowerCase() || "default"}`}>{translatedStatus || "Desconocido"}</span>
      </p>
      <p className="text-sm text-gray-600 mb-2">Responsable: <span className="font-semibold">{user_name}</span></p>
      <div className="mb-2">
        <p className="text-sm text-gray-600">Descripción General:</p>
        <p className="text-sm text-gray-800">{p_description}</p>
      </div>
      <div className="flex justify-between mt-4">
        <a href={document_url} className="hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">Ver Documento</a>
        
        {userRoleInProject === 'QA' && (
          <OptionsOfQA 
            userRole={userRoleInProject} 
            onClickUpdateTestPlan={() => {
              onEditPlan({ 
                p_user_id, 
                p_plan_name, 
                p_plan_type, 
                p_description, 
                p_start_date, 
                p_status, 
                document_url,
                test_plan_id // Asegúrate de que este ID se esté pasando
              });
            }} 
            onOpenConfirmDelete={onOpenConfirmDelete} // Asegúrate de que se llame aquí
            onOpenTaskModal={onOpenTaskModal} 
          />
        )}
      </div>
    </div>
  );
};

export default PlanCard;
