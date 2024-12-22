import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const EditAssignmentDialog = ({ visible, onHide, assignment, onSave }) => {
    const [local, setLocal] = useState('');
    const [typeSurveillant, setTypeSurveillant] = useState('');

    useEffect(() => {
        if (assignment) {
            setLocal(assignment.local || '');
            setTypeSurveillant(assignment.typeSurveillant || '');
        }
    }, [assignment]);

    const handleSave = () => {
        onSave({
            ...assignment,
            local,
            typeSurveillant
        });
        onHide();
    };

    const footer = (
        <div>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Sauvegarder" icon="pi pi-check" onClick={handleSave} />
        </div>
    );

    return (
        <Dialog
            header="Modifier l'assignation"
            visible={visible}
            style={{ width: '50vw' }}
            footer={footer}
            onHide={onHide}
        >
            <div className="flex flex-column gap-3">
                <div className="field">
                    <label htmlFor="local">Local</label>
                    <input
                        id="local"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        className="w-full p-inputtext"
                    />
                </div>
                <div className="field">
                    <label htmlFor="typeSurveillant">Type de surveillant</label>
                    <Dropdown
                        id="typeSurveillant"
                        value={typeSurveillant}
                        options={[
                            { label: 'PRINCIPAL', value: 'PRINCIPAL' },
                            { label: 'RESERVISTE', value: 'RESERVISTE' }
                        ]}
                        onChange={(e) => setTypeSurveillant(e.value)}
                        className="w-full"
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default EditAssignmentDialog;