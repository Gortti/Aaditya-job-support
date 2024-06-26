import axios from "axios";
import { authHeader, multipartHeader } from "./auth-header";

const getAll = (filterText, page, perPage) => {
  return axios.get(process.env.REACT_APP_API_URL + "dispute/list" + `?all=true&page=${page}&perPage=${perPage}`, {
    headers: authHeader(),
    data: {},
    params: {},
  });
};

const createDispute = (transactionId, reason) => {
  let data = { 
    "transactionId": transactionId, 
    "reason": reason 
  }
  return axios.post(process.env.REACT_APP_API_URL + "dispute/create", data, {
    headers: authHeader(),
    params: {},
  });
};

const get = (id) => {
  return axios.get(process.env.REACT_APP_API_URL + `dispute/view/${id}`, {
    headers: authHeader(),
    data: {},
    params: {},
  });
};

const updateStatus = (id, data) => {
  return axios.put(
    process.env.REACT_APP_API_URL + `dispute/updateStatus/${id}`,
    data,
    {
      headers: authHeader(),
    }
  );
};

export default {
  getAll,
  get,
  updateStatus,
  createDispute
};
