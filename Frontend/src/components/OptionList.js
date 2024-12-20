import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import {
  getOptions,
  deleteOption,
  updateOption,
  addOption
} from '../services/optionService';
import {getDepartements} from '../services/departementService'
import './OptionList.css';

const OptionList = () => {
  const [options, setOptions] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentOption, setCurrentOption] = useState({
    nom: '',
    departement: null,
  });

  useEffect(() => {
    loadOptions();
    loadDepartements();
  }, []);

  const loadOptions = () => {
    setLoading(true);
    getOptions()
      .then((response) => {
        setOptions(response);
      })
      .catch((error) => console.error('Error fetching options', error))
      .finally(() => setLoading(false));
  };

  const loadDepartements = () => {
    getDepartements()
      .then((response) => {
        setDepartements(response);
      })
      .catch((error) => console.error('Error fetching departements', error));
  };

  const handleOpenModal = async (mode, option = null) => {
    console.log('Option à modifier:', option);
    console.log('Départements disponibles:', departements);

    if (departements.length === 0) {
      await loadDepartements();
    }

    setModalMode(mode);

    if (mode === 'edit' && option) {
      const selectedDepartement = departements.find(
        (d) => d.nom === option.departementNom
      );

      console.log('Département sélectionné:', selectedDepartement);
      console.log('Option complète avant mise à jour:', {
        id: option.id,
        nom: option.nom,
        departement: selectedDepartement,
      });

      setCurrentOption({
        id: option.id,
        nom: option.nom,
        departement: selectedDepartement || null,
      });
    } else {
      setCurrentOption({
        nom: '',
        departement: null,
      });
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentOption({
      nom: '',
      departement: null,
    });
  };

 const handleSubmit = async () => {
   if (!currentOption || !currentOption.nom || !currentOption.departement) {
     console.error("Le nom de l'option ou le département est manquant");
     return;
   }

   try {
     if (modalMode === 'add') {
       const optionToAdd = {
         nom: currentOption.nom,
         departement: {
           id: currentOption.departement.id,
         },
       };

       console.log("option de add-------------->",optionToAdd);

       await addOption(optionToAdd);
     } else {
       const optionToUpdate = {
         id: currentOption.id,
         nom: currentOption.nom,
         departement: {
           id: currentOption.departement.id,
         },
       };
       console.log('option de update-------------->', optionToUpdate);


       const response = await updateOption(currentOption.id, optionToUpdate);
       console.log('Mise à jour réussie:', response);
     }

     // Recharger la liste des options
     await loadOptions();
     handleCloseModal();
   } catch (error) {
     console.error("Erreur lors de l'opération:", error);
   }
 };

  const handleDelete = (id) => {
    deleteOption(id)
      .then(() => {
        loadOptions();
      })
      .catch((error) => console.error('Error deleting option', error));
  };

  const isFormValid = () => {
    if (modalMode === 'add') {
      return !!(currentOption.nom && currentOption.departement);
    }
    // Pour le mode 'edit'
    return !!(
      currentOption.id &&
      currentOption.nom &&
      currentOption.departement
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="p-button-warning"
          onClick={() => handleOpenModal('edit', rowData)}
          tooltip="Modifier"
          tooltipOptions={{ position: 'top' }}
          style={{ margin: '0 0.1rem' }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Supprimer"
          tooltipOptions={{ position: 'top' }}
          style={{ margin: '0 0.1rem' }}
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div>
        <div
          className="flex justify-content-between align-items-center"
          style={{ padding: '0 0.5rem' }}
        >
          <h2 className="m-0">Liste des Options</h2>
        </div>
        <div
          className="flex align-items-center mt-3"
          style={{ position: 'relative' }}
        >
          <span className="p-input-icon-left">
            <i className="pi pi-search" style={{ left: '0.75rem' }} />
            <InputText
              value={globalFilterValue}
              onChange={(e) => setGlobalFilterValue(e.target.value)}
              placeholder="Rechercher..."
              style={{ paddingLeft: '2.5rem' }}
              className="p-inputtext-lg"
            />
          </span>
          <Button
            label="Ajouter une Option"
            icon="pi pi-plus"
            severity="success"
            className="p-button-raised flex align-items-center gap-2"
            style={{ position: 'absolute', right: '0' }}
            onClick={() => handleOpenModal('add')}
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
        label={modalMode === 'add' ? 'Ajouter' : 'Modifier'}
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
        backgroundImage: 'url(/ensajbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <div className="data-table-container">
        <div style={{ width: '80%' }}>
          <DataTable
            value={options}
            paginator
            rows={5}
            dataKey="id"
            loading={loading}
            globalFilter={globalFilterValue}
            header={renderHeader()}
            emptyMessage="Aucune option trouvée."
            rowsPerPageOptions={[5, 10, 25]}
            removableSort
            showGridlines
            stripedRows
            sortMode="multiple"
            globalFilterFields={['id', 'nom', 'departementNom']}
          >
            <Column
              field="id"
              header="ID"
              sortable
              style={{ minWidth: '5rem' }}
            />
            <Column
              field="nom"
              header="Nom"
              sortable
              style={{ minWidth: '10rem' }}
            />
            <Column
              field="departementNom"
              header="Département"
              sortable
              style={{ minWidth: '10rem' }}
            />
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ minWidth: '10rem', textAlign: 'center' }}
            />
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={openModal}
        style={{ width: '550px' }}
        header={
          <div className="flex align-items-center gap-3">
            <i
              className="pi pi-building text-primary text-3xl"
              style={{ fontSize: '20px' }}
            />
            <span
              className="text-2xl font-bold"
              style={{ marginLeft: '0.8rem' }}
            >
              {modalMode === 'add' ? 'Ajouter une option' : "Modifier l'option"}
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
          <div className="col-12" style={{ marginBottom: '1rem' }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span
                className="text-xl font-bold"
                style={{ fontWeight: 'bold' }}
              >
                Nom
              </span>
            </label>
            <div className="p-inputgroup" style={{ marginTop: '0.6rem' }}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-pencil text-primary text-lg" />
              </span>
              <InputText
                value={currentOption.nom}
                onChange={(e) =>
                  setCurrentOption({ ...currentOption, nom: e.target.value })
                }
                className="p-inputtext-lg"
              />
            </div>
          </div>

          {/* Département */}
          <div className="col-12" style={{ marginBottom: '1rem' }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span
                className="text-xl font-bold"
                style={{ fontWeight: 'bold' }}
              >
                Département
              </span>
            </label>
            <div className="p-inputgroup" style={{ marginTop: '0.6rem' }}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-list text-primary text-lg" />
              </span>
              <Dropdown
                value={currentOption.departement}
                options={departements}
                onChange={(e) =>
                  setCurrentOption({ ...currentOption, departement: e.value })
                }
                optionLabel="nom"
                placeholder="Sélectionner un département"
                className="p-dropdown-lg"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default OptionList;
