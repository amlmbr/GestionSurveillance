import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialog } from 'primereact/confirmdialog';

const SurveillanceCell = ({ 
  assignment, 
  onEdit, 
  onDelete, 
  locaux, 
  onClick,
  loading 
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    local: '',
    typeSurveillant: ''
  });

  const typesSurveillant = [
    { label: 'Principal', value: 'PRINCIPAL' },
    { label: 'Assistant', value: 'ASSISTANT' },
    { label: 'Reserviste', value: 'RESERVISTE' }
  ];

  const handleEdit = () => {
    setEditData({
      local: assignment.local,
      typeSurveillant: assignment.typeSurveillant
    });
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    confirmDialog({
      message: 'Êtes-vous sûr de vouloir supprimer cette assignation ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => onDelete(assignment)
    });
  };

  const handleSaveEdit = () => {
    onEdit({ ...assignment, ...editData });
    setShowEditDialog(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-2">
        <i className="pi pi-spin pi-spinner text-blue-500" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <Button
        label="Assigner"
        className="p-button-text p-button-sm"
        onClick={onClick}
      />
    );
  }

  return (
    <div className="p-2 bg-blue-50 rounded-md">
      <div className="text-sm mb-2">
        <div><strong>Local:</strong> {assignment.local}</div>
        <div><strong>Type:</strong> {assignment.typeSurveillant}</div>
      </div>
      
      <div className="flex gap-2 justify-center mt-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-text p-button-sm"
          onClick={handleEdit}
          tooltip="Modifier"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text p-button-sm"
          onClick={handleDelete}
          tooltip="Supprimer"
        />
      </div>

      <Dialog
        header="Modifier l'assignation"
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        className="w-full md:w-6"
      >
        <div className="grid gap-4">
          <div className="col-12">
            <label htmlFor="local" className="block mb-2">Local</label>
            <Dropdown
              id="local"
              value={editData.local}
              options={locaux}
              onChange={(e) => setEditData({ ...editData, local: e.value })}
              placeholder="Sélectionnez un local"
              className="w-full"
            />
          </div>
          
          <div className="col-12">
            <label htmlFor="type" className="block mb-2">Type de surveillant</label>
            <Dropdown
              id="type"
              value={editData.typeSurveillant}
              options={typesSurveillant}
              onChange={(e) => setEditData({ ...editData, typeSurveillant: e.value })}
              placeholder="Sélectionnez un type"
              className="w-full"
            />
          </div>

          <div className="col-12 flex justify-end gap-2">
            <Button
              label="Annuler"
              className="p-button-text"
              onClick={() => setShowEditDialog(false)}
            />
            <Button
              label="Enregistrer"
              onClick={handleSaveEdit}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SurveillanceCell;