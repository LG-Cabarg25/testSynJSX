import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import SuccessAlert from "../../components/shared/alerts/SuccessAlert";
import ErrorAlert from "../../components/shared/alerts/ErrorAlert";
import { registerTestCase } from "../../services/testCasesService";
import { useTestCaseContext } from "../../context/TestsCasesContext"; // Importa el contexto
import { SERVIDOR } from '../../services/Servidor';

interface User {
  user_id: number;
  project_role_id: number; // ID del rol de proyecto
  username: string;
  role: string;
}

const NewTestCaseModal: React.FC<{
  projectId: number;
  onClose: () => void;
}> = ({ projectId, onClose }) => {
  const { token } = useContext(AuthContext) || {};
  const { addTestCase } = useTestCaseContext(); // Usa el contexto
  const [testCaseName, setTestCaseName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [assignedUserId, setAssignedUserId] = useState(""); // ID del usuario seleccionado
  const [selectedTestPlan, setSelectedTestPlan] = useState(""); // ID del plan de prueba seleccionado
  const [users, setUsers] = useState<User[]>([]); // Cambié a "users" para incluir todos los roles
  const [testPlans, setTestPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!projectId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${SERVIDOR}/api/project/${projectId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al obtener los usuarios asignados.");

        const data = await response.json();
        setUsers(data); // Cargar todos los usuarios
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        ErrorAlert({ message: "Error al cargar usuarios." });
      } finally {
        setLoading(false);
      }
    };

    const fetchTestPlans = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${SERVIDOR}/api/test-plans/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error al cargar planes de prueba.");

        const plans = await response.json();
        setTestPlans(plans);
      } catch (error) {
        console.error("Error al cargar planes de prueba:", error);
        ErrorAlert({ message: "Error al cargar planes de prueba." });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchTestPlans();
  }, [projectId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: testCaseName,
      assignedTo: assignedUserId, // Suponiendo que el nombre del usuario se obtenga de alguna manera
      description,
      status,
      priority,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await registerTestCase({
        p_test_plan_id: parseInt(selectedTestPlan, 10), // ID del plan de prueba
        p_project_role_id: parseInt(assignedUserId, 10), // ID del usuario seleccionado
        p_name: testCaseName,
        p_description: description,
        p_status: status,
        p_priority: priority,
      }, token);

      SuccessAlert({ message: response.message });

      // Agregar el caso de prueba al contexto
      addTestCase(data);
      onClose();
    } catch (error) {
      setErrorMessage("Error al crear el caso de prueba.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Crear Caso de Prueba</h2>
        {loading ? (
          <p>Cargando usuarios y planes de prueba...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="mb-4">
              <label className="block text-gray-700">Selecciona Plan de Prueba:</label>
              <select
                value={selectedTestPlan}
                onChange={(e) => setSelectedTestPlan(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Selecciona un plan de prueba</option>
                {testPlans.map((plan) => (
                  <option key={plan.test_plan_id} value={plan.test_plan_id}>
                    {plan.plan_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Caso de Prueba de:</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={testCaseName}
                onChange={(e) => setTestCaseName(e.target.value)}
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
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Estado:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pendiente</option>
                <option value="Passed">Aprobado</option>
                <option value="Failed">Fallido</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Prioridad:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Low">Baja</option>
                <option value="Medium">Media</option>
                <option value="High">Alta</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Asignar a:</label>
              <select
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.project_role_id}>
                    {user.username} - {user.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Crear Caso
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewTestCaseModal;
