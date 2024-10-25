import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTestCaseContext } from '../../context/TestsCasesContext';
import TestCaseCard from '../../components/testCases/TestCaseCard';
import { fetchTestCasesByPlan } from '../../services/testCasesService';
import { SERVIDOR } from '../../services/Servidor';
interface Project {
  project_id: number;
  project_name: string;
  pm_id: number;
  role?: string; // Rol del usuario en el proyecto
}

const Executions: React.FC = () => {
  const { testCases, addTestCase } = useTestCaseContext();
  const { user, token } = useContext(AuthContext) || {};
  const userId = user?.user_id; // ID del usuario logueado
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [testPlans, setTestPlans] = useState<any[]>([]);
  const [selectedTestPlanId, setSelectedTestPlanId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>(""); // Estado para el rol del usuario en el proyecto

  // Cargar proyectos donde el usuario esté asignado
  const fetchProjects = async () => {
    if (!userId || !token) return;

    setLoading(true);
    try {
      const response = await fetch(`${SERVIDOR}/api/project/user/${userId}/assigned`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los proyectos');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestPlans = async (projectId: string) => {
    try {
      const response = await fetch(`${SERVIDOR}/api/test-plans/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar planes de prueba');
      const data = await response.json();
      setTestPlans(data);
    } catch (error) {
      console.error('Error al cargar planes de prueba:', error);
    }
  };

  const fetchTestCases = async (planId: string) => {
    try {
      const cases = await fetchTestCasesByPlan(parseInt(planId), token);
      cases.forEach((testCase) => addTestCase(testCase));
    } catch (error) {
      console.error('Error al cargar casos de prueba:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId, token]);

  useEffect(() => {
    const storedProjectId = localStorage.getItem("selectedProjectId");
    const storedTestPlanId = localStorage.getItem("selectedTestPlanId");

    if (storedProjectId) {
      setSelectedProjectId(storedProjectId);
      fetchTestPlans(storedProjectId); // Cargar planes de prueba al seleccionar proyecto
    }

    if (storedTestPlanId) {
      setSelectedTestPlanId(storedTestPlanId);
    }
  }, []);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = e.target.value;
    const project = projects.find(p => p.project_id.toString() === selectedProjectId) || null;

    if (project) {
      const role = project.pm_id === user?.user_id ? 'PM' : project.role || 'guest';
      setSelectedProjectId(selectedProjectId);
      setUserRole(role); // Guardar el rol del usuario
      localStorage.setItem('selectedProject', JSON.stringify(project));
      fetchTestPlans(selectedProjectId); // Cargar planes de prueba del proyecto seleccionado
    }
  };

  useEffect(() => {
    if (selectedTestPlanId) {
      fetchTestCases(selectedTestPlanId);
      localStorage.setItem("selectedTestPlanId", selectedTestPlanId);
    }
  }, [selectedTestPlanId, token]);

  // Agrupar casos de prueba por estado
  const groupedTestCases = {
    Pending: testCases.filter(tc => tc.status === 'Pending'),
    Passed: testCases.filter(tc => tc.status === 'Passed'),
    Failed: testCases.filter(tc => tc.status === 'Failed'),
  };

  const handleUpdateTestCase = (updatedDetails: { description: string; status: string; priority: string }) => {
 

  };

  return (
    <div>
      <h1 className="text-3xl text-[#042354] font-bold mb-4">Tablero de Ejecuciones</h1>

      {loading ? (
        <p>Cargando proyectos...</p>
      ) : (
        <>
          <div className="flex mb-4">
            <div className="mr-4">
              <label>Selecciona un Proyecto:</label>
              <select value={selectedProjectId} onChange={handleProjectChange}>
                <option value="">Selecciona un proyecto</option>
                {projects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Selecciona un Plan de Prueba:</label>
              <select value={selectedTestPlanId} onChange={(e) => setSelectedTestPlanId(e.target.value)} disabled={!selectedProjectId}>
                <option value="">Selecciona un plan de prueba</option>
                {testPlans.map((plan) => (
                  <option key={plan.test_plan_id} value={plan.test_plan_id}>
                    {plan.plan_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-1/3">
              <h2 className="text-xl font-bold">Pending</h2>
              {groupedTestCases.Pending.map((testCase, index) => (
                <TestCaseCard
                  key={index}
                  testCaseId={testCase.test_case_id}
                  testCaseName={testCase.name}
                  assignedTo={testCase.assignedTo}
                  description={testCase.description}
                  status={testCase.status}
                  priority={testCase.priority}
                  createdAt={testCase.createdAt}
                  onUpdate={handleUpdateTestCase}
                  onExecute={() => {}}
                  userRole={userRole}
                  token={token}
                  userId={userId} // Asegúrate de pasar el userId también
                />
              ))}
            </div>

            <div className="w-1/3">
              <h2 className="text-xl font-bold">Passed</h2>
              {groupedTestCases.Passed.map((testCase, index) => (
                <TestCaseCard
                  key={index}
                  testCaseId={testCase.test_case_id}
                  testCaseName={testCase.name}
                  assignedTo={testCase.assignedTo}
                  description={testCase.description}
                  status={testCase.status}
                  priority={testCase.priority}
                  createdAt={testCase.createdAt}
                  onUpdate={handleUpdateTestCase}
                  onExecute={() => {}}
                  userRole={userRole}
                  token={token}
                  userId={userId} // Asegúrate de pasar el userId también
                />
              ))}
            </div>

            <div className="w-1/3">
              <h2 className="text-xl font-bold">Failed</h2>
              {groupedTestCases.Failed.map((testCase, index) => (
                <TestCaseCard
                  key={index}
                  testCaseId={testCase.test_case_id}
                  testCaseName={testCase.name}
                  assignedTo={testCase.assignedTo}
                  description={testCase.description}
                  status={testCase.status}
                  priority={testCase.priority}
                  createdAt={testCase.createdAt}
                  onUpdate={handleUpdateTestCase}
                  onExecute={() => {}}
                  userRole={userRole}
                  token={token}
                  userId={userId} // Asegúrate de pasar el userId también
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Executions;
