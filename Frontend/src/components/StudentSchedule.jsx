import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { getOptions } from '../services/optionService';
import { getAllStudents, importStudents } from '../services/studentService'; 

const StudentSchedule = ({ sessionId }) => {
    const [students, setStudents] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);
    const [scheduleVisible, setScheduleVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const fileRef = useRef(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            await Promise.all([loadOptions(), loadStudents()]);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOptions = async () => {
        try {
            const optionsData = await getOptions();
            if (Array.isArray(optionsData)) {
                setOptions(optionsData.map(opt => ({
                    label: opt.nom,
                    value: opt.id
                })));
            }
        } catch (error) {
            console.error('Error loading options:', error);
            showErrorToast('Erreur lors du chargement des options');
        }
    };

    const loadStudents = async () => {
        try {
            const studentsData = await getAllStudents();
            if (Array.isArray(studentsData)) {
                setStudents(studentsData);
            }
        } catch (error) {
            console.error('Error loading students:', error);
            showErrorToast('Erreur lors du chargement des étudiants');
        }
    };

    const validateFile = (file) => {
        const allowedTypes = [
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Type de fichier non supporté. Utilisez CSV ou Excel.');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Fichier trop volumineux. Maximum 5MB.');
        }
        return true;
    };

    const handleFileImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        try {
            setLoading(true);
            validateFile(file);
    
            await importStudents(file, sessionId || 1); // Ajoutez une valeur par défaut pour sessionId
            
            showSuccessToast('Import réussi');
            await loadStudents(); // Recharger la liste après import
        } catch (error) {
            console.error('Import error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'import';
            showErrorToast(errorMessage);
        } finally {
            setLoading(false);
            if (event.target) event.target.value = '';
        }
    };

    const showErrorToast = (message) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 5000
        });
    };

    const showSuccessToast = (message) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Succès',
            detail: message,
            life: 3000
        });
    };

    const onOptionChange = (e) => {
        setSelectedOption(e.value);
    };

    const filteredStudents = selectedOption
        ? students.filter(s => s.option?.id === selectedOption)
        : students;

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Card>
                <div className="flex justify-content-between mb-4">
                    <div>
                        <input
                            type="file"
                            ref={fileRef}
                            onChange={handleFileImport}
                            accept=".csv,.xlsx,.xls"
                            hidden
                        />
                        <Button 
                            label="Importer Fichier" 
                            icon="pi pi-upload"
                            onClick={() => fileRef.current?.click()}
                            loading={loading}
                            className="mr-2"
                        />
                    </div>
                    <Dropdown
                        value={selectedOption}
                        options={options}
                        onChange={onOptionChange}
                        placeholder="Filtrer par Option"
                        className="w-full md:w-14rem"
                    />
                </div>

                <DataTable
                    value={filteredStudents}
                    paginator
                    rows={10}
                    loading={loading}
                    emptyMessage="Aucun étudiant trouvé"
                    className="mb-4"
                    rowHover
                >
                    <Column field="nom" header="Nom" sortable />
                    <Column field="prenom" header="Prénom" sortable />
                    <Column field="cin" header="CIN" sortable />
                    <Column field="cne" header="CNE" sortable />
                    <Column 
                        field="option.nom" 
                        header="Option" 
                        sortable
                        body={(rowData) => rowData.option?.nom || 'N/A'}
                    />
                </DataTable>
            </Card>
        </div>
    );
};

export default StudentSchedule;