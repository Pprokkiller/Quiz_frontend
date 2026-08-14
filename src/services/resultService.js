import api from "./api";


// ======================================
// Generate Result
// ======================================
export const generateResult = async (participantId) => {

    const response = await api.post(
        `/results/participant/${participantId}/generate`
    );

    return response.data;
};


// ======================================
// Get Student Result
// ======================================
export const getResultByParticipant = async (
    participantId
) => {

    const response = await api.get(
        `/results/participant/${participantId}`
    );

    return response.data;
};


// ======================================
// Get Session Results
// Teacher
// ======================================
export const getSessionResults = async (
    sessionId
) => {

    const response = await api.get(
        `/results/session/${sessionId}`
    );

    return response.data;
};