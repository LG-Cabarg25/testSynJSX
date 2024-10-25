import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useMeetings } from '../../context/MeetingsContext';
import MeetingForm from '../../components/forms/MeetingForm';
import EditMeeting from '../../components/projects/edits/EditMeeting';
import {  registerMeeting, updateMeeting } from '../../services/meetingService'; 
import { getProjectsAssignedAndCreatedByUser } from '../../services/projectService'; // Importa el servicio para proyectos

const CustomCalendar: React.FC = () => {
  const { user, token } = useContext(AuthContext);
  const { meetings, fetchMeetings, setMeetings } = useMeetings();
  const [projects, setProjects] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Modal del formulario de reunión
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Modal de confirmación
  const [isEditOpen, setIsEditOpen] = useState(false); // Modal de edición
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Evento seleccionado para editar
  const [newEvent, setNewEvent] = useState({
    p_meeting_date: '',
    p_meeting_start_time: '',
    p_meeting_end_time: '',
    p_meeting_status: 'Pending',
    p_meeting_description: '',
    p_meeting_link: '',
    p_project_id: '',
  });

  const userId = user?.user_id;

  // Obtener proyectos asignados al usuario o creados por él
  const fetchProjects = async () => {
    if (!token) {
      console.error('Token no disponible');
      return;
    }

    try {
      const data = await getProjectsAssignedAndCreatedByUser(userId, token); // Usar el servicio desde projectService
      setProjects(data); // Guardar los proyectos en el estado
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
      setProjects([]);
    }
  };

  // Actualizar reuniones cuando se cree o edite una nueva reunión
  const updateMeetingsAfterChange = async () => {
    const updatedMeetings = await fetchMeetings(userId);
    setMeetings(updatedMeetings);
  };

  // Manejar creación de una nueva reunión
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true); // Mostrar confirmación antes de crear la reunión
  };

  const confirmCreateMeeting = async () => {
    setIsConfirmOpen(false); // Cerrar el cuadro de confirmación
    if (!newEvent.p_project_id) {
      alert('Por favor, selecciona un proyecto antes de crear la reunión');
      return;
    }

    const newEventWithNumericId = {
      ...newEvent,
      p_project_id: Number(newEvent.p_project_id),
    };

    try {
      const result = await registerMeeting(newEventWithNumericId, token); // Usar el servicio de registrar reunión
      await updateMeetingsAfterChange();
      setIsOpen(false); // Cerrar modal de creación
      alert('Reunión creada con éxito');
      setNewEvent({
        p_meeting_date: '',
        p_meeting_start_time: '',
        p_meeting_end_time: '',
        p_meeting_status: 'Pending',
        p_meeting_description: '',
        p_meeting_link: '',
        p_project_id: '',
      });
    } catch (error) {
      alert('Error al crear la reunión');
    }
  };

  // Mostrar modal para editar una reunión
  const handleEventClick = (clickInfo: any) => {
    const eventDetails = {
      meeting_id: clickInfo.event.id, // El ID de la reunión
      meeting_date: clickInfo.event.startStr.split('T')[0],
      meeting_start_time: clickInfo.event.startStr.split('T')[1].substring(0, 5),
      meeting_end_time: clickInfo.event.endStr ? clickInfo.event.endStr.split('T')[1].substring(0, 5) : '',
      meeting_status: clickInfo.event.extendedProps.meeting_status || 'Pending',
      meeting_description: clickInfo.event.extendedProps.description || '',
      meeting_link: clickInfo.event.extendedProps.link || '',
    };

    setSelectedEvent(eventDetails);
    setIsEditOpen(true); // Abrir modal de edición
  };

  const handleDateClick = (arg: any) => {
    setNewEvent({ ...newEvent, p_meeting_date: arg.dateStr });
    setIsOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const handleSaveChanges = async (updatedMeeting: any) => {
    setIsEditOpen(false);
    await updateMeetingsAfterChange(); // Actualizar las reuniones después de guardar cambios
  };

  const handleCompleteMeeting = async () => {
    try {
      // Usar el servicio para actualizar la reunión
      await updateMeeting(selectedEvent.meeting_id, { p_meeting_status: 'Completed' }, token);
      alert('Reunión completada con éxito');
      await updateMeetingsAfterChange(); // Actualizar reuniones después de completar
      setIsEditOpen(false);
    } catch (error) {
      console.error('Error al completar la reunión:', error);
      alert('Error al completar la reunión');
    }
  };

  // Obtener proyectos y reuniones cuando el componente carga
  useEffect(() => {
    if (userId && token) {
      fetchProjects(); // Obtener los proyectos
      fetchMeetings(userId).then((loadedMeetings) => {
        setMeetings(loadedMeetings); // Guardar las reuniones correctamente en el estado
      });
    }
  }, [userId, token]);

  // Mapeo de reuniones para mostrarlas en el calendario
  const mappedEvents = meetings.map((meeting) => {
    const startDateTime = new Date(`${meeting.meeting_date}T${meeting.meeting_start_time}`);
    const endDateTime = meeting.meeting_end_time
      ? new Date(`${meeting.meeting_date}T${meeting.meeting_end_time}`)
      : undefined;

    return {
      id: meeting.meeting_id,
      title: meeting.meeting_description || 'Reunión sin título', // Mostrar nombre de la reunión
      start: startDateTime,
      end: endDateTime,
      color: meeting.meeting_status === 'Completed' ? '#C4CDC4' : '#007BFF', // Color azul o gris si está completada
      extendedProps: {
        description: meeting.meeting_description,
        link: meeting.meeting_link,
        meeting_status: meeting.meeting_status,
      },
    };
  });

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 relative">
      {/* Botón de agregar evento centrado */}
      <button
        className="mb-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        + Evento
      </button>

      {/* Calendario centrado */}
      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={mappedEvents}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          eventColor="#007BFF"
          eventDisplay="block"
          height="auto"
          fixedWeekCount={false}
        />
      </div>

      {/* Modal para editar reunión */}
      {selectedEvent && (
        <EditMeeting
          meetingId={selectedEvent.meeting_id} // Asegúrate de que este valor está correctamente definido
          meetingDetails={selectedEvent}
          isOpen={isEditOpen}
          closeModal={closeEditModal}
          onCompleteMeeting={handleCompleteMeeting}
        />
      )}

      {/* Modal para crear reunión */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Agregar Nueva Reunión
                </Dialog.Title>
                <MeetingForm
                  newEvent={newEvent}
                  setNewEvent={setNewEvent}
                  selectedProjectId={newEvent.p_project_id}
                  setSelectedProjectId={(id) => setNewEvent({ ...newEvent, p_project_id: id })}
                  onSubmit={handleFormSubmit}
                  projects={projects} // Proyectos pasados al formulario
                />
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Modal de confirmación de creación */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Confirmar creación de reunión
                </Dialog.Title>
                <p className="mt-4">¿Estás seguro de que deseas crear esta reunión?</p>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={() => setIsConfirmOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={confirmCreateMeeting}
                  >
                    Confirmar
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CustomCalendar;
