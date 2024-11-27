import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import {
  getLocaux,
  deleteLocal,
  updateLocal,
  addLocal,
} from '../services/locauxService';
import '../services/locauxService';
import './LocalList.css';  // Ajoutez cette ligne


const LocalList = () => {
  const [locaux, setLocaux] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentLocal, setCurrentLocal] = useState({
    nom: '',
    capacite: 0,
    type: '',
    nbSurveillants: 0,
    estDisponible: false,
  });

  const typeOptions = [
    { label: 'Amphithéâtre', value: 'Amphithéâtre' },
    { label: 'Salle', value: 'Salle' },
  ];

  useEffect(() => {
    loadLocaux();
  }, []);

 const loadLocaux = () => {
   console.log('Loading locaux...');
   setLoading(true);
   getLocaux()
     .then((response) => {
       console.log('Full API response:', response); 
       console.log('Locaux data:', response); 
       setLocaux(response);
     })
     .catch((error) => console.error('Error fetching locaux', error))
     .finally(() => setLoading(false));
 };


  const handleOpenModal = (mode, local = null) => {
    console.log('Opening modal in', mode, 'mode with local:', local);
    setModalMode(mode);
    setCurrentLocal(
      local || {
        nom: '',
        capacite: 0,
        type: '',
        nbSurveillants: 0,
        estDisponible: false,
      }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setOpenModal(false);
     setCurrentLocal({
       nom: '',
       capacite: 0,
       type: '',
       nbSurveillants: 0,
       estDisponible: false,
     });
  };

 const handleSubmit = () => {
   if (!currentLocal || !currentLocal.nom) {
     console.error('Le nom du local est manquant');
     return;
   }

   if (modalMode === 'add') {
     addLocal(currentLocal)
       .then(() => {
         loadLocaux();
         handleCloseModal();
       })
       .catch((error) => console.error('Error adding local', error));
   } else {
     updateLocal(currentLocal.id, { ...currentLocal })
       .then(() => {
         loadLocaux();
         handleCloseModal();
       })
       .catch((error) => console.error('Error updating local', error));
   }
 };

  const handleDelete = (id) => {
    console.log('Deleting local with ID:', id); // Vérifier l'ID du local supprimé
    deleteLocal(id)
      .then(() => {
        console.log('Local deleted');
        loadLocaux();
      })
      .catch((error) => console.error('Error deleting local', error));
  };

  const disponibiliteBodyTemplate = (rowData) => {
    return (
      <Tag
        severity={rowData.estDisponible ? 'success' : 'danger'}
        value={rowData.estDisponible ? 'Disponible' : 'Non disponible'}
      />
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
          <h2 className="m-0">Liste des Locaux</h2>
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
            label="Ajouter un Local"
            icon="pi pi-plus"
            severity="success"
            className="p-button-raised flex align-items-center gap-2"
            style={{ position: 'absolute', right: '0' }}
            onClick={() => handleOpenModal('add')}
          >
          </Button>
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
        autoFocus
      />
    </div>
  );

  return (
    <div style={{
      backgroundImage: 'url(/ensajbg.png)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative'
   }}>
    <div className="data-table-container">
    <div style={{ width: '80%' }}> 
      <DataTable
        value={locaux}
        paginator
        rows={5}
        dataKey="id"
        loading={loading}
        globalFilter={globalFilterValue}
        header={renderHeader()}
        emptyMessage="Aucun local trouvé."
        rowsPerPageOptions={[5, 10, 25]}
        removableSort
        showGridlines
        stripedRows
        sortMode="multiple"
        globalFilterFields={['id', 'nom', 'type', 'capacite']}
      >
        <Column field="id" header="ID" sortable style={{ minWidth: '5rem' }} />
        <Column
          field="nom"
          header="Nom"
          sortable
          style={{ minWidth: '10rem' }}
        />
        <Column
          field="capacite"
          header="Capacité"
          sortable
          style={{ minWidth: '8rem' }}
        />
        <Column
          field="type"
          header="Type"
          sortable
          style={{ minWidth: '10rem' }}
        />
        <Column
          field="nbSurveillants"
          header="Nb Surveillants"
          sortable
          style={{ minWidth: '10rem' }}
        />
        <Column
          field="estDisponible"
          header="Disponibilité"
          body={disponibiliteBodyTemplate}
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
            <i className="pi pi-building text-primary text-3xl" style={{ fontSize : '20px' }} />
            <span className="text-2xl font-bold" style={{ marginLeft: '0.8rem' }} >
              {modalMode === 'add' ? 'Ajouter un local' : 'Modifier le local'}
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
                value={currentLocal.nom}
                onChange={(e) =>
                  setCurrentLocal({ ...currentLocal, nom: e.target.value })
                }
                className="p-inputtext-lg"
              />
            </div>
          </div>

          {/* Capacité */}
          <div className="col-12 " style={{ marginBottom: '1rem' }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span
                className="text-xl font-bold"
                style={{ fontWeight: 'bold' }}
              >
                Capacité
              </span>
            </label>
            <div className="p-inputgroup" style={{ marginTop: '0.6rem' }}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-hashtag text-primary text-lg" />
              </span>
              <InputNumber
                value={currentLocal.capacite}
                onValueChange={(e) =>
                  setCurrentLocal({ ...currentLocal, capacite: e.value })
                }
                showButtons
                min={0}
                max={100}
                className="p-inputnumber-lg"
              />
            </div>
          </div>

          {/* Type */}
          <div className="col-12 " style={{ marginBottom: '1rem' }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span
                className="text-xl font-bold"
                style={{ fontWeight: 'bold' }}
              >
                Type
              </span>
            </label>
            <div className="p-inputgroup" style={{ marginTop: '0.6rem' }}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-list text-primary text-lg" />
              </span>
              <Dropdown
                value={currentLocal.type}
                options={typeOptions}
                onChange={(e) =>
                  setCurrentLocal({ ...currentLocal, type: e.value })
                }
                optionLabel="label"
                placeholder="Sélectionner un type"
                className="p-dropdown-lg"
              />
            </div>
          </div>

          {/* Nb Surveillants */}
          <div className="col-12 " style={{ marginBottom: '1rem' }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span className="text-xl font-bold">Nb Surveillants</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-users text-primary text-lg" />
              </span>
              <InputNumber
                value={currentLocal.nbSurveillants}
                onValueChange={(e) =>
                  setCurrentLocal({ ...currentLocal, nbSurveillants: e.value })
                }
                showButtons
                min={0}
                max={20}
                className="p-inputnumber-lg"
              />
            </div>
          </div>

          {/* Disponible */}
          <div className="col-12" style={{ marginBottom: '1rem' }}>
            <label className="flex align-items-center gap-3 mb-4">
              <span className="text-xl font-bold">Disponibilité</span>
            </label>
            <div
              className="flex align-items-center gap-3 p-3 border-1 border-round"
              style={{ marginTop: '0.6rem' }}
            >
              <Checkbox
                checked={currentLocal.estDisponible}
                onChange={(e) =>
                  setCurrentLocal({ ...currentLocal, estDisponible: e.checked })
                }
              />
              <span className="text-lg">
                {currentLocal.estDisponible ? 'Disponible' : 'Non disponible'}
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LocalList;
