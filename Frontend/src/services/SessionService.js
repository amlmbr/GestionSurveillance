import axiosInstance from '../axiosapi/axiosInstance';

const SessionService = {
  getSessions: async () => {
    try {
        
      const response = await axiosInstance.get('/sessions');

      console.log("getSession finish taille ");

      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },
  getSessionById: async (id) => {
    try {
        
      const response = await axiosInstance.get(`/sessions/${id}`);

      console.log("getSessionbyid finish taille ");

      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  createSession: async (sessionData) => {
    console.log("data depuis services : ",sessionData)

    try {
      const response = await axiosInstance.post('/sessions', sessionData);
     
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  updateSession: async (sessionId, sessionData) => {
    try {
      const response = await axiosInstance.put(`/sessions/${sessionId}`, sessionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating session with ID ${sessionId}:`, error);
      throw error;
    }
  },

  deleteSession: async (sessionId) => {
    try {
      await axiosInstance.delete(`/sessions/${sessionId}`);
      console.log("deletesession finish")
    } catch (error) {
      console.error(`Error deleting session with ID ${sessionId}:`, error);
      throw error;
    }
  },

   
};

export default SessionService;