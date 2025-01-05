import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SessionService from '../services/SessionService'; // Assurez-vous d'importer votre service pour récupérer les données
import SessionStats from '../components/SessionStats';
import ProfessorsByDepartment from '../components/ProfessorsByDepartmentchart';
const SessionDetails = () => {
  const { id } = useParams(); 


 /* useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await SessionService.getSessionById(id); // Supposez que vous avez une méthode pour récupérer la session par ID
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, [id]);

  if (!session) {
    return <div>Loading...</div>;
  }*/

  return (
    <div>
      <h2>Détails de la session</h2>
      <SessionStats idsesion={id} />
      <ProfessorsByDepartment/>
    </div>
  );
};

export default SessionDetails;
