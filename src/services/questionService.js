import api from "./api";


// ==========================================
// QUESTION SERVICE
// ==========================================


// ==========================================
// Create Question
// ==========================================

export const createQuestion = async (questionData) => {

    const response = await api.post(
        "/questions",
        questionData
    );

    return response.data;
};


// ==========================================
// Get Questions By Quiz ID
// ==========================================

export const getQuestionsByQuizId = async (
    quizId
) => {

    const response = await api.get(
        `/questions/${quizId}`
    );

    return response.data;
};


// ==========================================
// Update Question
// ==========================================

export const updateQuestion = async (
    questionId,
    questionData
) => {

    const response = await api.put(
        `/questions/${questionId}`,
        questionData
    );

    return response.data;
};


// ==========================================
// Delete Question
// ==========================================

export const deleteQuestion = async (
    questionId
) => {

    const response = await api.delete(
        `/questions/${questionId}`
    );

    return response.data;
};