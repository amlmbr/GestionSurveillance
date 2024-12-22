import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

const EditAssignmentDialog = ({ visible, onHide, assignment, onSave, loading }) => {
    const [selectedLocal, setSelectedLocal] = useState(null);
    const [typeSurveillant, setTypeSurveillant] = useState("PRINCIPAL");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (assignment) {
            setSelectedLocal(assignment.local?.id || null);
            setTypeSurveillant(assignment.typeSurveillant || "PRINCIPAL");
        }
    }, [assignment]);

    useEffect(() => {
        if (!visible) {
            setSelectedLocal(null);
            setTypeSurveillant("PRINCIPAL");
            setFormError("");
        }
    }, [visible]);

    const handleSave = () => {
        if (!selectedLocal) {
            setFormError("Veuillez sélectionner un local");
            return;
        }

        const updatedData = {
            id: assignment.id,
            localId: selectedLocal,
            typeSurveillant: typeSurveillant
        };

        onSave(updatedData);
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
                label="Sauvegarder"
                icon="pi pi-check"
                className="p-button-primary"
                loading={loading}
                onClick={handleSave}
            />
        </div>
    );

    return (
        <Dialog
            header="Modifier l'assignation de surveillance"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={onHide}
            footer={footer}
            modal
        >
            {assignment && (
                <div className="space-y-4">
                    <Card>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Détails de l'examen</h3>
                            <p><strong>Option:</strong> {assignment.option?.nom || 'Non spécifié'}</p>
                            <p><strong>Module:</strong> {assignment.moduleExamen?.nom || 'Non spécifié'}</p>
                            <p><strong>Enseignant:</strong> {assignment.enseignant?.nom} {assignment.enseignant?.prenom || 'Non spécifié'}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Sélectionner le local</h3>
                            <div className="flex flex-col gap-3">
                                {assignment.locaux?.map((local) => (
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

export default EditAssignmentDialog;