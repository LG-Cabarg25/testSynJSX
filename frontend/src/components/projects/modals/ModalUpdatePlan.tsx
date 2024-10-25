import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ConfirmDialog from "../../auth/ConfirmDialog";
import SuccessAlert from "../../shared/alerts/SuccessAlert";
import ErrorAlert from "../../shared/alerts/ErrorAlert";
import { updateTestPlan } from "../../../services"; 

interface Plan {
  p_user_id: number;
  p_project_id: number;
  p_plan_name: string;
  p_plan_type: string;
  p_description: string;
  p_start_date: string;
  p_end_date: string;
  document: File | null; 
  p_status: string;
  test_plan_id: number; // Asegúrate de que este ID esté disponible
}

interface ModalUpdatePlanProps {
  closeModal: () => void;
  planData: Plan; 
  projectId: number;
}

type PlanStatus = "Pendiente" | "En progreso" | "Completado";

const ModalUpdatePlan: React.FC<ModalUpdatePlanProps> = ({ closeModal, planData, projectId }) => {
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const userId = user?.user_id;

  const [planType, setPlanType] = useState(planData.p_plan_type);
  const [description, setDescription] = useState(planData.p_description);
  const [document, setDocument] = useState<File | null>(null);
  const [status, setStatus] = useState<PlanStatus>(planData.p_status as PlanStatus);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const statusMap: Record<PlanStatus, string> = {
    Pendiente: "Pending",
    "En progreso": "In Progress",
    Completado: "Completed",
  };

  const planTypes = [
    "Pruebas Funcionales",
    "Pruebas de Integración",
    "Pruebas de Regresión",
    "Pruebas de Aceptación",
    "Pruebas de Rendimiento",
    "Pruebas de Seguridad",
    "Pruebas de Usabilidad",
    "Pruebas de Compatibilidad"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocument(file);
  };

  const handleConfirmSave = async () => {
    if (!token || !userId) {
      ErrorAlert({ message: "Token o usuario no disponible, no se puede realizar la operación." });
      return;
    }

    const translateStatusPlan = statusMap[status];


    const updatedPlan: Plan = {
      p_user_id: userId,
      p_project_id: projectId,
      p_plan_name: planData.p_plan_name,
      p_plan_type: planType.trim(),
      p_description: description.trim(),
      p_start_date: planData.p_start_date,
      p_end_date: planData.p_end_date,
      document: document,
      p_status: translateStatusPlan,
      test_plan_id: planData.test_plan_id, // Asegúrate de que este ID esté presente
    };



    try {
      const formData = new FormData();
      formData.append("p_test_plan_id", String(updatedPlan.test_plan_id)); // Asegúrate de que este ID no sea undefined
      formData.append("p_project_id", String(updatedPlan.p_project_id));
      formData.append("p_user_id", String(updatedPlan.p_user_id));
      formData.append("p_plan_name", updatedPlan.p_plan_name);
      formData.append("p_plan_type", updatedPlan.p_plan_type);
      formData.append("p_description", updatedPlan.p_description);
      if (document) {
        formData.append("document", document);
      }
      formData.append("p_status", updatedPlan.p_status);

      await updateTestPlan(updatedPlan.test_plan_id, formData, token);
      SuccessAlert({ message: "Plan de prueba actualizado exitosamente" });
    } catch (error) {
      ErrorAlert({ message: "Error inesperado al actualizar el plan de prueba" });
    }

    setShowConfirmDialog(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Actualizar Plan: {planData.p_plan_name}</h2> {/* Nombre del plan seleccionado */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tipo de Plan:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={planType}
              onChange={(e) => {
                setPlanType(e.target.value);
              }}
              required
            >
              <option value="">Selecciona un tipo de plan</option>
              {planTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Descripción general:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Documento:</label>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Estado:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value as PlanStatus)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-[#042354] hover:bg-[#28559c] text-white px-4 py-2 rounded"
            >
              Actualizar
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          message="¿Estás seguro de que deseas actualizar este plan de prueba?"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default ModalUpdatePlan;
