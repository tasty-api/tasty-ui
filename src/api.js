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

export const fetchTests = async (filters) => {
  try {
    const res = await axios.get('/api/tests/', {
      params: { filters },
    });

    return res.data;
  } catch (err) {
    return null;
  }
};

export const runTests = async (filters) => {
  try {
    const res = await axios.post('/api/test', {
      data: filters,
    });

    return res.data;
  } catch (err) {
    return null;
  }
};

export const getStatus = async () => {
  try {
    const res = await axios.get('/api/status');

    return res.data;
  } catch (err) {
    return null;
  }
};

export const getLog = async () => {
  try {
    const res = await axios.get('/api/log');

    return res.data;
  } catch (err) {
    return null;
  }
};

export const getStats = async () => {
  try {
    const res = await axios.get('/api/stats');

    return res.data
  } catch (err) {
    return null;
  }
};
