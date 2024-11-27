import axiosInstance from "../axiosapi/axiosInstance";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SurveillanceService = {
  getEmploiSurveillance: async (sessionId, departementId) => {
    try {
      const response = await axiosInstance.get("/api/surveillance/emploi", {
        params: { sessionId, departementId },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'examen:",
        error.response || error.message
      );
      throw error;
    }
  },

  getExamens: async (date, horaire, sessionId) => {
    try {
      const response = await axiosInstance.get("/api/surveillance/examens", {
        params: { date, horaire, sessionId },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'examen:",
        error.response || error.message
      );
      throw error;
    }
  },

  getSurveillanceAssignments: async (sessionId, departementId) => {
    try {
      const emploiSurveillance = await axiosInstance.get(
        "/api/surveillance/emploi",
        {
          params: { sessionId, departementId },
        }
      );

      // Transform the emploi surveillance data into a format suitable for assignments
      const surveillanceAssignments = emploiSurveillance.data.flatMap(
        (jour) => {
          const dateJour = jour.date;
          return Object.entries(jour.horaires).flatMap(([horaire, examens]) => {
            return examens.flatMap((examenData) => {
              const examen = examenData.examen;
              const surveillances = examen.surveillanceAssignations || [];
              return surveillances.map((surveillance) => ({
                date: dateJour,
                horaire: horaire,
                local: surveillance.local,
                typeSurveillant: surveillance.typeSurveillant,
                enseignant: surveillance.enseignant,
                module: examen.module,
              }));
            });
          });
        }
      );

      return surveillanceAssignments;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des assignations de surveillance:",
        error.response || error.message
      );
      throw error;
    }
  },
  getEnseignantsDisponibles: async (departementId, date, periode) => {
    try {
      const response = await axiosInstance.get(
        "/api/surveillance/enseignants-disponibles",
        {
          params: { departementId, date, periode },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'examen:",
        error.response || error.message
      );
      throw error;
    }
  },

  assignerSurveillant: async (assignmentData) => {
    try {
      const response = await axiosInstance.post("/api/surveillance/assigner", {
        examenId: assignmentData.examenId,
        enseignantId: assignmentData.enseignantId,
        localId: assignmentData.localId,
        typeSurveillant: assignmentData.typeSurveillant,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de l'assignation du surveillant:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  },

  getLocauxDisponibles: async (date, horaire) => {
    try {
      const response = await axiosInstance.get(
        "/api/surveillance/locaux-disponibles",
        {
          params: { date, horaire },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'examen:",
        error.response || error.message
      );
      throw error;
    }
  },

  exporterSurveillances: async (sessionId, departementId, toast) => {
    try {
      const emploiSurveillance =
        await SurveillanceService.getEmploiSurveillance(
          sessionId,
          departementId
        );

      const excelData = emploiSurveillance.flatMap((jour) => {
        const dateJour = jour.date;
        return Object.entries(jour.horaires).flatMap(([horaire, examens]) => {
          return examens.flatMap((examenData) => {
            const examen = examenData.examen;
            const surveillances = examen.surveillanceAssignations || [];
            return surveillances.map((surveillance) => ({
              Date: dateJour,
              Horaire: horaire,
              Module: `${examen.module}`,
              "Enseignant Responsable": `${examen.enseignant.nom} ${examen.enseignant.prenom}`,
              Surveillant: `${surveillance.enseignant.nom} ${surveillance.enseignant.prenom}`,
              Local: surveillance.local.nom,
              "Type Surveillant": surveillance.typeSurveillant,
            }));
          });
        });
      });

      // Création du fichier Excel (comme dans votre code)
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Surveillances");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `Surveillances_Session_${sessionId}_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );

      if (toast) {
        toast.show({
          severity: "success",
          summary: "Succès",
          detail: "Surveillances exportées avec succès.",
        });
      }
    } catch (error) {
      if (toast) {
        toast.show({
          severity: "error",
          summary: "Erreur",
          detail: error.message || "Erreur lors de l'exportation.",
        });
      }
      throw error; // Relancer l'erreur si nécessaire
    }
  },
};

export default SurveillanceService;
