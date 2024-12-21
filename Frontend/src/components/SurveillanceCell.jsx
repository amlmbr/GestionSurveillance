import React from 'react';

const SurveillanceCell = ({ assignments, onClick }) => {
    if (!assignments || assignments.length === 0) {
      return (
        <div
          className="cursor-pointer hover:bg-gray-50 p-2 flex justify-center items-center rounded-md transition-colors border border-gray-200"
          onClick={onClick}
        >
          <div className="flex flex-col items-center gap-1">
            <i className="pi pi-user-plus text-gray-400" />
            <span className="text-xs text-gray-500">Assigner</span>
          </div>
        </div>
      );
    }
  
    return (
      <div
        className="cursor-pointer p-2 flex flex-col items-center rounded-md transition-colors border"
        onClick={onClick}
      >
        {assignments.map((assignment, index) => (
          <div 
            key={assignment.id}
            className={`w-full p-1 mb-1 rounded ${
              assignment.typeSurveillant === 'PRINCIPAL' 
                ? 'bg-blue-50' 
                : 'bg-green-50'
            }`}
          >
            <div className="text-sm font-medium text-gray-800">
              {assignment.local}
            </div>
            <div className="text-xs text-gray-600">
              {assignment.typeSurveillant === 'PRINCIPAL' ? 'Principal' : 'Réserviste'}
            </div>
            <div className="flex items-center gap-1">
              <i className="pi pi-user text-gray-600 text-xs" />
              <div className="text-xs text-gray-600 truncate">
                {assignment.enseignant}
              </div>
            </div>
            {index < assignments.length - 1 && <hr className="my-1" />}
          </div>
        ))}
      </div>
    );
  };
  
  export default SurveillanceCell;