import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

const AssignmentDialog = ({ visible, onHide, exam, onAssign, loading }) => {
    const [selectedLocal, setSelectedLocal] = useState(null);
    const [typeSurveillant, setTypeSurveillant] = useState("PRINCIPAL");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (!visible) {
            setSelectedLocal(null);
            setTypeSurveillant("PRINCIPAL");
            setFormError("");
        }
    }, [visible]);

    const handleAssign = () => {
        if (!selectedLocal) {
            setFormError("Veuillez sélectionner un local");
            return;
        }
    
        if (!exam || !exam.enseignant?.id) {
            setFormError("Données de l'examen incomplètes.");
            return;
        }
    
        // Transmet les données d'assignation dans le format attendu
        onAssign({
            examenId: exam.id,
            enseignantId: exam.enseignant.id,
            localId: selectedLocal,
            typeSurveillant: typeSurveillant,
            departementId: exam.departement?.id,
            sessionId: exam.session?.id,
            optionId: exam.option?.id,
            moduleId: exam.moduleExamen?.id
        });
    };
   
    const footer = (
        <div className="flex justify-end gap-2">
            <Button
                label="Annuler"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={loading}
            />
            <Button
                label="Assigner"
                icon="pi pi-check"
                className="p-button-primary"
                loading={loading}
                onClick={handleAssign}
            />
        </div>
    );

    return (
        <Dialog
            header="Assigner un Surveillant"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={onHide}
            footer={footer}
            modal
        >
            {exam && (
                <div className="space-y-4">
                    <Card>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Détails de l'examen</h3>
                            <p><strong>Option:</strong> {exam?.option?.nom || 'Non spécifié'}</p>
                            <p><strong>Module:</strong> {exam?.moduleExamen?.nom || 'Non spécifié'}</p>
                            <p><strong>Enseignant Responsable:</strong> {exam.enseignant?.nom} {exam.enseignant?.prenom}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Sélectionner le local</h3>
                            <div className="flex flex-col gap-3">
                                {exam.locaux?.map((local) => (
                                    <div key={local.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                        <RadioButton
                                            inputId={`local_${local.id}`}
                                            name="local"
                                            value={local.id}
                                            onChange={() => setSelectedLocal(local.id)}
                                            checked={selectedLocal === local.id}
                                        />
                                        <label htmlFor={`local_${local.id}`} className="ml-2 cursor-pointer">
                                            {local.nom} - Capacité: {local.capacite} places
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Type de Surveillant</h3>
                            <Dropdown
                                value={typeSurveillant}
                                options={[
                                    { label: 'PRINCIPAL', value: 'PRINCIPAL' },
                                    { label: 'RESERVISTE', value: 'RESERVISTE' }
                                ]}
                                onChange={(e) => setTypeSurveillant(e.value)}
                                placeholder="Sélectionner le type"
                                className="w-full"
                            />
                        </div>

                        {formError && (
                            <Message severity="error" text={formError} className="w-full" />
                        )}
                    </Card>
                </div>
            )}
        </Dialog>
    );
};

export default AssignmentDialog;

