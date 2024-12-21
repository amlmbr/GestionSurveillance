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
      console.error(
        "Erreur lors de la création de l'examen:",
        error.response || error.message
      );
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
                      local: surveillant.local.nom || "Non spécifié",
                      typeSurveillant:
                        surveillant.typeSurveillant || "Non spécifié",
                      enseignant: `${surveillant.enseignant.nom || ""} ${
                        surveillant.enseignant.prenom || ""
                      }`,
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
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des assignations"
      );
    }
  },
  getAssignationsByDate: async (date, sessionId, departementId) => {
    try {
      const response = await axiosInstance.get(
        "/api/surveillance/assignments/by-date",
        {
          params: {
            date,
            sessionId,
            departementId,
          },
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
        departementId: assignmentData.departementId,
        sessionId: assignmentData.sessionId,
        optionId: assignmentData.optionId,
        moduleId: assignmentData.moduleId,
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

  exporterSurveillancesPDF: async (sessionId, departementId, toast) => {
    try {
      // Récupérer les données de surveillance
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
        { align: "center" }
      );

      let startY = 25; // Position de départ verticale

      emploiSurveillance.forEach((jour) => {
        // Ajouter la date comme en-tête
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Date: ${jour.date}`, 10, startY);
        startY += 5;

        // Trier les horaires entre matin et après-midi
        const horairesMatin = [];
        const horairesApresMidi = [];

        Object.entries(jour.horaires).forEach(([horaire, examens]) => {
          const heureDebut = parseInt(horaire.split(":")[0], 10);
          if (heureDebut >= 8 && heureDebut < 12) {
            horairesMatin.push({ horaire, examens });
          } else if (heureDebut >= 12) {
            horairesApresMidi.push({ horaire, examens });
          }
        });

        // Fonction pour ajouter une section horaire
        const addHoraireSection = (sectionTitle, horaires) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(sectionTitle, 10, startY);
          startY += 5;

          horaires.forEach(({ horaire, examens }) => {
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`Horaire: ${horaire}`, 15, startY);
            startY += 4;

            examens.forEach((examenData) => {
              const examen = examenData.examen;
              const surveillances = examen.surveillanceAssignations || [];

              // Détail des surveillances
              surveillances
                .filter(
                  (surveillance) =>
                    surveillance.enseignant.departementId === departementId
                )
                .forEach((surveillance) => {
                  const details = `
                    Module: ${examen.module} |
                    Responsable: ${examen.enseignant.nom} ${examen.enseignant.prenom} |
                    Surveillant: ${surveillance.enseignant.nom} ${surveillance.enseignant.prenom} |
                    Local: ${surveillance.local.nom} (${surveillance.typeSurveillant})
                  `;
                  doc.text(details, 20, startY);
                  startY += 4;

                  // Gérer les sauts de page
                  if (startY > doc.internal.pageSize.height - 10) {
                    doc.addPage();
                    startY = 10;
                  }
                });
            });
          });
        };

        // Ajouter les sections matin et après-midi
        if (horairesMatin.length > 0) {
          addHoraireSection("Matin", horairesMatin);
        }
        if (horairesApresMidi.length > 0) {
          addHoraireSection("Après-midi", horairesApresMidi);
        }

        // Ajouter une marge entre les jours
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
        });
      }
    } catch (error) {
      if (toast) {
        toast.show({
          severity: "error",
          summary: "Erreur",
          detail: error.message || "Erreur lors de l'exportation PDF.",
        });
      }
      throw error;
    }
  },
};

export default SurveillanceService;
