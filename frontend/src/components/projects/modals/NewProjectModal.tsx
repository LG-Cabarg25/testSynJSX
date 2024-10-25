import React, { useState, useContext } from "react";
import { checkProjectNameExists, registerProject } from "../../../services/projectService"; 
import { AuthContext } from "../../../context/AuthContext";
import ConfirmDialog from "../../auth/ConfirmDialog";
import SuccessAlert from "../../shared/alerts/SuccessAlert";
import ErrorAlert from "../../shared/alerts/ErrorAlert";


interface Project {
  p_project_name: string;
  p_description: string;
  p_start_date: string;
  p_end_date: string;
  p_status: string;
  p_pm_id: number;
}

type ProjectStatus = "Pendiente" | "En progreso" | "Completado";

interface NewProjectModalProps {
  closeModal: () => void;
  addProject: (newProject: Project) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ closeModal, addProject }) => {
  const authContext = useContext(AuthContext);

  const { user, token } = authContext || {};
  const pm_id = user?.user_id;

  const [project_name, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Pendiente");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const statusMap: Record<ProjectStatus, string> = {
    Pendiente: "Pending",
    "En progreso": "In Progress",
    Completado: "Completed",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    const translatedStatus = statusMap[status];

    const newProject = {
      p_project_name: project_name,
      p_description: description,
      p_start_date: start_date,
      p_end_date: end_date,
      p_status: translatedStatus,
      p_pm_id: pm_id!,
    };

    try {
      if (!token) {
        ErrorAlert({ message: "Token no disponible, no se puede realizar la operación." });
        return;
      }

      const projectExists = await checkProjectNameExists(project_name, token);  
      if (projectExists) {
        ErrorAlert({ message: "Ya existe un proyecto con este nombre." });
        return;
      }

      await registerProject(newProject, token);  
      SuccessAlert({ message: "Proyecto creado exitosamente" });
      addProject(newProject);  
    } catch {
      ErrorAlert({ message: "Error inesperado al crear el proyecto" });
    }

    setShowConfirmDialog(false);
    closeModal();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del Proyecto:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={project_name}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Descripción:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex justify-between gap-4">
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700">Fecha de Inicio:</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700">Fecha de Finalización:</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Estado:</label>
            <div className="flex items-center gap-4">
              <label>
                <input
                  type="radio"
                  value="Pendiente"
                  checked={status === "Pendiente"}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                />{" "}
                Pendiente
              </label>
              <label>
                <input
                  type="radio"
                  value="En progreso"
                  checked={status === "En progreso"}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                />{" "}
                En progreso
              </label>
              <label>
                <input
                  type="radio"
                  value="Completado"
                  checked={status === "Completado"}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                />{" "}
                Completado
              </label>
            </div>
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
          message="¿Estás seguro de que deseas guardar este proyecto?"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default NewProjectModal;
