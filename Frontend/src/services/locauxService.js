import axiosInstance from '../axiosapi/axiosInstance';

const API_URL = '/locaux';

// Fonction pour récupérer tous les locaux
export const getLocaux = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Retourne les données des locaux
  } catch (error) {
    console.error('Erreur lors de la récupération des locaux:', error);
    throw error; // Relance l'erreur pour la gérer plus haut
  }
};

// Fonction pour ajouter un local
export const addLocal = async (local) => {
  try {
    const response = await axiosInstance.post(API_URL, local);
    return response.data; // Retourne les données du local créé
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un local:", error);
    throw error; // Relance l'erreur
  }
};

// Fonction pour mettre à jour un local
export const updateLocal = async (id, local) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, local);
    return response.data; // Retourne les données mises à jour du local
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du local avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};

// Fonction pour supprimer un local
export const deleteLocal = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Retourne la réponse de la suppression
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du local avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};

// Fonction pour récupérer un local par son id
export const getLocalById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Retourne les données du local trouvé
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du local avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};
export const getLocaDispo = async (date,heure) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/locaux-disponibles/${date}/${heure}`);
    return response.data; // Retourne les données du local trouvé
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du local dispo`,
      error
    );
    throw error; // Relance l'erreur
  }
};

