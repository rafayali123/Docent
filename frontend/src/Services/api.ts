import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  timeout: 120000,
});

export interface UploadResponse {
  message: string;
  document_id: string;
  filename: string;
  chunks?: number;
  total_pages?: number;
}

interface ChatResponse {
  question: string;
  answer: string;
}

export const uploadFile = async (
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post<UploadResponse>(
    "/upload",
    formData
  );

  return response.data;
};

export const askQuestion = async (
  question: string,
  documentId: string
): Promise<ChatResponse> => {
  const response = await API.post<ChatResponse>(
    "/chat",
    {
      question,
      document_id: documentId,
    }
  );

  return response.data;
};