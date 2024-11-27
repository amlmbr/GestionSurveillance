import React from 'react';

const SurveillanceAssignmentDisplay = ({ date, horaire, local, typeSurveillant }) => {
    return (
        <div 
            className="flex align-items-center justify-content-center"
            style={{ 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                color: typeSurveillant === 'PRINCIPAL' ? 'green' : 'orange'
            }}
        >
            <i className="pi pi-user mr-1"></i>
            <span>
                {local} - {typeSurveillant}
            </span>
        </div>
    );
};

export default SurveillanceAssignmentDisplay;