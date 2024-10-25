import React, { useState, useEffect } from 'react';
import { fetchComments, postComment } from '../../services/commentsTestService';

interface CommentTestCaseProps {
  testCaseId: number;
  onClose: () => void;
  token: string;
}

const CommentTestCase: React.FC<CommentTestCaseProps> = ({ testCaseId, onClose, token }) => {
  const [comments, setComments] = useState<any[]>([]); // Lista de comentarios
  const [newComment, setNewComment] = useState<string>(""); // Comentario nuevo
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Manejo de errores

  // Cargar los comentarios al abrir el modal
  useEffect(() => {
    const loadComments = async () => {
      setLoading(true); // Mostrar estado de carga
      try {
        const data = await fetchComments(testCaseId, token); // Obtener comentarios del caso de prueba
        setComments(data); // Actualizar el estado con los comentarios o lista vacía
        setErrorMessage(null); // Limpiar cualquier mensaje de error si la carga es exitosa
      } catch (error: any) {
        setErrorMessage('No se pudieron cargar los comentarios. Intente nuevamente más tarde.');
      } finally {
        setLoading(false); // Finalizar estado de carga
      }
    };

    loadComments();
  }, [testCaseId, token]);

  // Manejar el envío de comentarios
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // No enviar si el comentario está vacío

    try {
      const commentData = {
        test_case_id: testCaseId, // ID del caso de prueba
        comment_text: newComment // Texto del comentario
      };

      const addedComment = await postComment(commentData, token); // Llamar al servicio para agregar el comentario

      // Actualizar la lista de comentarios con el nuevo comentario
      setComments((prevComments) => [...prevComments, { ...addedComment, comment_id: Date.now() }]);

      setNewComment(""); // Limpiar el campo de comentario
    } catch (error) {
      setErrorMessage('No se pudo agregar el comentario. Intente nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Comentarios</h2>

        {loading ? (
          <p>Cargando comentarios...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <div className="max-h-64 overflow-y-auto mb-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.comment_id || Date.now()} className="mb-2 bg-blue-100 p-2 rounded"> {/* Añadir un fondo celeste a los comentarios */}
                  <p className="text-sm text-gray-700">{comment.comment_text}</p>
                </div>
              ))
            ) : (
              <p>No hay comentarios aún.</p> // Mensaje cuando no hay comentarios
            )}
          </div>
        )}

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          className="w-full p-2 border rounded mb-2"
        />

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cerrar</button>
          <button onClick={handleCommentSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Comentar</button>
        </div>
      </div>
    </div>
  );
};

export default CommentTestCase;
