import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ProjectCard from '../../components/results/ProjectCard';
import TestPlanCard from '../../components/results/TestPlanCard';
import DefectCard from '../../components/results/DefectCard';
import AssignmentCard from '../../components/results/AssignmentCard';
import MeetingCard from '../../components/results/MeetingCard';
import { SERVIDOR } from '../../services/Servidor';

const Results: React.FC = () => {
  const { user, token } = useContext(AuthContext); // Obtener userId y token del contexto
  const [resultsData, setResultsData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>(''); // ID del proyecto seleccionado
  const [projects, setProjects] = useState<any[]>([]); // Lista de proyectos
  const userId = user?.user_id; // Asegurar que userId se obtiene de AuthContext

  // Obtener proyectos asignados al usuario
  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId || !token) {
        console.error('Usuario no autenticado o token faltante');
        return;
      }
      try {
        const response = await axios.get(`${SERVIDOR}/api/project/user/${userId}/assigned`, {
          headers: { 'x-access-token': token },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error al obtener proyectos asignados:', error);
      }
    };
    fetchProjects();
  }, [userId, token]);

  // Función para cargar resultados del proyecto seleccionado
  const fetchResults = async () => {
    if (!projectId) return; // Verificar que un proyecto está seleccionado
    try {
      const response = await axios.get(`${SERVIDOR}/api/project/${projectId}/results`, {
        headers: { 'x-access-token': token },
      });
      setResultsData(response.data);
    } catch (error) {
      console.error('Error al obtener resultados del proyecto:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl text-[#042354] font-bold mb-4">Documentos de Proyectos</h1>

      {/* Menú desplegable para seleccionar proyecto */}
      <div className="mb-4">
        <label htmlFor="projectSelect" className="mr-2 font-bold">Seleccionar Proyecto:</label>
        <select
          id="projectSelect"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Seleccione un proyecto</option>
          {projects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name}
            </option>
          ))}
        </select>
        <button
          onClick={fetchResults}
          className="ml-4 p-2 bg-blue-500 text-white rounded"
        >
          Cargar Resultados
        </button>
      </div>

      {/* Mostrar resultados si existen */}
      {resultsData ? (
        <>
          <section>
            <h2 className="text-2xl font-bold mb-2">Información del Proyecto</h2>
            {resultsData.projectInfo.map((project: any, index: number) => (
              <ProjectCard key={index} project={project} />
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2">Planes de Prueba</h2>
            {resultsData.testPlans.map((testPlan: any, index: number) => (
              <TestPlanCard key={index} testPlan={testPlan} />
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2">Defectos</h2>
            {resultsData.defects.map((defect: any, index: number) => (
              <DefectCard key={index} defect={defect} />
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2">Asignaciones de Proyecto</h2>
            {resultsData.assignments.map((assignment: any, index: number) => (
              <AssignmentCard key={index} assignment={assignment} />
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2">Reuniones</h2>
            {resultsData.meetings.map((meeting: any, index: number) => (
              <MeetingCard key={index} meeting={meeting} />
            ))}
          </section>
        </>
      ) : (
        <p>Seleccione un proyecto y haga clic en "Cargar Resultados" para ver los datos.</p>
      )}
    </div>
  );
};

export default Results;
