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
export const getConfiguration = async (type) => {
  try {
    const res = await axios.get(`/api/config?type=${type}`);
    return res.data;
  } catch (err) {
    return null;
  }
};
export const setConfiguration = async (type, data) => {
  try {
    const sendData = JSON.parse(data);
    const res = await axios.post(`/api/config?type=${type}`, sendData);
    return res.data;
  } catch (err) {
    return { error:true, err };
  }
};
export const getSchema = async (type) =>{
  try{
    const data = await axios.get(`/api/config/schema?type=${type}`);
    return data.data;
  }
  catch(err){
    return err;
  }
};
