import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ConfirmDialog from "../../auth/ConfirmDialog";
import SuccessAlert from "../../shared/alerts/SuccessAlert";
import ErrorAlert from "../../shared/alerts/ErrorAlert";
import { registerTestPlan } from "../../../services";

interface Plan {
  p_user_id: number;
  p_project_id: number;
  p_plan_name: string;
  p_plan_type: string; // El tipo de plan ahora es una cadena
  p_description: string;
  p_start_date: string;
  p_end_date: string;
  document: File | null; // Cambié el tipo de document a File | null
  p_status: string;
}

interface NewPlanModalProps {
  closeModal: () => void;
  addTestPlan: (newTestPlan: Plan) => void;
  projectId: number;
}

type PlanStatus = "Pendiente" | "En progreso" | "Completado";

const NewPlanModal: React.FC<NewPlanModalProps> = ({ closeModal, addTestPlan, projectId }) => {
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const userId = user?.user_id;

  const [planName, setPlanName] = useState("");
  const [planType, setPlanType] = useState(""); // Estado para el tipo de plan
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [status, setStatus] = useState<PlanStatus>("Pendiente");
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

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true); // Mostrar el diálogo de confirmación
  };

  // Función para manejar la carga del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocument(file);
  };

  // Función para confirmar la creación del plan y realizar el POST
  const handleConfirmSave = async () => {
    if (!token || !userId) {
      ErrorAlert({ message: "Token o usuario no disponible, no se puede realizar la operación." });
      return;
    }

    const translateStatusPlan = statusMap[status];

    // Prepara los datos del plan de prueba
    const newTestPlan: Plan = {
      p_user_id: userId,
      p_project_id: projectId,
      p_plan_name: planName.trim(),
      p_plan_type: planType.trim(),
      p_description: description.trim(),
      p_start_date: startDate,
      p_end_date: endDate,
      document: document,
      p_status: translateStatusPlan,
    };

    try {
      // Crea un objeto FormData para enviar los datos junto con el archivo
      const formData = new FormData();
      formData.append("p_project_id", String(newTestPlan.p_project_id));
      formData.append("p_user_id", String(newTestPlan.p_user_id));
      formData.append("p_plan_name", newTestPlan.p_plan_name);
      formData.append("p_plan_type", newTestPlan.p_plan_type);
      formData.append("p_description", newTestPlan.p_description);
      formData.append("p_start_date", newTestPlan.p_start_date);
      formData.append("p_end_date", newTestPlan.p_end_date);
      if (document) {
        formData.append("document", document);
      }
      formData.append("p_status", newTestPlan.p_status);

      // Llama al servicio que hace el POST al backend
      await registerTestPlan(formData, token);
      SuccessAlert({ message: "Plan de prueba creado exitosamente" });

      // Añadir el plan de prueba a la lista de planes en el componente padre
      addTestPlan(newTestPlan);
    } catch (error) {
      ErrorAlert({ message: "Error inesperado al crear el plan de prueba", });
    }

    setShowConfirmDialog(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Nuevo Plan de Pruebas</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del Plan:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Tipo de Plan:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
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
              required
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

          <div className="mb-4">
            <label className="block text-gray-700">Fecha inicio:</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Fecha límite:</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-[#042354] hover:bg-[#28559c] text-white px-4 py-2 rounded"
            >
              Guardar
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
          message="¿Estás seguro de que deseas guardar este plan de prueba?"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default NewPlanModal;