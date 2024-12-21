import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import {
  getModules,
  deleteModule,
  updateModule,
  addModule,
} from "../services/moduleService";
import { getEnseignants } from "../services/enseignantService";
import { getOptions } from "../services/optionService";
import "./ModuleList.css";

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentModule, setCurrentModule] = useState({
    nom: "",
    responsable: null,
    option: null,
  });
  const [enseignants, setEnseignants] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    loadModules();
    loadEnseignants();
    loadOptions();
  }, []);

  const loadModules = () => {
    setLoading(true);
    getModules()
      .then((response) => {
        console.log("Liste des modules:", response); // Ajout du log
        setModules(response);
      })
      .catch((error) => console.error("Error fetching modules", error))
      .finally(() => setLoading(false));
  };

  const loadEnseignants = () => {
    getEnseignants()
      .then((response) => {
        setEnseignants(response);
      })
      .catch((error) => console.error("Error fetching enseignants", error));
  };

  const loadOptions = () => {
    getOptions()
      .then((response) => {
        setOptions(response);
      })
      .catch((error) => console.error("Error fetching options", error));
  };

  const handleOpenModal = async (mode, module = null) => {
    console.log("Module à modifier:", module);

    // S'assurer que les listes sont chargées
    if (enseignants.length === 0) {
      await loadEnseignants();
    }
    if (options.length === 0) {
      await loadOptions();
    }

    setModalMode(mode);

    if (mode === "edit" && module) {
      console.log("Liste des enseignants:", enseignants);
      console.log("Liste des options:", options);

      // Trouver l'enseignant correspondant
      const selectedResponsable = enseignants.find(
        (e) => e.nom.trim() === module.responsableNom.trim()
      );

      // Trouver l'option correspondante
      const selectedOption = options.find(
        (o) => o.nom.trim() === module.optionNom.trim()
      );

      console.log("Responsable trouvé:", selectedResponsable);
      console.log("Option trouvée:", selectedOption);

      setCurrentModule({
        id: module.id,
        nom: module.nom,
        responsable: selectedResponsable || null,
        option: selectedOption || null,
      });
    } else {
      setCurrentModule({
        nom: "",
        responsable: null,
        option: null,
      });
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentModule({
      nom: "",
      responsable: null,
      option: null,
    });
  };

  const isFormValid = () => {
    if (modalMode === "add") {
      return !!(
        currentModule.nom &&
        currentModule.responsable &&
        currentModule.option
      );
    }
    return !!(
      currentModule.id &&
      currentModule.nom &&
      currentModule.responsable &&
      currentModule.option
    );
  };

  const handleSubmit = () => {
    if (!currentModule || !currentModule.nom) {
      console.error("Le nom du module est manquant");
      return;
    }

    if (modalMode === "add") {
      console.log("le module a ajouter est ", currentModule);
      addModule(currentModule)
        .then(() => {
          loadModules();
          handleCloseModal();
        })
        .catch((error) => console.error("Error adding module", error));
    } else {
      updateModule(currentModule.id, { ...currentModule })
        .then(() => {
          loadModules();
          handleCloseModal();
        })
        .catch((error) => console.error("Error updating module", error));
    }
  };

  const handleDelete = (id) => {
    deleteModule(id)
      .then(() => {
        loadModules();
      })
      .catch((error) => console.error("Error deleting module", error));
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="p-button-warning"
          onClick={() => handleOpenModal("edit", rowData)}
          tooltip="Modifier"
          tooltipOptions={{ position: "top" }}
          style={{ margin: "0 0.1rem" }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Supprimer"
          tooltipOptions={{ position: "top" }}
          style={{ margin: "0 0.1rem" }}
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div>
        <div
          className="flex justify-content-between align-items-center"
          style={{ padding: "0 0.5rem" }}
        >
          <h2 className="m-0">Liste des Modules</h2>
        </div>
        <div
          className="flex align-items-center mt-3"
          style={{ position: "relative" }}
        >
          <span className="p-input-icon-left">
            <i className="pi pi-search" style={{ left: "0.75rem" }} />
            <InputText
              value={globalFilterValue}
              onChange={(e) => setGlobalFilterValue(e.target.value)}
              placeholder="Rechercher..."
              style={{ paddingLeft: "2.5rem" }}
              className="p-inputtext-lg"
            />
          </span>
          <Button
            label="Ajouter un Module"
            icon="pi pi-plus"
            severity="success"
            className="p-button-raised flex align-items-center gap-2"
            style={{ position: "absolute", right: "0" }}
            onClick={() => handleOpenModal("add")}
          />
        </div>
      </div>
    );
  };

  const footer = (
    <div>
      <Button
        label="Annuler"
        icon="pi pi-times"
        onClick={handleCloseModal}
        className="p-button-text"
      />
      <Button
        label={modalMode === "add" ? "Ajouter" : "Modifier"}
        icon="pi pi-check"
        onClick={handleSubmit}
        disabled={!isFormValid()}
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
        position: "relative",
      }}
    >
      <div className="data-table-container">
        <div style={{ width: "80%" }}>
          <DataTable
            value={modules}
            paginator
            rows={5}
            dataKey="id"
            loading={loading}
            globalFilter={globalFilterValue}
            header={renderHeader()}
            emptyMessage="Aucun module trouvé."
            rowsPerPageOptions={[5, 10, 25]}
            removableSort
            showGridlines
            stripedRows
            sortMode="multiple"
            globalFilterFields={["id", "nom", "responsableNom", "optionNom"]}
          >
            <Column
              field="id"
              header="ID"
              sortable
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="nom"
              header="Nom"
              sortable
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="responsableNom"
              header="Responsable"
              sortable
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="optionNom"
              header="Option"
              sortable
              style={{ minWidth: "10rem" }}
            />
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ minWidth: "10rem", textAlign: "center" }}
            />
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={openModal}
        style={{ width: "550px" }}
        header={
          <div className="flex align-items-center gap-3">
            <i
              className="pi pi-building text-primary text-3xl"
              style={{ fontSize: "20px" }}
            />
            <span
              className="text-2xl font-bold"
              style={{ marginLeft: "0.8rem" }}
            >
              {modalMode === "add" ? "Ajouter un module" : "Modifier le module"}
            </span>
          </div>
        }
        modal
        className="p-fluid"
        footer={footer}
        onHide={handleCloseModal}
      >
        <div className="grid p-4 gap-6">
          {/* Nom */}
          <div className="col-12" style={{ marginBottom: "1rem" }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span
                className="text-xl font-bold"
                style={{ fontWeight: "bold" }}
              >
                Nom
              </span>
            </label>
            <div className="p-inputgroup" style={{ marginTop: "0.6rem" }}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-pencil text-primary text-lg" />
              </span>
              <InputText
                value={currentModule.nom}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, nom: e.target.value })
                }
                className="p-inputtext-lg"
              />
            </div>
          </div>

          {/* Responsable */}
          <div className="col-12 " style={{ marginBottom: "1rem" }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span
                className="text-xl font-bold"
                style={{ fontWeight: "bold" }}
              >
                Responsable
              </span>
            </label>
            <div className="p-inputgroup" style={{ marginTop: "0.6rem" }}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-user text-primary text-lg" />
              </span>
              <Dropdown
                value={currentModule.responsable}
                options={enseignants}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, responsable: e.value })
                }
                optionLabel="nom"
                placeholder="Sélectionner un responsable"
                className="p-dropdown-lg"
              />
            </div>
          </div>

          {/* Option */}
          <div className="col-12 " style={{ marginBottom: "1rem" }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span
                className="text-xl font-bold"
                style={{ fontWeight: "bold" }}
              >
                Option
              </span>
            </label>
            <div className="p-inputgroup" style={{ marginTop: "0.6rem" }}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-list text-primary text-lg" />
              </span>
              <Dropdown
                value={currentModule.option}
                options={options}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, option: e.value })
                }
                optionLabel="nom"
                placeholder="Sélectionner une option"
                className="p-dropdown-lg"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ModuleList;
