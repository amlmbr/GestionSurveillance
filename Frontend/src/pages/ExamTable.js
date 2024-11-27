import React, { useEffect, useState, useMemo } from "react";
import ExamService from "../services/examService";
import SessionService from "../services/SessionService";
import {
  getEnseignantsByDepartement,
  getDepartements,
} from "../services/departementService";
import { getLocaux } from "../services/locauxService";

// PrimeReact Imports
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { MultiSelect } from "primereact/multiselect";

// Style imports
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Loader = () => (
  <ProgressSpinner
    style={{ width: "24px", height: "24px" }}
    strokeWidth="4"
    fill="var(--surface-ground)"
    animationDuration=".5s"
  />
);

const ExamTable = ({ sessionId }) => {
  const [session, setSession] = useState(null);
  const [horaires, setHoraires] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [locaux, setLocaux] = useState([]);
  const [cellExams, setCellExams] = useState({}); // Pour stocker le nombre d'examens par cellule
  const [state, setState] = useState({
    loadingCell: null,
    selectedCell: null,
    showDialog: false,
    showAddExamDialog: false,
  });

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [editingExam, setEditingExam] = useState(null);
  const [newExam, setNewExam] = useState({
    module: "",
    enseignant: null,
    nbEtudiants: "",
    locaux: [],
    departement: null,
  });
  const setLoadingCell = (cell) =>
    setState((prev) => ({ ...prev, loadingCell: cell }));
  const setSelectedCell = (cell) =>
    setState((prev) => ({ ...prev, selectedCell: cell }));
  const setShowDialog = (status) =>
    setState((prev) => ({ ...prev, showDialog: status }));
  const setShowAddExamDialog = (status) =>
    setState((prev) => ({ ...prev, showAddExamDialog: status }));
  const loadCellExams = async (date, horaire) => {
    try {
      const exams = await ExamService.getExams(sessionId, date, horaire);
      setCellExams((prev) => ({
        ...prev,
        [`${date}-${horaire}`]: exams.length,
      }));
      return exams;
    } catch (error) {
      console.error("Erreur lors du chargement des examens:", error);
      return [];
    }
  };
  useEffect(() => {
    const loadAllExams = async () => {
      if (!session || !horaires.length) return;
      const dates = tableData;
      for (const date of dates) {
        for (const horaire of horaires) {
          await loadCellExams(date.date, horaire);
        }
      }
    };
    if (session && horaires.length > 0) {
      loadAllExams();
    }
  }, [session, horaires]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await SessionService.getSessionById(sessionId);
        const departementData = await getDepartements();
        const locauxData = await getLocaux();

        setSession(sessionData);
        setDepartements(departementData);
        setLocaux(locauxData);

        const horairesArray = [
          `${sessionData.start1}-${sessionData.end1}`,
          `${sessionData.start2}-${sessionData.end2}`,
          `${sessionData.start3}-${sessionData.end3}`,
          `${sessionData.start4}-${sessionData.end4}`,
        ];
        setHoraires(horairesArray);
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
      }
    };
    fetchData();
  }, [sessionId]);

  useEffect(() => {
    if (newExam.departement) {
      const fetchEnseignants = async () => {
        try {
          const enseignantsData = await getEnseignantsByDepartement(
            newExam.departement.id
          );
          setEnseignants(enseignantsData);
        } catch (error) {
          console.error("Erreur lors du chargement des enseignants :", error);
        }
      };
      fetchEnseignants();
    } else {
      setEnseignants([]);
    }
  }, [newExam.departement]);

  const tableData = useMemo(() => {
    if (!session) return [];
    const { dateDebut, dateFin } = session;
    const dates = [];
    let currentDate = new Date(dateDebut);

    while (currentDate <= new Date(dateFin)) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.map((date) => ({ date }));
  }, [session]);

  const handleCellClick = async (date, horaire) => {
    setLoadingCell({ date, horaire });
    try {
      const exams = await loadCellExams(date, horaire);
      setSelectedCell({ date, horaire, exams });
      setShowDialog(true);
    } catch (error) {
      console.error("Erreur lors du chargement des examens :", error);
    } finally {
      setLoadingCell(null);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedCell(null);
  };

  const closeAddExamDialog = () => {
    setShowAddExamDialog(false);
    setNewExam({
      module: "",
      enseignant: null,
      nbEtudiants: "",
      locaux: [],
      departement: null,
    });
    setEditingExam(null);
  };

  const handleAddOrUpdateExam = async () => {
    try {
      if (
        !newExam.module ||
        !newExam.enseignant ||
        !newExam.nbEtudiants ||
        !newExam.locaux ||
        newExam.locaux.length === 0
      ) {
        return;
      }
      if (editingExam) {
        const updatedExam = {
          ...editingExam,
          module: newExam.module,
          enseignant: { id: newExam.enseignant.id },
          locaux: newExam.locaux.map((local) => ({ id: local.id })),
          departement: { id: newExam.departement.id },
          nbEtudiants: parseInt(newExam.nbEtudiants),
        };
        await ExamService.updateExam(editingExam.id, updatedExam);
      } else {
        const examData = {
          module: newExam.module,
          enseignant: { id: newExam.enseignant.id },
          locaux: newExam.locaux.map((local) => ({ id: local.id })),
          departement: { id: newExam.departement.id },
          session: { id: session.id },
          date: state.selectedCell.date,
          horaire: state.selectedCell.horaire,
          nbEtudiants: parseInt(newExam.nbEtudiants),
        };
        await ExamService.createExam(examData);
      }
      closeAddExamDialog();
      await loadCellExams(state.selectedCell.date, state.selectedCell.horaire);
      handleCellClick(state.selectedCell.date, state.selectedCell.horaire);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'examen:", error);
    }
  };
  const handleEditExam = (exam) => {
    setNewExam({
      module: exam.module,
      enseignant: exam.enseignant,
      nbEtudiants: exam.nbEtudiants,
      locaux: exam.locaux || [],
      departement: exam.departement,
    });
    setEditingExam(exam);
    setShowAddExamDialog(true);
  };
  const handleDeleteExam = async (examId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet examen ?")) {
      try {
        await ExamService.deleteExam(examId);
        await loadCellExams(
          state.selectedCell.date,
          state.selectedCell.horaire
        );
        handleCellClick(state.selectedCell.date, state.selectedCell.horaire);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'examen:",
          error.message
        );
      }
    }
  };
  const cellTemplate = (horaire) => (rowData) => {
    const isLoading =
      state.loadingCell?.date === rowData.date &&
      state.loadingCell?.horaire === horaire;
    const examCount = cellExams[`${rowData.date}-${horaire}`] || 0;

    return (
      <div
        className="cursor-pointer flex align-items-center justify-content-center gap-2"
        style={{
          minHeight: "3rem",
          // backgroundColor: isLoading
          //   ? 'var(--surface-200)'
          //   : examCount > 0
          //   ? 'var(--surface-card)'
          //   : 'var(--surface-card)',
          transition: "all 0.2s",
          // border: examCount > 0 ? '1px solid var(--primary-200)' : 'none',
          borderRadius: "4px",
        }}
        onClick={() => handleCellClick(rowData.date, horaire)}
      >
        {isLoading ? (
          <Loader />
        ) : examCount > 0 ? (
          <>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <span
                  className="text-primary"
                  style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                >
                  Nombre d'examens : {examCount}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <i
                  className="pi pi-calendar-plus text-primary"
                  style={{ fontSize: "1.2rem" }}
                />
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <span className="text-500" style={{ fontSize: "0.9rem" }}>
                Aucun examen
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <i
                className="pi pi-plus-circle text-500"
                style={{ fontSize: "1.2rem" }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  const locauxTemplate = (rowData) => (
    <div className="flex align-items-center">
      <i className="pi pi-building mr-2"></i>
      <span>{rowData.locaux?.map((local) => local.nom).join(", ")}</span>
    </div>
  );
  if (!session) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  const addExamDialogFooter = (
    <div>
      <Button
        label="Annuler"
        icon="pi pi-times"
        onClick={closeAddExamDialog}
        className="p-button-text"
      />
      <Button
        label={editingExam ? "Modifier" : "Ajouter"}
        icon={editingExam ? "pi pi-pencil" : "pi pi-check"}
        onClick={handleAddOrUpdateExam}
        autoFocus
      />
    </div>
  );

  return (
    <div
      style={{
        backgroundImage: "url(/ensajbg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        className="flex justify-content-center"
        style={{ marginTop: "100px" }}
      >
        <div className="w-10 md:w-8 lg:w-7" style={{ minWidth: "800px" }}>
          <Card>
            <div className="text-center mb-5">
              <h2 className="m-0">Gestion des Examens</h2>
              <div
                className="text-900 text-3xl font-medium mb-3"
                style={{ color: "#495057" }}
              ></div>
              <span className="text-600 font-medium">
                Session {session?.nom}
              </span>
            </div>
            <DataTable
              value={tableData}
              responsiveLayout="scroll"
              className="p-datatable-sm"
              showGridlines
              rows={rows}
              first={first}
              onPage={(e) => {
                setFirst(e.first);
                setRows(e.rows);
              }}
              paginator
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} entrées"
              rowsPerPageOptions={[5, 10, 15, 20]}
              paginatorClassName="justify-content-end"
            >
              <Column
                field="date"
                header="Dates"
                sortable
                style={{ width: "80px" }}
              />
              {horaires.map((horaire) => (
                <Column
                  key={horaire}
                  header={horaire}
                  body={cellTemplate(horaire)}
                  style={{ width: "100px" }}
                />
              ))}
            </DataTable>
          </Card>
        </div>
      </div>

      {/* Dialog pour la liste des examens */}
      <Dialog
        header={
          <div className="flex align-items-center">
            <i
              className="pi pi-calendar mr-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span>
              Examens - {state.selectedCell?.date} à{" "}
              {state.selectedCell?.horaire}
            </span>
          </div>
        }
        visible={state.showDialog}
        style={{ width: "80vw" }}
        onHide={closeDialog}
        footer={
          <Button
            label="Ajouter un examen"
            icon="pi pi-plus-circle"
            className="p-button-success"
            onClick={() => setShowAddExamDialog(true)}
          />
        }
      >
        {state.selectedCell?.exams?.length ? (
          <div className="card">
            <DataTable value={state.selectedCell.exams} stripedRows>
              <Column
                header="#"
                body={(data, options) => options.rowIndex + 1}
                style={{ width: "3rem" }}
              />
              <Column
                header="Module"
                body={(rowData) => (
                  <div>
                    <div className="text-primary">{rowData.module}</div>
                  </div>
                )}
              />
              <Column
                header="Enseignant Responsable"
                body={(rowData) => (
                  <div className="flex align-items-center">
                    <i className="pi pi-user mr-2"></i>
                    <span>
                      {rowData.enseignant.nom} {rowData.enseignant.prenom}
                    </span>
                  </div>
                )}
              />
              <Column header="Locaux" body={locauxTemplate} />
              <Column
                header="Étudiants"
                body={(rowData) => (
                  <div className="flex align-items-center">
                    <i className="pi pi-users mr-2"></i>
                    <span>{rowData.nbEtudiants} étudiants</span>
                  </div>
                )}
              />
              <Column
                header="Département"
                body={(rowData) => (
                  <div className="flex align-items-center">
                    <i className="pi pi-bookmark mr-2"></i>
                    <span>{rowData.departement.nom}</span>
                  </div>
                )}
              />
              <Column
                header="Actions"
                body={(rowData) => (
                  <div className="flex gap-2 justify-content-center">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-rounded p-button-text"
                      tooltip="Modifier"
                      onClick={() => handleEditExam(rowData)}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-text p-button-danger"
                      tooltip="Supprimer"
                      onClick={() => handleDeleteExam(rowData.id)}
                    />
                  </div>
                )}
                style={{ width: "8rem" }}
              />
            </DataTable>
          </div>
        ) : (
          <Message
            severity="info"
            text="Aucun examen programmé"
            className="w-full"
          />
        )}
      </Dialog>
      {/* Dialog pour ajouter un examen */}
      <Dialog
        header={
          <div className="flex align-items-center">
            <i
              className="pi pi-plus-circle mr-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span>Ajouter un Examen</span>
          </div>
        }
        visible={state.showAddExamDialog}
        style={{ width: "50vw" }}
        onHide={closeAddExamDialog}
        footer={addExamDialogFooter}
      >
        <div className="grid p-4">
          <div className="col-12 field">
            <label className="flex align-items-center gap-3 mb-2">
              <span className="text-xl font-bold">Module</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-book text-primary text-lg" />
              </span>
              <InputText
                value={newExam.module}
                onChange={(e) =>
                  setNewExam({ ...newExam, module: e.target.value })
                }
                className="p-inputtext-lg"
                placeholder="Entrez le nom du module"
              />
            </div>
          </div>
          <div className="col-12 field">
            <label className="flex align-items-center gap-3 mb-2">
              <span className="text-xl font-bold">Département</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-building text-primary text-lg" />
              </span>
              <Dropdown
                value={newExam.departement}
                options={departements}
                onChange={(e) =>
                  setNewExam({ ...newExam, departement: e.value })
                }
                optionLabel="nom"
                placeholder="Sélectionner un département"
                className="w-full p-inputtext-lg"
              />
            </div>
          </div>
          {newExam.departement && (
            <div className="col-12 field">
              <label className="flex align-items-center gap-3 mb-2">
                <span className="text-xl font-bold">Enseignant</span>
              </label>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user text-primary text-lg" />
                </span>
                <Dropdown
                  value={newExam.enseignant}
                  options={enseignants}
                  onChange={(e) =>
                    setNewExam({ ...newExam, enseignant: e.value })
                  }
                  optionLabel="nom"
                  placeholder="Sélectionner un enseignant"
                  className="w-full p-inputtext-lg"
                />
              </div>
            </div>
          )}
          <div className="col-12 field">
            <label className="flex align-items-center gap-3 mb-2">
              <span className="text-xl font-bold">Nombre d'étudiants</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-users text-primary text-lg" />
              </span>
              <InputText
                type="number"
                value={newExam.nbEtudiants}
                onChange={(e) =>
                  setNewExam({ ...newExam, nbEtudiants: e.target.value })
                }
                className="p-inputtext-lg"
                placeholder="Entrez le nombre d'étudiants"
              />
            </div>
          </div>

          <div className="col-12 field">
            <label className="flex align-items-center gap-3 mb-2">
              <span className="text-xl font-bold">Locaux</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-building text-primary text-lg" />
              </span>
              <MultiSelect
                value={newExam.locaux}
                options={locaux}
                onChange={(e) => setNewExam({ ...newExam, locaux: e.value })}
                optionLabel="nom"
                placeholder="Sélectionner un ou plusieurs locaux"
                className="w-full p-inputtext-lg"
                display="chip"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ExamTable;
