import axios from 'axios';

export const uploadTestImage = async (testCaseId: number, file: File, token: string) => {
  const formData = new FormData();
  formData.append('p_test_case_id', testCaseId.toString());
  formData.append('image', file);

  try {
    const response = await axios.post('http://localhost:8080/api/test-images/register', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
};

// Obtener las imágenes de un caso de prueba
export const fetchTestImages = async (testCaseId: number, token: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/test-images/test-case/${testCaseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    throw error;
  }
};

// Eliminar una imagen
export const deleteTestImage = async (imageId: number, token: string) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/test-images/${imageId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    throw error;
  }
};