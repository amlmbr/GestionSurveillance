import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { JourFerieService } from '../services/JourFerieService';

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentHoliday, setCurrentHoliday] = useState({
    titre: '',
    date: null,
  });

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      const data = await JourFerieService.getAllJoursFeries();
      setHolidays(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading holidays:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, holiday = null) => {
    setModalMode(mode);
    setCurrentHoliday(holiday || { titre: '', date: null });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentHoliday({ titre: '', date: null });
  };

 const handleSubmit = async () => {
   try {
     // Créer une nouvelle date en ajustant le fuseau horaire
     const adjustedDate = new Date(currentHoliday.date);
     adjustedDate.setHours(12, 0, 0, 0); // Définir à midi pour éviter les problèmes de fuseau horaire

     if (modalMode === 'add') {
       await JourFerieService.createJourFerie({
         ...currentHoliday,
         date: adjustedDate.toISOString().split('T')[0],
       });
     } else {
       await JourFerieService.updateJourFerie(currentHoliday.id, {
         ...currentHoliday,
         date: adjustedDate.toISOString().split('T')[0],
       });
     }
     loadHolidays();
     handleCloseModal();
   } catch (error) {
     console.error('Error saving holiday:', error);
   }
 };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jour férié ?')) {
      try {
        await JourFerieService.deleteJourFerie(id);
        loadHolidays();
      } catch (error) {
        console.error('Error deleting holiday:', error);
      }
    }
  };

  const dateBodyTemplate = (rowData) => {
    const date = new Date(rowData.date);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusBodyTemplate = (rowData) => {
    const today = new Date();
    const holidayDate = new Date(rowData.date);
    const isPast = holidayDate < today;

    return (
      <Tag
        severity={isPast ? 'danger' : 'success'}
        value={isPast ? 'Passé' : 'À venir'}
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
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
          tooltip="Supprimer"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div>
        <div className="flex justify-content-between align-items-center">
          <h2 className="m-0">Gestion des Jours Fériés</h2>
        </div>
        <div className="flex justify-content-between align-items-center mt-3">
          <span className="p-input-icon-left" style={{ flex: 1 }}>
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={(e) => setGlobalFilterValue(e.target.value)}
              placeholder="Rechercher..."
              className="p-inputtext-lg w-full"
            />
          </span>
          <Button
            label="Ajouter un Jour Férié"
            icon="pi pi-plus"
            severity="success"
            className="p-button-raised ml-3"
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
        padding: '2rem',
      }}
    >
      <div
        className="flex justify-content-center"
        style={{ marginTop: '100px' }}
      >
        <Card className="w-10 md:w-8 lg:w-7" style={{ minWidth: '800px' }}>
          <DataTable
            value={holidays}
            paginator
            rows={5}
            dataKey="id"
            loading={loading}
            globalFilter={globalFilterValue}
            header={renderHeader()}
            emptyMessage="Aucun jour férié trouvé."
            rowsPerPageOptions={[5, 10, 25]}
            removableSort
            showGridlines
            stripedRows
          >
            <Column
              field="titre"
              header="Titre"
              sortable
              style={{ minWidth: '14rem' }}
            />
            <Column
              field="date"
              header="Date"
              sortable
              body={dateBodyTemplate}
              style={{ minWidth: '14rem' }}
            />
            <Column
              field="status"
              header="Statut"
              body={statusBodyTemplate}
              sortable
              style={{ minWidth: '10rem' }}
            />
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ minWidth: '10rem', textAlign: 'center' }}
            />
          </DataTable>
        </Card>
      </div>

      <Dialog
        visible={openModal}
        style={{ width: '450px' }}
        header={
          <div className="flex align-items-center gap-3">
            <i className="pi pi-calendar text-primary text-3xl" />
            <span className="text-2xl font-bold">
              {modalMode === 'add'
                ? 'Ajouter un jour férié'
                : 'Modifier le jour férié'}
            </span>
          </div>
        }
        modal
        className="p-fluid"
        footer={footer}
        onHide={handleCloseModal}
      >
        <div className="grid p-4 gap-4">
          <div className="col-12">
            <label className="flex align-items-center gap-3 mb-2">
              <span className="text-xl font-bold">Titre</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-tag text-primary text-lg" />
              </span>
              <InputText
                value={currentHoliday.titre}
                onChange={(e) =>
                  setCurrentHoliday({
                    ...currentHoliday,
                    titre: e.target.value,
                  })
                }
                placeholder="Nom du jour férié"
                className="p-inputtext-lg"
              />
            </div>
          </div>

          <div className="col-12">
            <label className="flex align-items-center gap-3 mb-2">
              <span className="text-xl font-bold">Date</span>
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar text-primary text-lg" />
              </span>
              <Calendar
                value={
                  currentHoliday.date ? new Date(currentHoliday.date) : null
                }
                onChange={(e) =>
                  setCurrentHoliday({
                    ...currentHoliday,
                    date: e.value,
                  })
                }
                dateFormat="dd/mm/yy"
                showIcon
                className="p-calendar-lg"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HolidayList;
