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
                      id: surveillant.surveillanceId, // S'assurer que l'ID est inclus
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
  sortPeriods: (dateColumns) => {
    return dateColumns.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      const [startHourA] = a.horaire
        .split("-")
        .map((h) => parseInt(h.split(":")[0], 10));
      const [startHourB] = b.horaire
        .split("-")
        .map((h) => parseInt(h.split(":")[0], 10));
      return startHourA - startHourB;
    });
  },

  formatColumnHeader: (date, horaire) => {
    const [startHour] = horaire
      .split("-")
      .map((h) => parseInt(h.split(":")[0], 10));
    const periode = startHour < 12 ? "Matin" : "Après-midi";
    const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return {
      fullHeader: `${periode} ${formattedDate} ${horaire}`,
      shortHeader: `${periode}\n${formattedDate}\n${horaire}`,
      periode,
      date: formattedDate,
      horaire,
    };
  },

  prepareExportData: (surveillanceData) => {
    const dateColumns = [];
    surveillanceData.forEach((jour) => {
      Object.keys(jour.horaires || {}).forEach((horaire) => {
        dateColumns.push({
          date: jour.date,
          horaire: horaire,
        });
      });
    });
    const sortedDateColumns = SurveillanceService.sortPeriods(dateColumns);
    const headers = [
      "Enseignants",
      ...sortedDateColumns.map(
        (col) =>
          SurveillanceService.formatColumnHeader(col.date, col.horaire)
            .fullHeader
      ),
    ];
    return {
      dateColumns: sortedDateColumns,
      headers,
      formatColumnHeader: SurveillanceService.formatColumnHeader,
    };
  },

  exporterSurveillances: async (sessionId, departementId, toast) => {
    try {
      const emploiSurveillance =
        await SurveillanceService.getEmploiSurveillance(
          sessionId,
          departementId
        );

      // Extraire et trier les colonnes de dates
      const dateColumns = [];
      emploiSurveillance.forEach((jour) => {
        if (jour.horaires) {
          Object.entries(jour.horaires).forEach(([horaire]) => {
            dateColumns.push({
              date: jour.date,
              horaire: horaire,
            });
          });
        }
      });

      // Trier les colonnes par date et horaire
      // Trier les colonnes par date et horaire
      const sortedDateColumns = dateColumns.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Si les dates sont différentes, trier par date
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }

        // Si même date, trier d'abord par période (matin/après-midi)
        const [startHourA] = a.horaire
          .split("-")
          .map((h) => parseInt(h.split(":")[0], 10));
        const [startHourB] = b.horaire
          .split("-")
          .map((h) => parseInt(h.split(":")[0], 10));

        const isAMorning = startHourA < 12;
        const isBMorning = startHourB < 12;

        if (isAMorning !== isBMorning) {
          return isBMorning ? 1 : -1; // -1 met le matin en premier
        }

        // Si même période, trier par heure
        return startHourA - startHourB;
      });

      // Préparer les en-têtes avec le format souhaité
      const headers = ["Enseignants"];
      sortedDateColumns.forEach(({ date, horaire }) => {
        const [startHour] = horaire
          .split("-")
          .map((h) => parseInt(h.split(":")[0], 10));
        const periode = startHour < 12 ? "Matin" : "Après-midi";
        const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        headers.push(`${periode}\n${formattedDate}\n${horaire}`);
      });

      // Préparer les données des enseignants
      const excelData = emploiSurveillance.reduce((acc, jour) => {
        const enseignantMap = new Map();

        Object.entries(jour.horaires || {}).forEach(([horaire, examens]) => {
          examens.forEach((examenData) => {
            if (examenData?.examen?.surveillanceAssignations) {
              examenData.examen.surveillanceAssignations.forEach(
                (surveillance) => {
                  const enseignantKey = `${
                    surveillance.enseignant?.nom || ""
                  } ${surveillance.enseignant?.prenom || ""}`;
                  if (!enseignantMap.has(enseignantKey)) {
                    enseignantMap.set(enseignantKey, {
                      Enseignants: enseignantKey,
                      assignments: new Map(),
                    });
                  }

                  const [startHour] = horaire
                    .split("-")
                    .map((h) => parseInt(h.split(":")[0], 10));
                  const periode = startHour < 12 ? "Matin" : "Après-midi";
                  const columnKey = `${periode} ${jour.date} ${horaire}`;

                  enseignantMap.get(enseignantKey).assignments.set(columnKey, {
                    local: surveillance.local?.nom || "Non spécifié",
                    type: surveillance.typeSurveillant || "Non spécifié",
                  });
                }
              );
            }
          });
        });

        enseignantMap.forEach((value) => {
          const rowData = { Enseignants: value.Enseignants };
          sortedDateColumns.forEach(({ date, horaire }) => {
            const [startHour] = horaire
              .split("-")
              .map((h) => parseInt(h.split(":")[0], 10));
            const periode = startHour < 12 ? "Matin" : "Après-midi";
            const columnKey = `${periode} ${date} ${horaire}`;
            const assignment = value.assignments.get(columnKey);
            rowData[columnKey] = assignment
              ? `Local: ${assignment.local}\nType: ${assignment.type}`
              : "Non assigné";
          });
          acc.push(rowData);
        });

        return acc;
      }, []);

      // Créer le workbook et la worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData, {
        header: headers,
      });
      const workbook = XLSX.utils.book_new();

      // Configuration des largeurs de colonnes
      const colWidths = [
        { wch: 25 }, // Enseignants
        ...Array(headers.length - 1).fill({ wch: 20 }), // Autres colonnes
      ];
      worksheet["!cols"] = colWidths;

      // Appliquer les styles
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
              fgColor: {
                rgb: R === 0 ? "4F81BD" : R % 2 === 0 ? "F0F0F0" : "FFFFFF",
              },
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

      // Ajouter la worksheet et sauvegarder
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Planning Surveillances"
      );
      const fileName = `Planning_Surveillances_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, fileName);

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

  exporterSurveillancesPDF: async (
    sessionId,
    departementId,
    enseignantsData,
    surveillanceAssignments,
    dateColumns,
    toast
  ) => {
    try {
      const surveillanceData = await SurveillanceService.getEmploiSurveillance(
        sessionId,
        departementId
      );
      const { dateColumns: sortedDateColumns } =
        SurveillanceService.prepareExportData(surveillanceData);
      const doc = new jsPDF("landscape", "mm", "a4");

      // Configurer les marges et la zone utilisable
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 10;

      // En-tête du document
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Planning des Surveillances", pageWidth / 2, 20, {
        align: "center",
      });

      // Date d'impression
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Date d'impression: ${new Date().toLocaleDateString()}`,
        margin,
        30
      );

      // Préparer les en-têtes avec un format plus compact
      const headers = ["Enseignants"];
      // Utiliser uniquement sortedDateColumns pour les en-têtes
      sortedDateColumns.forEach(({ date, horaire }) => {
        const header = SurveillanceService.formatColumnHeader(date, horaire);
        headers.push(header.shortHeader);
      });

      // Préparer les données pour chaque enseignant
      const tableData = enseignantsData.map((enseignant) => {
        const rowData = [enseignant["Enseignants"]];
        // Utiliser les mêmes sortedDateColumns pour les données
        sortedDateColumns.forEach(({ date, horaire }) => {
          const [startHour] = horaire
            .split("-")
            .map((h) => parseInt(h.split(":")[0], 10));
          const periode = startHour < 12 ? "Matin" : "Après-midi";
          const columnKey = `${periode} ${date} ${horaire}`;
          rowData.push(enseignant[columnKey] || "Non assigné");
        });
        return rowData;
      });

      // Configuration du style de table
      const styles = {
        theme: "grid",
        headStyles: {
          fillColor: [0, 101, 189],
          textColor: 255,
          fontSize: 8,
          fontStyle: "bold",
          cellPadding: 2,
          lineColor: [67, 67, 67],
          lineWidth: 0.5,
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 2,
          halign: "center",
          valign: "middle",
        },
        columnStyles: {
          0: {
            cellWidth: 40,
            fontStyle: "bold",
            fillColor: [240, 240, 240],
          },
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      };

      // Calculer la largeur des colonnes
      const columnCount = headers.length;
      const tableWidth = pageWidth - 2 * margin;
      const standardColumnWidth = (tableWidth - 40) / (columnCount - 1);

      // Configurer les largeurs de colonnes
      const columnStyles = {
        0: { cellWidth: 40 },
      };
      for (let i = 1; i < columnCount; i++) {
        columnStyles[i] = { cellWidth: standardColumnWidth };
      }

      // Générer le tableau
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 40,
        styles,
        columnStyles,
        margin: { top: margin, right: margin, bottom: margin, left: margin },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber}`,
            pageWidth - margin,
            pageHeight - margin,
            { align: "right" }
          );
        },
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
          detail: "Planning des surveillances exporté en PDF avec succès.",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      if (toast) {
        toast.show({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de l'exportation du planning en PDF.",
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
  updateSurveillanceAssignation: async (
    assignationId,
    localId,
    typeSurveillant
  ) => {
    const response = await axiosInstance.put(
      `/api/surveillance/modifier`,
      null,
      {
        params: { assignationId, localId, typeSurveillant },
      }
    );
    return response.data;
  },
};

export default SurveillanceService;
