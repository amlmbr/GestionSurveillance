import React, { useEffect, useState, useMemo } from "react";
import ExamService from "../services/examService";
import SessionService from "../services/SessionService";
import {
  getEnseignantsByDepartement,
  getDepartements,
  getOptionsByDepartement,
} from "../services/departementService";
import {getModulesByOptionId} from "../services/optionService"
import { getLocaDispo } from "../services/locauxService";
import { Checkbox } from 'primereact/checkbox';
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
  const [autolocal,setAutoLocal]=useState(false);
  const [horaires, setHoraires] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [options, setOptions] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleLoading, setModuleLoading] = useState(false);

 // const [modules, setModules] = useState([]);
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
    module: null,
    enseignant: null,
    nbEtudiants: "",
    locaux: [],
    departement: null,
    option: null,
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
       
        setSession(sessionData);
        setDepartements(departementData);
       

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

  useEffect(() => {
    if (newExam.departement) {
      const fetchOptions = async () => {
        try {
          const optionsData = await getOptionsByDepartement(newExam.departement.id);
          setOptions(optionsData);
        } catch (error) {
          console.error("Erreur lors du chargement des options :", error);
        }
      };
      fetchOptions();
    } else {
      setOptions([]);
    }
  }, [newExam.departement]);
  
  
  useEffect(() => {
    const fetchModules = async () => {
      if (!newExam.option) {
        console.log("No option selected, skipping module fetch");
        return;
      }
      
      console.log("Starting to fetch modules for option:", newExam.option);
      setModuleLoading(true);
      try {
        const response = await getModulesByOptionId(newExam.option.id);
        console.log("Modules fetch successful:", response);
        setModules(response);
      } catch (error) {
        console.error("Module fetch error:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status
        });
        setModules([]);
      } finally {
        setModuleLoading(false);
      }
    };
  
    fetchModules();
  }, [newExam.option]);

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
      module: null,
      enseignant: null,
      option: null,
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
        newExam.locaux.length === 0 ||
        !newExam.option ||
        !newExam.module
      ) {
        return;
      }
      if (editingExam) {
        const updatedExam = {
          ...editingExam,
          enseignant: { id: newExam.enseignant.id },
          locaux: newExam.locaux.map((local) => ({ id: local.id })),
          departement: { id: newExam.departement.id },
          option: { id: newExam.option.id }, 
          moduleExamen: { id: newExam.module.id }, 
          nbEtudiants: parseInt(newExam.nbEtudiants),
        };
        await ExamService.updateExam(editingExam.id, updatedExam);
      } else {
        const examData = {
          enseignant: { id: newExam.enseignant.id },
          locaux: newExam.locaux.map((local) => ({ id: local.id })),
          departement: { id: newExam.departement.id },
          option: { id: newExam.option.id }, 
          moduleExamen: { id: newExam.module.id }, 
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
      option: exam.option,
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
            onClick={async () => {setShowAddExamDialog(true)
              console.log(state.selectedCell?.date,state.selectedCell?.horaire)
              const locauxData = await getLocaDispo(state.selectedCell?.date,state.selectedCell?.horaire);
              setLocaux(locauxData);

            }
            }
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
                    <div className="flex align-items-center">
                      <i className="pi pi-book mr-2"></i>
                      <span>{rowData.moduleExamen?.nom || 'Non défini'}</span> {/* Changé de rowData.module à rowData.moduleExamen */}
                    </div>
                  )}
               />
               <Column
                  header="Option"
                  body={(rowData) => (
                    <div className="flex align-items-center">
                      <i className="pi pi-book mr-2"></i>
                      <span>{rowData.option?.nom || 'Non défini'}</span> {/* Changé de rowData.module à rowData.moduleExamen */}
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
  <>

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
          onChange={(e) => setNewExam({ ...newExam, enseignant: e.value })}
          optionLabel="nom"
          placeholder="Sélectionner un enseignant"
          className="w-full p-inputtext-lg"
        />
      </div>
    </div>


    <div className="col-12 field">
          <label className="flex align-items-center gap-3 mb-2">
            <span className="text-xl font-bold">Option</span>
          </label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-tag text-primary text-lg" />
            </span>
            {/* Champ Option */}
          <Dropdown
            value={newExam.option}
            options={options}
            onChange={(e) => {
              console.log("Selected option FULL OBJECT:", e.value); // Log complet de l'objet
              console.log("Option ID:", e.value?.id); // Vérifie si l'ID existe
              setNewExam({ 
                ...newExam, 
                option: e.value,
                module: null 
              });
            }}
            optionLabel="nom"
            placeholder="Sélectionner une option"
            className="w-full p-inputtext-lg"
          />
          </div>
        </div>

        {/* Champ Module */}
        {newExam.option && (
          <div className="col-12 field">
            <label className="flex align-items-center gap-3 mb-2">
              <span className="text-xl font-bold">Module</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-book text-primary text-lg" />
              </span>
              <Dropdown
                value={newExam.module}
                options={modules}
                onChange={(e) => {
                  console.log("Module sélectionné:", e.value); // Ajoutez ce log
                  setNewExam({ ...newExam, module: e.value });
                }}
                optionLabel="nom"
                placeholder={moduleLoading ? "Chargement des modules..." : "Sélectionner un module"}
                className="w-full p-inputtext-lg"
                disabled={moduleLoading}
              />
            </div>
          </div>
        )}

  </>
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
                onChange={(e) =>{
                  setNewExam({ ...newExam, nbEtudiants: e.target.value })
                  setAutoLocal(false)
                }
                }
                className="p-inputtext-lg"
                placeholder="Entrez le nombre d'étudiants"
              />
            </div>
          </div>

          <div className="local-selection-container p-4">
  <div className="header-section mb-4">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">
      Locaux
    </h3>
    
    <div className="auto-select-wrapper flex items-center p-3 bg-gray-50 rounded-lg">
      <div className="custom-checkbox">
        <Checkbox
          inputId="autoSelectLocaux"
          checked={autolocal}
          onChange={(e) => {
            if (e.checked) {
              const locauxAttribues = attribuerLocaux(newExam.nbEtudiants, locaux);
              setNewExam({ ...newExam, locaux: locauxAttribues.locauxSelectionnes })
              setAutoLocal(e.checked);
            } else {
              setNewExam({ ...newExam, locaux: null })
              setAutoLocal(e.checked);
            }
          }}
          className="custom-checkbox-input"
        />
        <label 
          htmlFor="autoSelectLocaux" 
          className="custom-checkbox-label ml-3 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
        >
          Sélection automatique des locaux
        </label>
      </div>
    </div>
  </div>

  <div className="select-section mt-4">
  <MultiSelect
  value={newExam.locaux}
  options={locaux}
  filter
  onChange={(e) => {
    setNewExam({ ...newExam, locaux: e.value });
  }}
  optionLabel="nom"
  placeholder="Sélectionner un ou plusieurs locaux"
  className={`custom-multiselect ${autolocal ? 'disabled' : ''}`}
  display="chip"
  disabled={autolocal}
  itemTemplate={(option) => (
    <div className="flex align-items-center">
      <span>{option.nom}</span>
      <span className="ml-2 text-gray-500">({option.capacite} places)</span>
    </div>
  )}
  chipTemplate={(option) => (
    <div className="flex align-items-center">
      <span>{option.nom}</span>
      <span className="ml-2 text-gray-500">({option.capacite} places)</span>
    </div>
  )}
/>

  </div>
</div>
<style jsx>{`
  .local-selection-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .custom-checkbox {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
  }

  .custom-checkbox-input:checked {
    background-color: #4F46E5;
    border-color: #4F46E5;
  }

  .custom-checkbox-input {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .custom-checkbox-label {
    font-size: 0.95rem;
    user-select: none;
  }

  .custom-multiselect {
    width: 100%;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    transition: all 0.2s ease;
  }

  .custom-multiselect:not(.disabled):hover {
    border-color: #4F46E5;
  }

  .custom-multiselect.disabled {
    background-color: #F3F4F6;
    opacity: 0.7;
  }

  .custom-multiselect .p-multiselect-token {
    background-color: #EEF2FF;
    color: #4F46E5;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
  }

  .auto-select-wrapper {
    transition: background-color 0.2s ease;
  }

  .auto-select-wrapper:hover {
    background-color: #EEF2FF;
  }
`}</style>
  </div>
</Dialog>
    </div>
  );
};
const attribuerLocaux = (nbEtudiants, locaux) => {
  // Trier les locaux par capacité (du plus petit au plus grand)
  const locauxTries = [...locaux].sort((a, b) => a.capacite - b.capacite);
  let meilleureAttribution = null;
  let meilleurGaspillage = Infinity;
  
  // Fonction pour calculer le gaspillage (différence entre capacité utilisée et nécessaire)
  const calculerGaspillage = (attribution) => {
      return attribution.reduce((total, attr) => {
          const local = locauxTries.find(l => l.nom === attr.salle);
          return total + (local.capacite - attr.nombreEtudiants);
      }, 0);
  };
  
  // Essayer toutes les combinaisons possibles de salles
  const essayerCombinaisons = (etudiantsRestants, sallesDisponibles, attributionActuelle) => {
      // Si on a placé tous les étudiants, vérifier si c'est la meilleure solution
      if (etudiantsRestants === 0) {
          const gaspillage = calculerGaspillage(attributionActuelle);
          if (gaspillage < meilleurGaspillage) {
              meilleurGaspillage = gaspillage;
              meilleureAttribution = [...attributionActuelle];
          }
          return;
      }
      
      // Essayer chaque salle disponible
      for (let i = 0; i < sallesDisponibles.length && etudiantsRestants > 0; i++) {
          const salle = sallesDisponibles[i];
          if (salle.capacite >= etudiantsRestants) {
              // On peut mettre tous les étudiants restants dans cette salle
              essayerCombinaisons(0, 
                  sallesDisponibles.slice(i + 1),
                  [...attributionActuelle, {salle: salle.nom, nombreEtudiants: etudiantsRestants}]);
          } else {
              // Utiliser la salle au maximum de sa capacité
              essayerCombinaisons(etudiantsRestants - salle.capacite,
                  sallesDisponibles.slice(i + 1),
                  [...attributionActuelle, {salle: salle.nom, nombreEtudiants: salle.capacite}]);
          }
      }
  };
  
  // Commencer la recherche de solutions
  essayerCombinaisons(nbEtudiants, locauxTries, []);
  
  // Format de retour simplifié
  if (!meilleureAttribution) {
      return {
          reussi: false,
          locauxSelectionnes: []
      };
  }
  
  // Transformer l'attribution en liste de locaux avec leurs détails
  const locauxSelectionnes = meilleureAttribution.map(attr => {
      const localOriginal = locaux.find(l => l.nom === attr.salle);
      return {
          ...localOriginal,
          nombreEtudiants: attr.nombreEtudiants
      };
  });

  return {
      reussi: true,
      locauxSelectionnes
  };
};



export default ExamTable;
