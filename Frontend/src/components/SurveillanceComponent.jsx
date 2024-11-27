import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { getEnseignantsByDepartement, getDepartements } from '../services/departementService';
import ExamService from '../services/examService';
import SessionService from '../services/SessionService';
import AssignmentDialog from './AssignmentDialog';
import SurveillanceService from '../services/surveillanceService';
import SurveillanceAssignmentDisplay from './SurveillanceAssignmentDisplay';
import * as XLSX from 'xlsx';


const SurveillanceComponent = ({ sessionId }) => {
    const [departements, setDepartements] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [enseignants, setEnseignants] = useState([]);
    const [session, setSession] = useState(null);
    const [horaires, setHoraires] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [state, setState] = useState({
        loadingCell: null,
        selectedCell: null,
        showDialog: false,
    });
    const [assignmentDialogVisible, setAssignmentDialogVisible] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [surveillanceAssignments, setSurveillanceAssignments] = useState({});
    

    // Nouvelles fonctions de mise à jour d'état
    const setLoadingCell = (cell) => setState(prev => ({ ...prev, loadingCell: cell }));
    const setSelectedCell = (cell) => setState(prev => ({ ...prev, selectedCell: cell }));
    const setShowDialog = (status) => setState(prev => ({ ...prev, showDialog: status }));

    useEffect(() => {
        loadDepartements();
        loadSessionData();
    }, []);

    useEffect(() => {
        if (selectedDepartement) loadEnseignants();
    }, [selectedDepartement]);

    const loadDepartements = async () => {
        try {
            const res = await getDepartements();
            setDepartements(res);
        } catch (error) {
            showError('Erreur lors du chargement des départements');
        }
    };
    

    const loadEnseignants = async () => {
        setLoading(true);
        try {
            const res = await getEnseignantsByDepartement(selectedDepartement);
            setEnseignants(res);
        } catch (error) {
            showError('Erreur lors du chargement des enseignants');
        } finally {
            setLoading(false);
        }
    };

    const loadSessionData = async () => {
        try {
            const sessionData = await SessionService.getSessionById(sessionId);
            setSession(sessionData);
            setHoraires([
                `${sessionData.start1}-${sessionData.end1}`,
                `${sessionData.start2}-${sessionData.end2}`,
                `${sessionData.start3}-${sessionData.end3}`,
                `${sessionData.start4}-${sessionData.end4}`,
            ]);
        } catch (error) {
            showError('Erreur lors du chargement de la session');
        }
    };
    const loadSurveillanceAssignments = async () => {
        try {
            const assignments = await SurveillanceService.getSurveillanceAssignments(sessionId, selectedDepartement);
            const assignmentsMap = assignments.reduce((acc, assignment) => {
                const key = `${assignment.date}_${assignment.horaire}`;
                acc[key] = assignment;
                return acc;
            }, {});
            setSurveillanceAssignments(assignmentsMap);
        } catch (error) {
            showError('Erreur lors du chargement des assignations de surveillance');
        }
    };

    useEffect(() => {
        if (selectedDepartement) {
            loadSurveillanceAssignments();
        }
    }, [selectedDepartement]);

    const handleCellClick = async (date, horaire) => {
        setLoadingCell({ date, horaire });
        try {
            const exams = await ExamService.getExams(sessionId, date, horaire);
            setSelectedCell({ date, horaire, exams });
            setShowDialog(true);
        } catch (error) {
            console.error('Erreur lors du chargement des examens :', error);
            showError('Erreur lors du chargement des examens');
        } finally {
            setLoadingCell(null);
        }
    };
    

    const showError = (message) => {
        toast.current?.show({ severity: 'error', summary: 'Erreur', detail: message, life: 3000 });
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSelectedCell(null);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
    
        // Format the date in the "2024-11-24" format
        const formattedDate = date.toISOString().split('T')[0];
        
        // Add "Matin" for morning times and "Apresmidi" for afternoon times
        const timeOfDay = hours < 12 ? "Matin" : "Apresmidi";
        const timeApremidi="Après-midi"
        
        return `${timeOfDay}  ${formattedDate}  ${timeApremidi}`;
    };
    const headerGroup = useMemo(() => {
        if (!session || !horaires.length) return null;
    
        const dates = [];
        let currentDate = new Date(session.dateDebut);
        while (currentDate <= new Date(session.dateFin)) {
            // Format the date as "Matin 2024-11-24" or "Apresmidi"
            dates.push(formatDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return (
            <ColumnGroup>
            <Row>
                <Column header="Enseignants" rowSpan={2} frozen style={{ width: '200px' }} />
                {dates.map(date => (
                    <Column
                        key={date}
                        header={date}
                        colSpan={horaires.length}
                        style={{ textAlign: 'center', color: 'red' }} // Centrer la date
                    />
                ))}
            </Row>
            <Row>
                {dates.map(date => (
                    horaires.map(horaire => (
                        <Column
                            key={`${date}_${horaire}`}
                            header={horaire}
                            style={{ textAlign: 'center' }} // Centrer les horaires
                        />
                    ))
                ))}
            </Row>
        </ColumnGroup>
        
        );
    }, [session, horaires]);
    
   
    

    const tableData = useMemo(() => {
        if (!session || !enseignants.length) return [];
        
        const dates = [];
        let currentDate = new Date(session.dateDebut);
        while (currentDate <= new Date(session.dateFin)) {
            dates.push(new Date(currentDate).toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return enseignants.map(enseignant => {
            const row = { 
                enseignant: `${enseignant.nom} ${enseignant.prenom}`,
                enseignantId: enseignant.id 
            };
            dates.forEach(date => {
                horaires.forEach(horaire => {
                    row[`${date}_${horaire}`] = { date, horaire };
                });
            });
            return row;
        });
    }, [enseignants, session, horaires]);


    /*const handleAssignSurveillant = async (examId) => {
        if (!state.selectedCell || !examId) {
          console.error('Missing data for assignment');
          return;
        }
    
        setLoading(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update UI after successful assignment
          setState(prev => ({
            ...prev,
            showDialog: false
          }));
        } catch (error) {
          console.error('Error assigning surveillant:', error);
        } finally {
          setLoading(false);
        }
      };
     */
      const handleAssignSurveillant = async (exam) => {
        if (!exam) {
            console.error("Aucun examen sélectionné");
            return;
        }
    
        setSelectedExam(exam);
        setAssignmentDialogVisible(true);
    };
    
    const handleAssignment = async (assignmentData) => {
        try {
            setLoading(true);
            
            // Appel du service pour assigner le surveillant
            await SurveillanceService.assignerSurveillant(assignmentData);
    
            // Afficher un message de succès
            toast.current.show({
                severity: 'success',
                summary: 'Succès',
                detail: 'Surveillant assigné avec succès',
                life: 3000
            });
    
            // Fermer le dialogue
            setAssignmentDialogVisible(false);
    
            // Recharger les assignations de surveillance
            await loadSurveillanceAssignments();
    
            // Optionnel : Mettre à jour la liste des examens ou rafraîchir les données
            if (state.selectedCell) {
                await handleCellClick(state.selectedCell.date, state.selectedCell.horaire);
            }
        } catch (error) {
            // Afficher un message d'erreur détaillé
            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: error.response?.data?.message || "Erreur lors de l'assignation du surveillant",
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };
    const renderCellContent = (date, horaire) => {
        const key = `${date}_${horaire}`;
        const surveillanceAssignment = surveillanceAssignments[key];
        
        // Si une assignation existe, afficher les détails de la surveillance
        if (surveillanceAssignment) {
            return (
                <div className="flex align-items-center justify-content-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
                    <span className="font-bold">{surveillanceAssignment.local?.nom}</span> {/* Affiche le nom du local */}
                    <span className="text-italic">{surveillanceAssignment.typeSurveillant}</span> {/* Affiche le type de surveillant */}
                </div>
            );
        }
        
        // Sinon, afficher l'icône de calendrier pour une cellule non assignée
        const isLoading = state.loadingCell?.date === date && state.loadingCell?.horaire === horaire;
        
        return isLoading ? (
            <ProgressSpinner style={{ width: '20px', height: '20px' }} />
        ) : (
            <i 
                className="pi pi-calendar text-primary" 
                style={{ fontSize: '1.2rem' }} 
                onClick={() => handleCellClick(date, horaire)}
            />
        );
    };
    
    

    

    const handleExportSurveillances = async () => {
        try {
            setLoading(true);
            
            // Récupération des données à exporter
            const exportData = tableData.map(row => {
                const rowData = {
                    "Enseignant": row.enseignant, // Nom de l'enseignant
                };
                
                // Ajoutez les données des examens/assignations pour chaque date et horaire
                Object.keys(row).forEach(key => {
                    if (key !== 'enseignant' && key !== 'enseignantId') {
                        const [date, horaire] = key.split('_');
                        const assignment = surveillanceAssignments[key];
                        
                        rowData[`${date} ${horaire}`] = assignment 
                            ? `${assignment.local?.nom} (${assignment.typeSurveillant})`
                            : 'Non assigné'; // Assigner le texte selon les données
                    }
                });
                
                return rowData;
            });
    
            // Créer une feuille de calcul
            const ws = XLSX.utils.json_to_sheet(exportData);
    
            // Créer un classeur
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Surveillances');
    
            // Exporter le fichier Excel
            XLSX.writeFile(wb, 'surveillances.xlsx');
            
            toast.current.show({
                severity: 'success',
                summary: 'Exportation',
                detail: 'Surveillance exportée avec succès',
                life: 3000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Échec de l\'exportation',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };
    
      
      const locauxTemplate = (rowData) => (
        <div className="flex align-items-center">
            <i className="pi pi-building mr-2"></i>
            <span>
            {rowData.locaux?.map(local => local.nom).join(', ')}
            </span>
        </div>
        );
    return (
        <div style={{
            backgroundImage: 'url(/ensajbg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <div className="flex justify-content-center" style={{marginTop: '100px'}}>
                <div className="w-10 md:w-8 lg:w-7" style={{ minWidth: '800px' }}>
                    <Card>
                        <div className="text-center mb-5">
                            <h2 className="m-0">Gestion des Surveillances</h2>
                            <span className="text-600 font-medium">Session {session?.nom}</span>
                        </div>
                        <Toast ref={toast} />

                        <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1 }}>
        <label htmlFor="departement">Département :</label>
        <Dropdown
            id="departement"
            value={selectedDepartement}
            options={departements}
            onChange={(e) => setSelectedDepartement(e.value)}
            optionLabel="nom"
            optionValue="id"
            placeholder="Sélectionnez un département"
        />
    </div>
    <Button 
        label="Exporter Excel" 
        icon="pi pi-file-excel" 
        onClick={handleExportSurveillances}
        disabled={!selectedDepartement || loading}
        className="p-button-success"
    />
</div>

                        <br></br>
                        {loading ? (
                            <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                                <ProgressSpinner />
                            </div>
                        ) : (
                            <DataTable
                                value={tableData}
                                responsiveLayout="scroll"
                                showGridlines
                                headerColumnGroup={headerGroup}
                                className="p-datatable-sm"
                            >
                                <Column 
                                    field="enseignant" 
                                    header="Enseignants" 
                                    frozen 
                                    style={{ width: '200px' }} 
                                />
                                {tableData[0] && Object.keys(tableData[0]).map(key => {
                                    if (key === 'enseignant' || key === 'enseignantId') return null;
                                    const [date, horaire] = key.split('_');
                                    return (
                                        <Column
                                        style={{ textAlign: 'center', width: '120px' }}
                                        body={(rowData) => {
                                            const cellData = rowData[`${date}_${horaire}`];
                                            return (
                                                <div
                                                    className="cursor-pointer flex align-items-center justify-content-center"
                                                >
                                                    {renderCellContent(cellData.date, cellData.horaire)}
                                                </div>
                                            );
                                        }}
                                    />
                                    );
                                })}
                            </DataTable>
                        )}
                    </Card>
                </div>
            </div>

            {/* Dialog pour la liste des examens */}
            <Dialog
                header={
                    <div className="flex align-items-center">
                        <i className="pi pi-calendar mr-2" style={{ fontSize: '1.5rem' }}></i>
                        <span>Examens - {state.selectedCell?.date} à {state.selectedCell?.horaire}</span>
                    </div>
                }
                visible={state.showDialog}
                style={{ width: '80vw' }}
                onHide={closeDialog}
            >
                {state.selectedCell?.exams?.length ? (
                    <div className="card">
                        <DataTable value={state.selectedCell.exams} stripedRows>
                            <Column
                                header="#"
                                body={(data, options) => options.rowIndex + 1}
                                style={{ width: '3rem' }}
                            />
                            <Column
                                header="Module"
                                body={(rowData) => (
                                    <div>
                                        <div className="text-lg font-bold">EXAMEN {rowData.index + 1}</div>
                                        <div className="text-primary">{rowData.module}</div>
                                    </div>
                                )}
                            />
                            
                            <Column 
                                header="Locaux" 
                                body={locauxTemplate}
                                />
                                <Column 
                                    header="Enseignant Responsable" 
                                    body={(rowData) => (
                                        <div className="flex align-items-center">
                                        <i className="pi pi-user mr-2"></i>
                                        <span>{rowData.enseignant.nom} {rowData.enseignant.prenom}</span>
                                        </div>
                                    )}
                                     />
                               <Column
                                header="Actions"
                                body={(data) => (  // ici on reçoit le paramètre data qui contient les données de la ligne
                                    <div className="flex gap-2 justify-content-center">
                                <Button
                                    icon="pi pi-user-plus"
                                    className="p-button-rounded p-button-success p-button-text"
                                    tooltip="Assigner comme surveillant"
                                    onClick={() => handleAssignSurveillant(data)}  // on utilise data au lieu de rowData
                                />
                            </div>
                        )}
                        style={{ width: '8rem' }}
                    />
                                                
                           
                        </DataTable>
                    </div>
                ) : (
                    <Message severity="info" text="Aucun examen programmé" className="w-full" />
                )}
            </Dialog>
            <AssignmentDialog
  visible={assignmentDialogVisible}
  onHide={() => setAssignmentDialogVisible(false)}
  exam={selectedExam}
  onAssign={handleAssignment}
  loading={loading}
/>
        </div>
    );
};

export default SurveillanceComponent;