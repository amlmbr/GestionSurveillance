import React, { createContext, useContext, useState } from 'react';
// Créez le contexte
const SessionContext = createContext();
// Fournisseur du contexte
export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null); // Stockez l'ID de session ici
  return (
    <SessionContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </SessionContext.Provider>
  );
};
// Hook personnalisé pour utiliser le contexte
export const useSession = () => useContext(SessionContext);