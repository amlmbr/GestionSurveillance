import axiosInstance from "../axiosapi/axiosInstance";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SurveillanceService = {
  getEmploiSurveillance: async (sessionId, departementId) => {
    try {
      const response = await axiosInstance.get("/api/surveillance/emploi", {
        params: { sessionId, departementId },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'emploi:", error);
      throw error;
    }
  },

  getExamens: async (date, horaire, sessionId) => {
    try {
      const response = await axiosInstance.get("/api/surveillance/examens", {
        params: { date, horaire, sessionId },
      });
      return response.data.map((exam) => ({
        ...exam,
        moduleInfo: {
          nom: exam.module?.nom,
          code: exam.module?.code,
        },
        optionInfo: {
          nom: exam.option?.nom,
          code: exam.option?.code,
        },
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des examens:", error);
      throw error;
    }
  },

  getSurveillanceAssignments: async (sessionId, departementId) => {
    try {
      const response = await axiosInstance.get("/api/surveillance/emploi", {
        params: { sessionId, departementId },
      });

      const assignments = {};

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((jour) => {
          if (jour.horaires) {
            Object.entries(jour.horaires).forEach(([horaire, surveillants]) => {
              if (Array.isArray(surveillants)) {
                surveillants.forEach((surveillant) => {
                  if (surveillant.enseignant && surveillant.local) {
                    const key = `${jour.date}_${horaire}`;
                    if (!assignments[key]) {
                      assignments[key] = [];
                    }
                    assignments[key].push({
                      id: surveillant.id, // S'assurer que l'ID est inclus
                      local: surveillant.local.nom || "Non spécifié",
                      typeSurveillant:
                        surveillant.typeSurveillant || "Non spécifié",
                      enseignant: `${surveillant.enseignant.nom || ""} ${
                        surveillant.enseignant.prenom || ""
                      }`,
                      surveillanceId: surveillant.surveillanceId, // Ajouter aussi l'ID de la surveillance
                    });
                  }
                });
              }
            });
          }
        });
      }
      return assignments;
    } catch (error) {
      console.error("Erreur dans getSurveillanceAssignments:", error);
      throw error;
    }
  },
  getAssignationsByDate: async (date, sessionId, departementId) => {
    try {
      const response = await axiosInstance.get(
        "/api/surveillance/assignments/by-date",
        {
          params: { date, sessionId, departementId },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des assignations par date:",
        error
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
        "Erreur lors de la récupération des enseignants disponibles:",
        error
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
        departementId: assignmentData.departementId,
        sessionId: assignmentData.sessionId,
        optionId: assignmentData.optionId,
        moduleId: assignmentData.moduleId,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'assignation du surveillant:", error);
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
        "Erreur lors de la récupération des locaux disponibles:",
        error
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

      // Format des données pour Excel
      const excelData = [];

      // Traiter chaque jour
      emploiSurveillance.forEach((jour) => {
        const dateStr = jour.date;

        // Traiter les horaires
        Object.entries(jour.horaires || {}).forEach(([horaire, examens]) => {
          const [startTime] = horaire.split("-");
          const hour = parseInt(startTime);
          const period = hour < 12 ? "Matin" : "Après-midi";

          examens.forEach((examenData) => {
            // Vérifier si l'examen a des surveillants assignés
            if (examenData && examenData.examen) {
              const examen = examenData.examen;

              // Si pas de surveillants assignés, ajouter une ligne "Non assigné"
              if (
                !examen.surveillanceAssignations ||
                examen.surveillanceAssignations.length === 0
              ) {
                excelData.push({
                  Date: dateStr,
                  Période: period,
                  Horaire: horaire,
                  Module: `${examen.module?.code || ""} - ${
                    examen.module?.nom || ""
                  }`,
                  Option: `${examen.option?.code || ""} - ${
                    examen.option?.nom || ""
                  }`,
                  "Enseignant Responsable": `${examen.enseignant?.nom || ""} ${
                    examen.enseignant?.prenom || ""
                  }`,
                  Surveillant: "Non assigné",
                  "Type Surveillance": "Non assigné",
                  Local: "Non assigné",
                });
              } else {
                // Ajouter une ligne pour chaque surveillance assignée
                examen.surveillanceAssignations.forEach((surveillance) => {
                  excelData.push({
                    Date: dateStr,
                    Période: period,
                    Horaire: horaire,
                    Module: `${examen.module?.code || ""} - ${
                      examen.module?.nom || ""
                    }`,
                    Option: `${examen.option?.code || ""} - ${
                      examen.option?.nom || ""
                    }`,
                    "Enseignant Responsable": `${
                      examen.enseignant?.nom || ""
                    } ${examen.enseignant?.prenom || ""}`,
                    Surveillant: `${surveillance.enseignant?.nom || ""} ${
                      surveillance.enseignant?.prenom || ""
                    }`,
                    "Type Surveillance":
                      surveillance.typeSurveillant || "Non spécifié",
                    Local: surveillance.local?.nom || "Non spécifié",
                  });
                });
              }
            }
          });
        });
      });

      // Créer le workbook et la worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      // Configuration des largeurs de colonnes
      const colWidths = [
        { wch: 12 }, // Date
        { wch: 10 }, // Période
        { wch: 12 }, // Horaire
        { wch: 25 }, // Module
        { wch: 25 }, // Option
        { wch: 25 }, // Enseignant Responsable
        { wch: 25 }, // Surveillant
        { wch: 15 }, // Type Surveillance
        { wch: 15 }, // Local
      ];
      worksheet["!cols"] = colWidths;

      // Ajouter des styles aux cellules
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);

          if (!worksheet[cell_ref]) continue;

          worksheet[cell_ref].s = {
            font: {
              bold: R === 0,
              color: { rgb: R === 0 ? "FFFFFF" : "000000" },
            },
            fill: {
              fgColor: { rgb: R === 0 ? "4F81BD" : "FFFFFF" },
            },
            alignment: {
              vertical: "center",
              horizontal: "center",
              wrapText: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }

      // Ajouter la worksheet au workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Planning Surveillances"
      );

      // Générer le nom du fichier avec la date actuelle
      const fileName = `Planning_Surveillances_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Sauvegarder le fichier
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);

      if (toast) {
        toast.show({
          severity: "success",
          summary: "Succès",
          detail: "Planning des surveillances exporté avec succès.",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      if (toast) {
        toast.show({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de l'exportation du planning.",
          life: 3000,
        });
      }
      throw error;
    }
  },

  exporterSurveillancesPDF: async (sessionId, departementId, toast) => {
    try {
      const emploiSurveillance =
        await SurveillanceService.getEmploiSurveillance(
          sessionId,
          departementId
        );

      // Créer un nouveau document PDF
      const doc = new jsPDF();

      // Ajouter le titre
      doc.setFontSize(16);
      doc.text(
        "Planning des Surveillances",
        doc.internal.pageSize.width / 2,
        15,
        {
          align: "center",
        }
      );

      let startY = 25;

      emploiSurveillance.forEach((jour) => {
        // Ajouter la date
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Date: ${jour.date}`, 10, startY);
        startY += 10;

        // Traiter les horaires
        Object.entries(jour.horaires || {}).forEach(([horaire, examens]) => {
          // Ajouter l'horaire
          doc.setFontSize(10);
          doc.text(`Horaire: ${horaire}`, 15, startY);
          startY += 5;

          examens.forEach((examenData) => {
            if (examenData && examenData.examen) {
              const examen = examenData.examen;

              // Informations de l'examen
              const examenInfo = `Module: ${examen.module?.code || ""} - ${
                examen.module?.nom || ""
              }`;
              doc.text(examenInfo, 20, startY);
              startY += 5;

              // Vérifier les surveillances
              if (
                !examen.surveillanceAssignations ||
                examen.surveillanceAssignations.length === 0
              ) {
                doc.text("Surveillance: Non assigné", 20, startY);
                startY += 5;
              } else {
                examen.surveillanceAssignations.forEach((surveillance) => {
                  const surveillanceInfo = `Surveillant: ${
                    surveillance.enseignant?.nom || ""
                  } ${surveillance.enseignant?.prenom || ""} | Local: ${
                    surveillance.local?.nom || ""
                  } (${surveillance.typeSurveillant || ""})`;
                  doc.text(surveillanceInfo, 20, startY);
                  startY += 5;
                });
              }

              // Ajouter un espace entre les examens
              startY += 5;

              // Vérifier si on doit passer à une nouvelle page
              if (startY > doc.internal.pageSize.height - 20) {
                doc.addPage();
                startY = 20;
              }
            }
          });
        });

        // Ajouter un espace entre les jours
        startY += 10;
      });

      // Sauvegarder le PDF
      const fileName = `Planning_Surveillances_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      if (toast) {
        toast.show({
          severity: "success",
          summary: "Succès",
          detail: "Surveillances exportées en PDF avec succès.",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      if (toast) {
        toast.show({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de l'exportation PDF.",
          life: 3000,
        });
      }
      throw error;
    }
  },
  deleteSurveillanceAssignation: async (assignationId) => {
    if (!assignationId) {
      throw new Error("ID d'assignation invalide");
    }

    try {
      const response = await axiosInstance.delete(
        `/api/surveillance/supprimer/${assignationId}`
      );

      if (response.status === 200) {
        return true;
      }

      throw new Error(response.data?.message || "Échec de la suppression");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'assignation:", error);
      throw (
        error.response?.data?.message ||
        "Erreur lors de la suppression de l'assignation"
      );
    }
  },

  // Méthode auxiliaire pour rafraîchir les données après une suppression
  refreshSurveillanceData: async (sessionId, departementId) => {
    try {
      const response = await axiosInstance.get("/api/surveillance/emploi", {
        params: { sessionId, departementId },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
      throw error;
    }
  },
};

export default SurveillanceService;
