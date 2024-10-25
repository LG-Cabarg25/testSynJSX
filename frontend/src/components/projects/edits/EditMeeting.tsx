import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AuthContext } from '../../../context/AuthContext';
import { updateMeeting } from '../../../services/meetingService'; // Importar el servicio

interface EditMeetingProps {
  meetingId: number;
  meetingDetails: {
    meeting_date: string;
    meeting_start_time: string;
    meeting_end_time: string;
    meeting_status: string;
    meeting_description: string;
    meeting_link: string;
  };
  isOpen: boolean;
  closeModal: () => void;
  onCompleteMeeting: () => void;
}

const EditMeeting: React.FC<EditMeetingProps> = ({
  meetingId,
  meetingDetails,
  isOpen,
  closeModal,
  onCompleteMeeting,
}) => {
  const { token } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMeeting, setUpdatedMeeting] = useState(meetingDetails);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false); // Estado para modal de confirmación

  useEffect(() => {
    setUpdatedMeeting(meetingDetails);
  }, [meetingId, meetingDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedMeeting({
      ...updatedMeeting,
      [name]: value,
    });
  };

  // Lógica de guardar cambios usando el servicio
  const handleSaveClick = async () => {
    setLoadingSave(true);
    try {
      if (!token) {
        alert('No se encontró el token de autenticación');
        setLoadingSave(false);
        return;
      }

      // Enviar solo los datos actualizados sin incluir el estado de la reunión
      const cleanData = {
        p_meeting_date: updatedMeeting.meeting_date || null,
        p_meeting_start_time: updatedMeeting.meeting_start_time || null,
        p_meeting_end_time: updatedMeeting.meeting_end_time || null,
        p_meeting_description: updatedMeeting.meeting_description || null,
        p_meeting_link: updatedMeeting.meeting_link || null,
      };

      await updateMeeting(meetingId, cleanData, token); // Usar el servicio para actualizar la reunión
      alert('Cambios guardados exitosamente');
      setIsEditing(false);
      closeModal();
    } catch (error) {
      console.error('Error al actualizar la reunión:', error);
      alert('Error al actualizar la reunión');
    } finally {
      setLoadingSave(false);
    }
  };

  // Abre el modal de confirmación antes de completar la reunión
  const openConfirmComplete = () => {
    setIsConfirmCompleteOpen(true);
  };

  // Cierra el modal de confirmación
  const closeConfirmComplete = () => {
    setIsConfirmCompleteOpen(false);
  };

  // Lógica de completar la reunión usando el servicio
  const handleCompleteClick = async () => {
    setLoadingComplete(true);
    try {
      if (!token) {
        alert('No se encontró el token de autenticación');
        setLoadingComplete(false);
        return;
      }

      await updateMeeting(meetingId, { p_meeting_status: 'Completed' }, token); // Usar el servicio para completar la reunión
      alert('Reunión completada con éxito');
      onCompleteMeeting();
      closeModal();
    } catch (error) {
      console.error('Error al completar la reunión:', error);
      alert('Error al completar la reunión');
    } finally {
      setLoadingComplete(false);
      closeConfirmComplete(); // Cierra el modal de confirmación
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
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
                  {updatedMeeting.meeting_status === 'Completed'
                    ? 'Reunión Completada'
                    : 'Editar Detalles de la Reunión'}
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      name="meeting_description"
                      value={updatedMeeting.meeting_description}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 border rounded-md"
                      disabled={updatedMeeting.meeting_status === 'Completed' || !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input
                      type="date"
                      name="meeting_date"
                      value={updatedMeeting.meeting_date}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 border rounded-md"
                      disabled={updatedMeeting.meeting_status === 'Completed' || !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
                    <input
                      type="time"
                      name="meeting_start_time"
                      value={updatedMeeting.meeting_start_time}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 border rounded-md"
                      disabled={updatedMeeting.meeting_status === 'Completed' || !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hora de Fin</label>
                    <input
                      type="time"
                      name="meeting_end_time"
                      value={updatedMeeting.meeting_end_time}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 border rounded-md"
                      disabled={updatedMeeting.meeting_status === 'Completed' || !isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Link</label>
                    <input
                      type="url"
                      name="meeting_link"
                      value={updatedMeeting.meeting_link}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 border rounded-md"
                      disabled={updatedMeeting.meeting_status === 'Completed' || !isEditing}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  {!isEditing && updatedMeeting.meeting_status !== 'Completed' && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Editar Reunión
                    </button>
                  )}
                  {isEditing && (
                    <button
                      onClick={handleSaveClick}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      disabled={loadingSave || loadingComplete} // Deshabilitar mientras guarda o completa
                    >
                      {loadingSave ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  )}
                  <button
                    onClick={openConfirmComplete} // Mostrar modal de confirmación
                    className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${
                      updatedMeeting.meeting_status === 'Completed' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={updatedMeeting.meeting_status === 'Completed' || loadingComplete || isEditing} // Deshabilitar si está completado o guardando
                  >
                    {loadingComplete ? 'Completando...' : 'Completar Reunión'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Modal de confirmación para completar la reunión */}
      <Transition appear show={isConfirmCompleteOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeConfirmComplete}>
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
                  Confirmar Completar Reunión
                </Dialog.Title>
                <div className="mt-4">
                  <p>¿Estás seguro de que deseas completar esta reunión?</p>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeConfirmComplete}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCompleteClick}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Confirmar
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditMeeting;
