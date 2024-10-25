import React, { useState, useContext, useEffect, useCallback } from 'react';
import NewPlanModal from '../../components/projects/modals/NewPlanModal';
import PlanCard from '../../components/projects/cards/PlanCards'; 
import { AuthContext } from '../../context/AuthContext'; 
import { motion } from 'framer-motion';
import { getProjectsAssignedAndCreatedByUser } from '../../services/projectService';
import { getTestPlansByProject, deleteTestPlan } from '../../services';
import ModalUpdatePlan from '../../components/projects/modals/ModalUpdatePlan'; 
import ConfirmDeletePlan from '../../components/shared/ConfirmDeletePlan'; 
import NewTestCaseModal from '../../components/testCases/NewTestCaseModal'; // Asegúrate de importar el modal

const Planning: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};
  const userId = user?.user_id;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false); 
  const [showUpdateModal, setShowUpdateModal] = useState(false); 
  const [plans, setPlans] = useState<any[]>([]); 
  const [planToEdit, setPlanToEdit] = useState<any | null>(null); 
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [planIdToDelete, setPlanIdToDelete] = useState<number | null>(null); 
  const [showNewTestCaseModal, setShowNewTestCaseModal] = useState(false); 
  const [testPlanIdForNewTestCase, setTestPlanIdForNewTestCase] = useState<number | null>(null); 

  const loadProjects = useCallback(async () => {
    if (!userId || !token) return;

    setLoading(true);
    try {
      const projectsFromApi = await getProjectsAssignedAndCreatedByUser(userId, token);
      setProjects(projectsFromApi);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const loadPlans = async (projectId: number) => {
    setLoading(true);
    try {
      const plansFromApi = await getTestPlansByProject(projectId, token);
      setPlans(plansFromApi);
    } catch (error) {
      console.error('Error al cargar planes de prueba:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedProjectId = localStorage.getItem("selectedProjectId");
    if (storedProjectId) {
      const projectId = Number(storedProjectId);
      const project = projects.find(p => p.project_id === projectId);
      if (project) {
        setSelectedProject(project);
        loadPlans(projectId);
      }
    }
  }, [projects]);

  const handleProjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = Number(e.target.value);
    const project = projects.find(p => p.project_id === selectedProjectId) || null;
    setPlans([]);

    if (project) {
      setSelectedProject(project);  
      await loadPlans(selectedProjectId);
    } else {
      setPlans([]);
    }

    localStorage.setItem("selectedProjectId", String(selectedProjectId));
  };

  const handleOpenNewPlanModal = () => {
    setShowModal(true); 
  };

  const handleAddTestPlan = (newTestPlan: any) => {
    setPlans([...plans, newTestPlan]);
    setShowModal(false);
  };

  const handleEditPlan = (planData: any) => {
    setPlanToEdit(planData); 
    setShowUpdateModal(true); 
  };

  const handleDeletePlan = (testPlanId: number) => {
    setPlanIdToDelete(testPlanId); 
    setShowConfirmationDialog(true);
  };

  const confirmDeletePlan = async () => {
    if (planIdToDelete === null) return;

    try {
      await deleteTestPlan(planIdToDelete, token);
      setPlans(plans.filter(plan => plan.test_plan_id !== planIdToDelete));
    } catch (error) {
      console.error('Error al eliminar el plan de pruebas:', error);
      alert("Error al eliminar el plan de pruebas.");
    } finally {
      setShowConfirmationDialog(false);
      setPlanIdToDelete(null);
    }
  };

  const handleOpenNewTestCaseModal = (testPlanId: number) => {
    setTestPlanIdForNewTestCase(testPlanId); // Guarda el ID del plan de prueba
    setShowNewTestCaseModal(true); // Abre el modal
  };

  return (
    <div className="p-8 bg-[#f4f6f9] min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl text-[#042354] font-bold mb-6">Gestión de Planes de Prueba</h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedProject?.project_id || ''}
            onChange={handleProjectChange}
            className="w-1/8 p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name}
              </option>
            ))}
          </select>
          <button
            onClick={handleOpenNewPlanModal}
            disabled={selectedProject?.role !== 'QA'}
            className={`rounded-lg p-2 inline-block transition-transform ${selectedProject?.role !== 'QA' ? 'bg-gray-300 cursor-not-allowed' : ''}`}
          >
            <img src="src/assets/icon/more.svg" height="35" width="35" alt="Agregar Plan" />
          </button>
          <button
            onClick={() => handleOpenNewTestCaseModal(plans[0]?.test_plan_id)} // Abre el modal con el primer plan de prueba
            disabled={selectedProject?.role !== 'QA' || plans.length === 0} // Deshabilitar si no hay planes
            className={`rounded-lg p-2 inline-block transition-transform ${selectedProject?.role !== 'QA' || plans.length === 0 ? 'bg-gray-300 cursor-not-allowed' : ''}`}
          >
            <img src="src/assets/icon/caseTest.svg" height="35" width="35" alt="Generar Caso de Prueba" />
          </button>
        </div>
      </div>

      {loading ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </motion.div>
      ) : (
        selectedProject && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <PlanCard
                    key={plan.test_plan_id}
                    p_user_id={plan.user_id}
                    p_project_id={plan.project_id}
                    p_plan_name={plan.plan_name}
                    p_plan_type={plan.plan_type}
                    p_description={plan.description}
                    p_start_date={plan.start_date}
                    p_end_date={plan.end_date}
                    document_url={plan.document_url}
                    p_status={plan.status}
                    test_plan_id={plan.test_plan_id} 
                    onOpenConfirmDelete={() => handleDeletePlan(plan.test_plan_id)} 
                    onOpenTaskModal={() => {}} // Cambia esto a una función vacía
                    onEditPlan={handleEditPlan} 
                  />
                ))
              ) : (
                <p>No hay planes de prueba asociados a este proyecto.</p>
              )}
            </div>
          </div>
        )
      )}

      {showModal && selectedProject && (
        <NewPlanModal 
          projectId={selectedProject.project_id} 
          addTestPlan={handleAddTestPlan} 
          closeModal={() => setShowModal(false)} 
        />
      )}

      {showUpdateModal && planToEdit && (
        <ModalUpdatePlan 
          closeModal={() => setShowUpdateModal(false)} 
          planData={planToEdit} 
          projectId={selectedProject?.project_id || 0} 
        />
      )}

      {showNewTestCaseModal && selectedProject && (
        <NewTestCaseModal 
          projectId={selectedProject.project_id}
          testPlanId={testPlanIdForNewTestCase} // Pasa el ID del plan de prueba al modal
          onClose={() => setShowNewTestCaseModal(false)} 
          onCreate={(newTestCase) => {
            console.log('Nuevo caso de prueba creado:', newTestCase); 
          }} 
        />
      )}

      {showConfirmationDialog && (
        <ConfirmDeletePlan
          projectName={plans.find(plan => plan.test_plan_id === planIdToDelete)?.plan_name || ''}
          onConfirm={confirmDeletePlan}
          onCancel={() => setShowConfirmationDialog(false)} 
        />
      )}
    </div>
  );
};

export default Planning;
