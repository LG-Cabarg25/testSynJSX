// services/commentsTestService.ts
import axios from "axios";
import { SERVIDOR } from "./Servidor";

export const postComment = async (
  commentData: { test_case_id: number; comment_text: string },
  token: string
) => {
  try {
    const response = await axios.post(
      `${SERVIDOR}/api/test-comments/register`,
      {
        p_test_case_id: commentData.test_case_id, // Cambiar a p_test_case_id
        p_comment_text: commentData.comment_text, // Cambiar a p_comment_text
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al agregar comentario", error.message);
    }
    throw error;
  }
};

export const fetchComments = async (testCaseId: number, token: string) => {
  try {
    const response = await axios.get(
      `${SERVIDOR}/api/test-comments/test-case/${testCaseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error", error.message);
    }
    throw error;
  }
};
