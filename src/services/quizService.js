import api from "./api";

export const createQuiz = async (quizData) => {

    const response = await api.post(
        "/quizzes",
        quizData
    );

    return response.data;
};


export const getTeacherQuizzes = async () => {

    const response = await api.get(
        "/quizzes"
    );

    return response.data;
};


export const getQuizById = async (quizId) => {

    const response = await api.get(
        `/quizzes/${quizId}`
    );

    return response.data;
};


export const updateQuiz = async (
    quizId,
    quizData
) => {

    const response = await api.put(
        `/quizzes/${quizId}`,
        quizData
    );

    return response.data;
};


export const deleteQuiz = async (quizId) => {

    const response = await api.delete(
        `/quizzes/${quizId}`
    );

    return response.data;
};