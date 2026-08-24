import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

interface UploadResponse {
  message: string;
  filename: string;
  chunks: number;
}

interface ChatResponse {
  question: string;
  answer: string;
}

export const uploadPDF = async (
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
  question: string
): Promise<ChatResponse> => {
  const response = await API.post<ChatResponse>(
    "/chat",
    {
      question,
    }
  );

  return response.data;
};