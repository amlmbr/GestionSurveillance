import axiosInstance from '../axiosapi/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/login', {
      username,
      password,
    });
    return response.data; 
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};
export const sendResetCode = async (to, subject,text) => {
  try {
    const response = await axiosInstance.post('/email', {
      to,
      subject,
      text
    });
    return response.data; 
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};
export const updatePassword = async (email, password,) => {
  try {
    const response = await axiosInstance.put('/userupdate', {
      email,
      password
    });
    return response.data; 
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};
