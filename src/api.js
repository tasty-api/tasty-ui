import axios from 'axios';

export const fetchReports = async (filters) => {
  try {
    const res = await axios.get('/api/reports', {
      params: { filters },
    });

    return res.data;
  } catch (err) {
    return [];
  }
};

export const fetchReport = async (id) => {
  try {
    const res = await axios.get(`/api/reports/${id}`);

    return res.data;
  } catch (err) {
    return null;
  }
};
