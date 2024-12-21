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
import { getEnseignantsByDepartement, getOptionsByDepartement, getDepartements } from '../services/departementService';
import ExamService from '../services/examService';
import SessionService from '../services/SessionService';
import AssignmentDialog from './AssignmentDialog';
import SurveillanceService from '../services/surveillanceService';
import SurveillanceAssignmentDisplay from './SurveillanceAssignmentDisplay';
import SurveillanceCell from './SurveillanceCell';
import * as XLSX from 'xlsx';


const SurveillanceComponent = ({ sessionId }) => {
    const [departements, setDepartements] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [enseignants, setEnseignants] = useState([]);
    const [module, setModule] = useState([]);
    const [options, setOptions] = useState([]);
    const [session, setSession] = useState(null);
    const [horaires, setHoraires] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [state, setState] = useState({
        loadingCell: null,
        selectedCell: null,
        showDialog: false,
    });
    const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);

    const [refreshKey, setRefreshKey] = useState(0);
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
            
            // Create a map of assignments using date_horaire as ke
            const assignmentsMap = {};
assignments.forEach(assignment => {
    const key = `${assignment.date}_${assignment.horaire}`;
    assignmentsMap[key] = {
        local: assignment.local.nom, // Utilisez directement le nom du local
        typeSurveillant: assignment.typeSurveillant,
        enseignant: `${assignment.enseignant.nom} ${assignment.enseignant.prenom}` // Ajoutez le nom de l'enseignant
    };
});
            
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

    const handleCellClick = async (date, horaire, enseignantId) => {
        setLoadingCell({ date, horaire });
        setSelectedEnseignantId(enseignantId)
        console.log('Enseignant ID:', enseignantId); // Afficher l'ID de l'enseignant
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


    const handleAssignSurveillant = async (exam, enseignantId) => {
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
            await SurveillanceService.assignerSurveillant(assignmentData);
    
            toast.current.show({
                severity: 'success',
                summary: 'Succès',
                detail: 'Surveillant assigné avec succès',
                life: 3000,
            });
    
            // Mettre à jour l'objet surveillanceAssignments localement
            const key = `${assignmentData.date}_${assignmentData.horaire}`;
            setSurveillanceAssignments(prev => ({
                ...prev,
                [key]: {
                    local: assignmentData.local,
                    typeSurveillant: assignmentData.typeSurveillant,
                    enseignant: assignmentData.enseignant,
                },
            }));
    
            setRefreshKey(prev => prev + 1);
            setAssignmentDialogVisible(false);
    
            if (state.selectedCell) {
                await handleCellClick(state.selectedCell.date, state.selectedCell.horaire);
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: error.response?.data?.message || "Erreur lors de l'assignation du surveillant",
                life: 5000,
            });
        } finally {
            setLoading(false);
        }
    };
    
    const renderCellContent = (date, horaire, enseignantId) => {
        const key = `${date}_${horaire}`;
        const assignment = surveillanceAssignments[key];
    
        if (state.loadingCell?.date === date && state.loadingCell?.horaire === horaire) {
            return (
                <div className="flex justify-center items-center">
                    <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                </div>
            );
        }
    
        return (
            <SurveillanceCell
                assignment={assignment}
                onClick={() => handleCellClick(date, horaire, enseignantId)} // Passez l'ID de l'enseignant ici
            />
        );
    };
    const renderSurveillanceCell = (rowData, field) => {
        const { date, horaire } = rowData[field];
        const key = `${date}_${horaire}`;
        const assignment = surveillanceAssignments[key];
    
        if (assignment) {
            // Si une assignation existe, afficher les détails
            return (
                <div style={{ textAlign: 'center', fontSize: '14px' }}>
                    <span><strong>Local:</strong> {assignment.local}</span><br />
                    <span><strong>Type:</strong> {assignment.typeSurveillant}</span>
                </div>
            );
        } else if (state.loadingCell?.date === date && state.loadingCell?.horaire === horaire) {
            // Afficher un spinner si la cellule est en chargement
            return <ProgressSpinner style={{ width: '20px', height: '20px' }} />;
        } else {
            // Sinon, afficher le bouton "Assigner"
            return (
                <Button
                    label="Assigner"
                    className="p-button-text"
                    onClick={() => handleCellClick(date, horaire, rowData.enseignantId)} // Passez l'ID de l'enseignant ici
                />
            );
        }
    };

    const handleExportSurveillances = async () => {
        try {
            setLoading(true);
    
            // Récupérer les données de surveillance depuis le backend
            const surveillanceData = await SurveillanceService.getEmploiSurveillance(sessionId, selectedDepartement);
    
            // Construire les colonnes dynamiquement avec regroupement "Matin" et "Après-midi"
            const headers = ["Enseignants"];
            const dateColumns = [];
    
            surveillanceData.forEach((jour) => {
                const heuresMatin = [];
                const heuresApresMidi = [];
    
                Object.keys(jour.horaires).forEach((horaire) => {
                    const [startHour] = horaire.split("-").map((h) => parseInt(h.split(":")[0], 10));
                    if (startHour < 12) {
                        heuresMatin.push(horaire);
                    } else {
                        heuresApresMidi.push(horaire);
                    }
                });
    
                // Trier les heures
                const heuresTrieesMatin = heuresMatin.sort((a, b) => a.localeCompare(b));
                const heuresTrieesApresMidi = heuresApresMidi.sort((a, b) => a.localeCompare(b));
    
                // Ajouter les colonnes "Matin" et "Après-midi" avec leurs heures
                heuresTrieesMatin.forEach((horaire) => {
                    const columnKey = `Matin ${jour.date} ${horaire}`;
                    headers.push(columnKey);
                    dateColumns.push({ date: jour.date, horaire, periode: "Matin" });
                });
    
                heuresTrieesApresMidi.forEach((horaire) => {
                    const columnKey = `Après-midi ${jour.date} ${horaire}`;
                    headers.push(columnKey);
                    dateColumns.push({ date: jour.date, horaire, periode: "Après-midi" });
                });
            });
    
            // Préparer les données des enseignants
            const enseignantsData = enseignants.map((enseignant) => {
                const rowData = {
                    "Enseignants": `${enseignant.nom} ${enseignant.prenom}`,
                };
    
                // Pour chaque combinaison date/heure/période, vérifier l'affectation
                dateColumns.forEach(({ date, horaire, periode }) => {
                    const examens = surveillanceData.find((jour) => jour.date === date)?.horaires[horaire] || [];
                    const assignments = examens.flatMap((examen) => examen.surveillants || []);
                    const assigned = assignments.find(
                        (assignment) =>
                            `${assignment.enseignant.nom} ${assignment.enseignant.prenom}` ===
                            `${enseignant.nom} ${enseignant.prenom}`
                    );
    
                    rowData[`${periode} ${date} ${horaire}`] = assigned
                        ? `${assigned.local} (${assigned.typeSurveillant})`
                        : "Non assigné";
                });
    
                return rowData;
            });
    
            // Générer une feuille Excel à partir des données
            const ws = XLSX.utils.json_to_sheet(enseignantsData, { header: headers });
    
            // Ajuster les largeurs des colonnes
            ws["!cols"] = headers.map((_, index) => ({
                wch: index === 0 ? 25 : 20, // Colonne Enseignants plus large
            }));
    
            // Appliquer des styles aux cellules (facultatif)
            for (let i = 0; i <= enseignantsData.length; i++) {
                for (let j = 0; j < headers.length; j++) {
                    const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
                    if (!ws[cellRef]) continue;
    
                    ws[cellRef].s = {
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
    
                    if (i === 0) {
                        ws[cellRef].s.font = { bold: true }; // Gras pour les en-têtes
                        ws[cellRef].s.fill = { fgColor: { rgb: "E2E8F0" } }; // Fond gris clair pour les en-têtes
                    }
                }
            }
    
            // Créer un classeur Excel
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Planning Surveillances");
    
            // Générer et télécharger le fichier Excel
            const fileName = `Planning_Surveillances_${new Date().toISOString().split("T")[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);
    
            toast.current.show({
                severity: "success",
                summary: "Exportation réussie",
                detail: "Le planning des surveillances a été exporté avec succès",
                life: 3000,
            });
        } catch (error) {
            console.error("Erreur lors de l'exportation:", error);
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: "Une erreur est survenue lors de l'exportation",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleExportPDF = async () => {
        try {
            setLoading(true);
            await SurveillanceService.exporterSurveillancesPDF(
                sessionId,
                selectedDepartement,
                toast.current
            );
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Échec de l\'exportation PDF',
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
    <div className="flex gap-2">
                <Button 
                    label="Exporter Excel" 
                    icon="pi pi-file-excel" 
                    onClick={handleExportSurveillances}
                    disabled={!selectedDepartement || loading}
                    className="p-button-success"
                />
                <Button 
                    label="Exporter PDF" 
                    icon="pi pi-file-pdf" 
                    onClick={handleExportPDF}
                    disabled={!selectedDepartement || loading}
                    className="p-button-danger"
                />
    </div>
</div>

                        <br></br>
                        {loading ? (
                            <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                                <ProgressSpinner />
                            </div>
                        ) : (
                            <DataTable
                            key={refreshKey}
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
                                                    {renderCellContent(cellData.date, cellData.horaire, rowData.enseignantId)} 
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
    header="Option"
    body={(rowData) => (
        <div className="flex flex-col">
            <div className="text-sm text-gray-600">
                 {rowData.option?.nom}
            </div>
        </div>
    )}
/>
<Column
    header="Module"
    body={(rowData) => (
        <div className="flex flex-col">
            <div className="text-sm text-gray-600">
                 {rowData.moduleExamen?.nom || 'Non spécifié'}
            </div>
        </div>
    )}
/>
<Column
    header="Local"
    body={locauxTemplate}
/>
<Column
    header="Enseignant Responsable"
    body={(rowData) => (
        <div className="flex align-items-center">
            <i className="pi pi-user mr-2"></i>
            <span>{rowData.enseignant?.nom} {rowData.enseignant?.prenom}</span>
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
                                    onClick={() => handleAssignSurveillant(data, data)}  // on utilise data au lieu de rowData
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
  selectedEnseignantId={selectedEnseignantId} // Passer l'ID de l'enseignant ici
  onAssign={handleAssignment}
  loading={loading}
/>
        </div>
    );
};

export default SurveillanceComponent;