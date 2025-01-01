import axiosInstance from "../axiosapi/axiosInstance";

const API_URL = "/students";

export const getAllStudents = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const importStudents = async (file, sessionId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      `${API_URL}/import/${sessionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error importing students:", error);
    throw error;
  }
};

export const getStudentsByOption = async (optionId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/option/${optionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students by option:", error);
    throw error;
  }
};
