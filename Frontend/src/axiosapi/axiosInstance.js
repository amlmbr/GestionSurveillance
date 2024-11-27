import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8082", // URL de base de l'API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Vérifier si la requête est pour /login
    if (config.url === "/login") {
      return config; // Ne pas ajouter le token pour cette requête spécifique
    }

    // Récupérer le token d'accès depuis localStorage
    const token = localStorage.getItem("access_token");

    // Si le token existe, l'ajouter dans l'en-tête Authorization
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Retourner la configuration de la requête
    return config;
  },
  (error) => {
    // Gérer l'erreur de requête
    return Promise.reject(error);
  }
);

// Intercepteur de réponses
axiosInstance.interceptors.response.use(
  (response) => {
    // Traitez la réponse ici si nécessaire
    return response;
  },
  (error) => {
    // Gérer les erreurs de réponse
    if (error.response) {
      // Exemple: si une erreur 401 (non autorisé) est renvoyée
      if (error.response.status === 401) {
        // Vous pouvez ajouter une logique pour rediriger l'utilisateur vers la page de connexion
        console.error("Non autorisé, veuillez vous reconnecter");
        // Optionnel : redirection vers la page de login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Exemple de requête POST
const data = {
  examenId: 1, // Vérifier que l'ID de l'examen est correctement défini
  enseignantId: 1, // Vérifier que l'ID de l'enseignant est correctement défini
  localId: 1, // Vérifier que l'ID du local est correctement défini
  typeSurveillant: "PRINCIPAL", // Vérifier que le type de surveillant est correctement défini
};

console.log("Données envoyées à l'API:", data); // Log pour vérifier les données

axiosInstance
  .post("/api/surveillance/assigner", data)
  .then((response) => {
    console.log("Réponse du serveur:", response.data);
  })
  .catch((error) => {
    console.error(
      "Erreur lors de l'assignation:",
      error.response ? error.response.data : error.message
    );
  });

export default axiosInstance;
