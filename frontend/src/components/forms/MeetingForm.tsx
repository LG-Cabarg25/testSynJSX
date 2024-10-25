import React from 'react';

interface MeetingFormProps {
  newEvent: any;
  setNewEvent: (event: any) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  projects: any[];
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  newEvent,
  setNewEvent,
  selectedProjectId,
  setSelectedProjectId,
  onSubmit,
  projects,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent: any) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="p_meeting_description"
          value={newEvent.p_meeting_description}
          onChange={handleInputChange}
          className="w-full p-2 mt-1 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de la Reunión</label>
        <input
          type="date"
          name="p_meeting_date"
          value={newEvent.p_meeting_date}
          onChange={handleInputChange}
          className="w-full p-2 mt-1 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
        <input
          type="time"
          name="p_meeting_start_time"
          value={newEvent.p_meeting_start_time}
          onChange={handleInputChange}
          className="w-full p-2 mt-1 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hora de Fin</label>
        <input
          type="time"
          name="p_meeting_end_time"
          value={newEvent.p_meeting_end_time}
          onChange={handleInputChange}
          className="w-full p-2 mt-1 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Link de la Reunión</label>
        <input
          type="url"
          name="p_meeting_link"
          value={newEvent.p_meeting_link}
          onChange={handleInputChange}
          className="w-full p-2 mt-1 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Proyecto</label>
        <select
          name="p_project_id"
          value={selectedProjectId}
          onChange={(e) => {
            handleInputChange(e);
            setSelectedProjectId(e.target.value);
          }}
          className="w-full p-2 mt-1 border rounded-md"
          required
        >
          <option value="">Seleccione un proyecto</option>
          {projects.map((project: any) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
        Crear Reunión
      </button>
    </form>
  );
};

export default MeetingForm;