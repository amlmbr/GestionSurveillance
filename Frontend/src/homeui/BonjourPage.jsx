import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'; // Import du Dialog
import { Dropdown } from 'primereact/dropdown'; // Import pour le dropdown
import { Calendar } from 'primereact/calendar'; // Ajout de l'import Calendar
import SessionService from '../services/SessionService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexte/SessionContext'; 
import './BonjourPage.css'; // Import du fichier CSS

const BonjourPage = () => {
  const url = new URL(window.location.href);

// Utiliser URLSearchParams pour extraire les paramètres de l'URL
const params = new URLSearchParams(url.search);

// Récupérer la valeur du paramètre 'access_token'
const accessToken = params.get('access_token');

if("acces ",accessToken)
  localStorage.setItem('access_token', accessToken);
  const navigate = useNavigate(); // Hook pour la navigation
  const { setSessionId } = useSession();
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await SessionService.getSessions();
        setSessions(data);
        setLoading(false);
      } catch (error) {
        alert('Error fetching sessions:', error);
      }
    };
  
    fetchSessions();
  }, []);
  const [sessions, setSessions] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogtitle,setDialogTitle]=useState("Ajouter")
  const [visible, setVisible] = useState(false); // État pour contrôler la visibilité du modal
  const [selectedType, setSelectedType] = useState(null);
  const [dates, setDates] = useState(null);
  const [sessionupdate, setSessionUpdate] = useState(); 
  const [formattedDates, setFormattedDates] = useState(null); // Nouvel état pour les dates formatées
  const [timeSlots, setTimeSlots] = useState([
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' }
]);
const handleTimeChange = (index, field, value) => {
  const newTimeSlots = [...timeSlots];
  newTimeSlots[index][field] = value;
  setTimeSlots(newTimeSlots);
};


  
  const sessionTypes = [
    { label: 'Normale Hiver', value: 'NORMALE_HIVER' },
    { label: 'Normale Printemps', value: 'NORMALE_PRINTEMPS' },
    { label: 'Rattrapage Hiver', value: 'RATTRAPAGE_HIVER' },
    { label: 'Rattrapage Printemps', value: 'RATTRAPAGE_PRINTEMPS' }
  ];


  const formatDate = (value) => {
    return new Date(value).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const dateBodyTemplate = (rowData, field) => {
    return formatDate(rowData[field]);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="p-button-warning"
          onClick={() => handleEdit(rowData)}
          tooltip="Modifier"
          tooltipOptions={{ position: 'top' }}
          style={{ margin: '0 0.1rem' }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDelete(rowData)}
          tooltip="Supprimer"
          tooltipOptions={{ position: 'top' }}
          style={{ margin: '0 0.1rem' }}
        />
         <Button
        icon={rowData.confirmed ? "pi pi-times-circle" : "pi pi-check-circle"}
        rounded
        outlined
        severity={rowData.confirmed ? "warning" : "success"}
        onClick={() => handleConfirm(rowData)}
        tooltip={rowData.confirmed ? "Annuler la confirmation" : "Confirmer"}
        tooltipOptions={{ position: 'top' }}
        style={{ margin: '0 0.1rem' }}
      />
       
      </div>
    );
  };
  const handleConfirm = (session) => {
    const action = session.confirmed ? 'annuler la confirmation de' : 'confirmer';
    
    Swal.fire({
      title: `${session.confirmed ? 'Annuler la confirmation' : 'Confirmer'} la session`,
      text: `Voulez-vous ${action} cette session ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Oui, ${action}!`,
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await SessionService.confirmSession(session.id);
          Swal.fire(
            session.confirmed ? 'Confirmation annulée!' : 'Confirmée!',
            `La session a été ${session.confirmed ? 'annulée' : 'confirmée'} avec succès.`,
            'success'
          );
          const response = await SessionService.getSessions();
          setSessions(response);
        } catch (error) {
          Swal.fire(
            'Erreur',
            'Une erreur est survenue.',
            'error'
          );
        }
      }
    });
  };


  const handleEdit = (session) => {
    setDialogTitle("Modifier ")
    setSelectedType(session.typeSession)
    setSessionUpdate(session);
  const startDate = new Date(session.dateDebut);
  const endDate = new Date(session.dateFin);
  setDates([startDate, endDate]);
  setTimeSlots([
    { start: session.start1, end: session.end1 },
    { start: session.start2, end: session.end2 },
    { start: session.start3, end: session.end3 },
    { start: session.start4, end: session.end4 }
  ]);

    setVisible(true)
  };

  const handleDelete = (session) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
  }).then(async (result) => {
      if (result.isConfirmed) {
          Swal.fire(
              'Supprimé !',
              'L\'élément a été supprimé avec succès.',
              'success'
          );
          await SessionService.deleteSession(session.id);
          const response = await SessionService.getSessions();
          setSessions(response);

          
      }
  });
  };
  const createSession = async (sessionData) => {
    try {
      const createdSession = await SessionService.createSession(sessionData);
      const data = await SessionService.getSessions();
      setSessions(data);

      console.log("Session créée avec succès:", createdSession);
    } catch (error) {
      console.error('Error creating session:', error);
      // Handle error, e.g., show error message
    }
  };

  const renderHeader = () => {
    return (
      <div>
        <div
          className="flex justify-content-between align-items-center"
          style={{ padding: '0 0.5rem' }}
        >
          <h2 className="m-0">Session</h2>

        
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
              style={{
                paddingLeft: '2.5rem',
              }}
              className="p-inputtext-lg"
            />
          </span>
          <Button
            label="Ajouter une Session"
            icon="pi pi-plus"
            severity="success"
            onClick={() => {
              setSelectedType(null);
              setDates(null)
              setVisible(true);
            }} // Ouvre le modal

            className="p-button-raised"
            style={{
              position: 'absolute',
              right: '0',
            }}
          />
        </div>
      </div>
    );
  };
  const formatDateToString = (date) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};
  // Footer du modal avec les boutons
  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Annuler"
          icon="pi pi-times"
          onClick={() => setVisible(false)}
          className="p-button-text"
        />
        <Button
          label="Sauvegarder"
          icon="pi pi-check"
          onClick={() => {
            if(dialogtitle!=="Modifier "){
           const jsonBodySession={typeSession:selectedType,
              dateDebut:formattedDates[0],
              dateFin:formattedDates[1],
              start1: timeSlots[0].start,
              end1: timeSlots[0].end,
              start2: timeSlots[1].start,
              end2: timeSlots[1].end,
              start3: timeSlots[2].start,
              end3: timeSlots[2].end,
              start4: timeSlots[3].start,
              end4: timeSlots[3].end

            }
               
        

            createSession(jsonBodySession);
          }
          else{            
            const jsonBodySession = {
              id: sessionupdate.id,
              typeSession: selectedType || sessionupdate.typeSession, // Si selectedType est null, utiliser sessionupdate.typeSession
              dateDebut: formattedDates?.[0] || sessionupdate.dateDebut, // Si formattedDates[0] est null, utiliser sessionupdate.dateDebut
              dateFin: formattedDates?.[1] || sessionupdate.dateFin, // Si formattedDates[1] est null, utiliser sessionupdate.dateFin
              start1: timeSlots?.[0]?.start || sessionupdate.start1, // Si timeSlots[0].start est null, utiliser sessionupdate.start1
              end1: timeSlots?.[0]?.end || sessionupdate.end1, // Si timeSlots[0].end est null, utiliser sessionupdate.end1
              start2: timeSlots?.[1]?.start || sessionupdate.start2, // Si timeSlots[1].start est null, utiliser sessionupdate.start2
              end2: timeSlots?.[1]?.end || sessionupdate.end2, // Si timeSlots[1].end est null, utiliser sessionupdate.end2
              start3: timeSlots?.[2]?.start || sessionupdate.start3, // Si timeSlots[2].start est null, utiliser sessionupdate.start3
              end3: timeSlots?.[2]?.end || sessionupdate.end3, // Si timeSlots[2].end est null, utiliser sessionupdate.end3
              start4: timeSlots?.[3]?.start || sessionupdate.start4, // Si timeSlots[3].start est null, utiliser sessionupdate.start4
              end4: timeSlots?.[3]?.end || sessionupdate.end4 // Si timeSlots[3].end est null, utiliser sessionupdate.end4
          };
          createSession(jsonBodySession);


          }

            setVisible(false);
            setSelectedType(null);
          }}
          autoFocus
          disabled={!selectedType || !dates}
        />
      </div>
    );
  };
  const header = renderHeader();

  return (
    <div style={{
      backgroundImage: 'url(/ensajbg.png)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative',
    }}>
      <div className="data-table-container">
      <div style={{ width: '80%' }}> 
      <DataTable
        value={sessions}
        paginator
        rows={5}
        dataKey="id"
        loading={loading}
        globalFilter={globalFilterValue}
        header={header}
        emptyMessage="Aucune session trouvée."
        rowsPerPageOptions={[5, 10]}
        removableSort
        showGridlines
        stripedRows
        sortMode="multiple"
        globalFilterFields={['id', 'typeSession', 'dateDebut', 'dateFin']}
      >
        <Column
          field="id"
          header="ID"
          sortable
          style={{ minWidth: '5rem' }}
          body={(rowData) => (
            <Button
              label={rowData.id}
              onClick={() => {
                setSessionId(rowData.id);
                navigate(`/session/${rowData.id}`)
              }}
              className="p-button-text"
              style={{ textDecoration: 'underline', color: 'blue' }}
            />
          )}
        />
        <Column
          field="typeSession"
          header="Type Session"
          sortable
          style={{ minWidth: '10rem' }}
        />
        <Column
          field="dateDebut"
          header="Date Début"
          sortable
          body={(rowData) => dateBodyTemplate(rowData, 'dateDebut')}
          style={{ minWidth: '10rem' }}
        />
        <Column
          field="dateFin"
          header="Date Fin"
          sortable
          body={(rowData) => dateBodyTemplate(rowData, 'dateFin')}
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
      {/* Modal Dialog */}
      <Dialog
        header={`${dialogtitle} une Session`} 
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => {
          setVisible(false);
          setSelectedType(null);
        }}
        footer={renderFooter}
        modal
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',  // Augmentation significative de l'espacement
          padding: '1.5rem 0'  // Ajout de padding vertical
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'  // Espacement entre le label et le dropdown
          }}>
            <label
              htmlFor="session-type"
              style={{
                fontWeight: 'bold',
                fontSize: '1rem',
                marginBottom: '0.5rem'  // Espace supplémentaire après le label
              }}
            >
              Type de Session
            </label>
            <Dropdown
              id="session-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.value)}
              options={sessionTypes}
              placeholder="Sélectionnez un type de session"
              style={{
                width: '100%',
                marginTop: '0.5rem'  // Espace supplémentaire avant le dropdown
              }}
            />
            <label
              htmlFor="session-date"
              style={{
                fontWeight: 'bold',
                fontSize: '1rem',
                marginBottom: '0.5rem'  // Espace supplémentaire après le label
              }}
            >
              Date
              <Calendar 
                style={{
                  width: '100%',
                  marginTop: '0.5rem'  // Espace supplémentaire avant le dropdown
                }}
              value={dates} 
               id="session-date"
              onChange={(e) => {
                setDates(e.value); // Garde les objets Date pour le Calendar
                            if (e.value) {
                                const formatted = Array.isArray(e.value) ? 
                                    e.value.map(date => formatDateToString(date)) : 
                                    formatDateToString(e.value);
                                setFormattedDates(formatted); // Stocke les dates formatées séparément
                                console.log('Dates formatées:', formatted);
                            } else {
                                setFormattedDates(null);
                            }

              }} 
              dateFormat="dd-mm-yy"  // Format de date français
              showTime={false}       // Désactive la sélection de l'heure
              showSeconds={false}    // Désactive l'affichage des secondes
              showIcon 
              selectionMode="range" 
              readOnlyInput 
              placeholder="Sélectionnez les dates de début et fin"
              hideOnRangeSelection />
              <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginTop: '1rem'
                    }}>
                        {timeSlots.map((slot, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                <InputText
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                                    style={{ width: '100px' }}
                                />
                                <span>-</span>
                                <InputText
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                                    style={{ width: '100px' }}
                                />
                            </div>
                        ))}
                    </div>

            </label>
          </div>
        </div>
      </Dialog>
    </div>

  );
};

export default BonjourPage;