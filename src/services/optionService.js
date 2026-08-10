import api from "./api";


// =============================
// Create Option
// =============================

export const createOption = async (
    optionData
) => {

    const response = await api.post(
        "/options",
        optionData
    );

    return response.data;
};


// =============================
// Get Options
// =============================

export const getOptionsByQuestionId = async (
    questionId
) => {

    const response = await api.get(
        `/options/${questionId}`
    );

    return response.data;
};


// =============================
// Update Option
// =============================

export const updateOption = async (
    optionId,
    optionData
) => {

    const response = await api.put(
        `/options/${optionId}`,
        optionData
    );

    return response.data;
};


// =============================
// Delete Option
// =============================

export const deleteOption = async (
    optionId
) => {

    const response = await api.delete(
        `/options/${optionId}`
    );

    return response.data;
};