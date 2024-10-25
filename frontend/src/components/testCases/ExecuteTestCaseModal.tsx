import React, { useState } from 'react';
import { uploadTestImage } from '../../services'; // Servicio para cargar imágenes
import { registerDefect } from '../../services'; // Servicio para registrar defectos

interface ExecuteTestCaseModalProps {
  testCaseId: number;
  onClose: () => void;
  token: string;
}

const ExecuteTestCaseModal: React.FC<ExecuteTestCaseModalProps> = ({ testCaseId, onClose, token }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [defectDescription, setDefectDescription] = useState('');
  const [severity, setSeverity] = useState('Low');
  const [status, setStatus] = useState('Returned'); // Añadir estado con valor predeterminado 'Returned'
  const [loading, setLoading] = useState(false);

  // Manejar el cambio del archivo de imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  // Subir la imagen
  const handleUploadImage = async () => {
    if (selectedImage) {
      setLoading(true);
      try {
        await uploadTestImage(testCaseId, selectedImage, token);
        alert('Imagen subida exitosamente.');
        setSelectedImage(null);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Registrar un defecto
  const handleRegisterDefect = async () => {
    setLoading(true);
    try {
      // Pasar el estado junto con la descripción y la severidad
      await registerDefect(testCaseId, defectDescription, severity, status, token);
      alert('Defecto registrado exitosamente.');
      setDefectDescription('');
    } catch (error) {
      console.error('Error al registrar el defecto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Ejecutar Caso de Prueba</h2>

        {/* Sección para subir imagen */}
        <div className="mb-4">
          <h3 className="text-lg font-bold">Subir Evidencia</h3>
          <input type="file" onChange={handleImageChange} className="mb-2" />
          <button
            onClick={handleUploadImage}
            disabled={!selectedImage || loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? 'Cargando...' : 'Subir Imagen'}
          </button>
        </div>

        {/* Sección para registrar defecto */}
        <div className="mb-4">
          <h3 className="text-lg font-bold">Registrar Defecto</h3>
          <textarea
            value={defectDescription}
            onChange={(e) => setDefectDescription(e.target.value)}
            placeholder="Descripción del defecto"
            className="w-full p-2 border rounded mb-2"
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="Low">Bajo</option>
            <option value="Medium">Medio</option>
            <option value="High">Alto</option>
          </select>

          {/* Campo para seleccionar el estado */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="Returned">Retornado</option>
            <option value="Approved">Aprobado</option>
            <option value="Rejected">Rechazado</option>
          </select>

          <button
            onClick={handleRegisterDefect}
            disabled={!defectDescription || loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? 'Registrando...' : 'Registrar Defecto'}
          </button>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecuteTestCaseModal;
