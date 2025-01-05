import axiosInstance from '../axiosapi/axiosInstance'; // Assurez-vous que axiosInstance contient l'intercepteur

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/profil');
    return response.data; 
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error; 
  }
};
