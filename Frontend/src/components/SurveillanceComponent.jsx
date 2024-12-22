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
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import EditAssignmentDialog from './EditAssignmentDialog';


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
        if (!sessionId || !selectedDepartement) return;
        
        try {
            setLoading(true);
            const assignments = await SurveillanceService.getSurveillanceAssignments(sessionId, selectedDepartement);
            console.log("hi ",assignments)
            setSurveillanceAssignments(assignments);
        } catch (error) {
            console.error('Erreur de chargement des assignations:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors du chargement des assignations de surveillance. Veuillez réessayer.',
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadSurveillanceAssignments();
    }, [selectedDepartement, sessionId]);

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


    const handleAssignSurveillant = (exam) => {
        if (!exam) {
            console.error("Aucun examen sélectionné");
            return;
        }
        
        // On stocke l'examen sélectionné
        setSelectedExam(exam);
        setAssignmentDialogVisible(true);
    };
    
    
    const handleAssignment = async (assignmentData) => {
        try {
            setLoading(true);
            await SurveillanceService.assignerSurveillant(assignmentData);
            await loadSurveillanceAssignments()
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
                
                await handleCellClick(state.selectedCell.date, state.selectedCell.horaire,state.selectedCell);
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
    const [editDialogVisible, setEditDialogVisible] = useState(false);
const [selectedAssignment, setSelectedAssignment] = useState(null);

const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setEditDialogVisible(true);
};

const handleDeleteAssignment = (assignment) => {
    if (!assignment) { // Retirez la vérification de l'ID
        toast.current.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Assignation invalide',
            life: 3000
        });
        return;
    }

    confirmDialog({
        message: 'Êtes-vous sûr de vouloir supprimer cette assignation ?',
        header: 'Confirmation de suppression',
        icon: 'pi pi-exclamation-triangle',
        acceptClassName: 'p-button-danger',
        accept: async () => {
            try {
                setLoading(true);
                await SurveillanceService.deleteSurveillanceAssignation(assignment.surveillanceId || assignment.id);
                await loadSurveillanceAssignments();
                
                toast.current.show({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Assignation supprimée avec succès',
                    life: 3000
                });
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.message || 'Erreur lors de la suppression',
                    life: 5000
                });
            } finally {
                setLoading(false);
            }
        }
    });
};
const handleSaveEdit = async (updatedAssignment) => {
    try {
        await SurveillanceService.updateSurveillanceAssignation(
            updatedAssignment.id,
            {
                local: updatedAssignment.local,
                typeSurveillant: updatedAssignment.typeSurveillant
            }
        );
        await loadSurveillanceAssignments();
        toast.current.show({
            severity: 'success',
            summary: 'Succès',
            detail: 'Assignation mise à jour avec succès'
        });
        setEditDialogVisible(false);
    } catch (error) {
        toast.current.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour'
        });
    }
};
const deleteAssignment = async (assignment) => {
    try {
        await SurveillanceService.deleteSurveillanceAssignation(assignment.id);
        await loadSurveillanceAssignments();
        toast.current.show({
            severity: 'success',
            summary: 'Succès',
            detail: 'Assignation supprimée avec succès'
        });
    } catch (error) {
        toast.current.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la suppression'
        });
    }
};
    const handleEdit = async (updatedAssignment) => {
        try {
            await SurveillanceService.updateSurveillanceAssignation(
                updatedAssignment.id,
                {
                    local: updatedAssignment.local,
                    typeSurveillant: updatedAssignment.typeSurveillant
                }
            );
            loadSurveillanceAssignments();
            toast.current.show({
                severity: 'success',
                summary: 'Succès',
                detail: 'Assignation mise à jour avec succès'
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors de la mise à jour'
            });
        }
    };
    
    const handleDelete = async (assignment) => {
        try {
            await SurveillanceService.deleteSurveillanceAssignation(assignment.id);
            loadSurveillanceAssignments();
            toast.current.show({
                severity: 'success',
                summary: 'Succès',
                detail: 'Assignation supprimée avec succès'
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors de la suppression'
            });
        }
    };
   /* const renderCellContent = (date, horaire, enseignantId) => {
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
    };*/
    const renderCellContent = (rowData, field) => {
        if (!rowData[field] || !field) {
            return null;
        }
        const date = rowData[field].date;
        const horaire = rowData[field].horaire;
        const enseignantId = rowData.enseignantId;
        
        if (!date || !horaire) {
            return null;
        }
        const key = `${date}_${horaire}`;
        const assignmentsList = surveillanceAssignments[key];
        
        if (state.loadingCell?.date === date && state.loadingCell?.horaire === horaire) {
            return <ProgressSpinner style={{ width: '20px', height: '20px' }} />;
        }
        
        // Filtrer les surveillances pour ne montrer que celles du professeur courant
        const professorAssignments = assignmentsList?.filter(
            assignment => assignment.enseignant === rowData.enseignant
        );
        
        if (professorAssignments && professorAssignments.length > 0) {
            return (
                <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#e3f2fd' }}>
                    {professorAssignments.map((assignment, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex flex-column">
                                <div><strong>Local:</strong> {assignment.local}</div>
                                <div><strong>Type:</strong> {assignment.typeSurveillant}</div>
                                <div className="flex justify-content-center gap-2 mt-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-rounded p-button-warning p-button-text"
                                        onClick={() => handleEditAssignment(assignment)}
                                        tooltip="Modifier"
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger p-button-text"
                                        onClick={() => handleDeleteAssignment(assignment)}
                                        tooltip="Supprimer"
                                        disabled={false} // Désactiver si pas d'ID
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <Button
                    label="Assigner"
                    className="p-button-text p-button-sm"
                    onClick={() => handleCellClick(date, horaire, enseignantId)}
                />
            );
        }
    };
    
    const handleExportSurveillances = async () => {
        try {
            setLoading(true);
    
            // Get surveillance data and assignments
            const surveillanceData = await SurveillanceService.getEmploiSurveillance(sessionId, selectedDepartement);
    
            // Build the table headers
            const headers = ["Enseignants"];
            const dateColumns = [];
    
            // Organize dates and time slots
            surveillanceData.forEach((jour) => {
                Object.keys(jour.horaires).forEach((horaire) => {
                    const [startHour] = horaire.split("-").map((h) => parseInt(h.split(":")[0], 10));
                    const periode = startHour < 12 ? "Matin" : "Après-midi";
                    const columnKey = `${periode} ${jour.date} ${horaire}`;
                    headers.push(columnKey);
                    dateColumns.push({ date: jour.date, horaire });
                });
            });
    
            // Prepare teachers data with assignments
            const enseignantsData = enseignants.map((enseignant) => {
                const rowData = {
                    "Enseignants": `${enseignant.nom} ${enseignant.prenom}`
                };
    
                // For each date/time column
                dateColumns.forEach(({ date, horaire }) => {
                    const key = `${date}_${horaire}`;
                    const assignmentsList = surveillanceAssignments[key];
                    
                    // Find assignment for current teacher
                    const teacherAssignment = assignmentsList?.find(
                        assignment => assignment.enseignant === `${enseignant.nom} ${enseignant.prenom}`
                    );
    
                    // Build column key
                    const [startHour] = horaire.split("-").map((h) => parseInt(h.split(":")[0], 10));
                    const periode = startHour < 12 ? "Matin" : "Après-midi";
                    const columnKey = `${periode} ${date} ${horaire}`;
    
                    // Set cell value based on assignment
                    if (teacherAssignment) {
                        rowData[columnKey] = `Local: ${teacherAssignment.local}\nType: ${teacherAssignment.typeSurveillant}`;
                    } else {
                        rowData[columnKey] = "Non assigné";
                    }
                });
    
                return rowData;
            });
    
            // Create Excel worksheet
            const ws = XLSX.utils.json_to_sheet(enseignantsData, { header: headers });
    
            // Adjust column widths
            const colWidths = headers.map((_, idx) => ({ wch: idx === 0 ? 25 : 30 }));
            ws['!cols'] = colWidths;
    
            // Apply cell styles
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let R = range.s.r; R <= range.e.r; R++) {
                for (let C = range.s.c; C <= range.e.c; C++) {
                    const cell_address = { c: C, r: R };
                    const cell_ref = XLSX.utils.encode_cell(cell_address);
                    if (!ws[cell_ref]) continue;
    
                    ws[cell_ref].s = {
                        alignment: { 
                            vertical: 'center', 
                            horizontal: 'center', 
                            wrapText: true 
                        },
                        font: { 
                            bold: R === 0 || C === 0,
                            color: { rgb: R === 0 ? "FFFFFF" : "000000" }
                        },
                        fill: {
                            fgColor: { rgb: R === 0 ? "4F81BD" : "FFFFFF" }
                        },
                        border: {
                            top: { style: 'thin' },
                            bottom: { style: 'thin' },
                            left: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    };
                }
            }
    
            // Create and save Excel file
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Planning Surveillances");
            
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
                        <ConfirmDialog />

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
                                    key={key}
                                    field={key}
                                    style={{ textAlign: 'center', width: '120px' }}
                                    body={(rowData) => renderCellContent(rowData, key)}
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
                 {rowData.option?.nom || 'Non spécifié'}
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
<EditAssignmentDialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                assignment={selectedAssignment}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default SurveillanceComponent;