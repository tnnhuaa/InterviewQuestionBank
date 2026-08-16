import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const uploadJD = async (file) => {
    const formData = new FormData();
    formData.append('jdFile', file);
    try {
        const response = await api.post('/upload-jd', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
};

export const getSession = async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
};

export const getQuestionBank = async () => {
    const response = await api.get('/question-bank');
    return response.data;
};

export const addQuestionToTopic = async (topicId, data) => {
    const response = await api.post(`/topics/${topicId}/questions`, data);
    return response.data;
};

export const updateQuestion = async (questionId, data) => {
    const response = await api.put(`/questions/${questionId}`, data);
    return response.data;
};

export const deleteQuestion = async (questionId) => {
    const response = await api.delete(`/questions/${questionId}`);
    return response.data;
};

export default api;
