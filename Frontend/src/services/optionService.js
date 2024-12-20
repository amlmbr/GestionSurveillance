import axiosInstance from '../axiosapi/axiosInstance';

const API_URL = '/options';

// Fonction pour récupérer toutes les options
export const getOptions = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    console.log('Options reçues:', response.data); // Pour le débogage
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error);
    throw error;
  }
};

// Fonction pour récupérer une option par son id
export const getOptionById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Retourne les données de l'option trouvée
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'option avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};

// Fonction pour ajouter une nouvelle option
export const addOption = async (option) => {
  try {
    const response = await axiosInstance.post(API_URL, option);
    return response.data; // Retourne les données de l'option créée
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une option:", error);
    throw error; // Relance l'erreur
  }
};

// Fonction pour mettre à jour une option existante
// optionService.js
export const updateOption = async (id, option) => {
  try {
    // S'assurer que nous envoyons les bonnes données
    const updateData = {
      id: option.id,
      nom: option.nom,
      departement: {
        id: option.departement.id,
      },
    };

    console.log('Données envoyées pour la mise à jour:', updateData);

    const response = await axiosInstance.put(`${API_URL}/${id}`, updateData);
    console.log('Réponse de la mise à jour:', response.data);

    // Actualiser la liste des options immédiatement
    const updatedList = await getOptions();
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'option avec id ${id}:`,
      error
    );
    throw error;
  }
};

// Fonction pour supprimer une option
export const deleteOption = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Retourne la réponse de la suppression
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'option avec id ${id}:`,
      error
    );
    throw error; // Relance l'erreur
  }
};
