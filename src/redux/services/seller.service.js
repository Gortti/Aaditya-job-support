import axios from "axios";
import { authHeader, multipartHeader } from "./auth-header";

const getAll = (
  all = false,
  keyword = "",
  page = "",
  perPage = "",
  active = ""
) => {
  return axios.get(process.env.REACT_APP_API_URL + "seller/list", {
    headers: authHeader(),
    data: {},
    params: {
      all: all,
      keyword: keyword,
      page: page,
      perPage: perPage,
      isActive: active,
    },
  });
};

const get = (id) => {
  return axios.get(process.env.REACT_APP_API_URL + `seller/view/${id}`, {
    headers: authHeader(),
    data: {},
  });
};

const create = (data) => {
  return axios.post(process.env.REACT_APP_API_URL + `user/create`, data, {
    headers: multipartHeader(),
  });
};

const update = (id, data) => {
  return axios.put(process.env.REACT_APP_API_URL + `seller/update/${id}`, data, {
    headers: authHeader(),
  });
};

const updateStatus = (id, data) => {
  return axios.put(
    process.env.REACT_APP_API_URL + `seller/updateStatus/${id}`,
    data,
    {
      headers: authHeader(),
    }
  );
};

const accountApproval = (id, data) => {
  return axios.put(
    process.env.REACT_APP_API_URL + `seller/acc-action/${id}`,
    data,
    {
      headers: authHeader(),
    }
  );
};

const deleteUser = (id, data) => {
  return axios.delete(process.env.REACT_APP_API_URL + `seller/delete/${id}`, {
    headers: authHeader(),
    data: data,
  });
};

const restore = (id, data) => {
  return axios.get(process.env.REACT_APP_API_URL + `seller/restore/${id}`, {
    headers: authHeader(),
    data: data,
  });
};

const uploadDoc = (formImage) => {
  return axios.post(process.env.REACT_APP_API_URL + `seller/upload/document`, formImage, {
    headers: multipartHeader(),
  })
}

export default {
  getAll,
  get,
  create,
  update,
  updateStatus,
  deleteUser,
  restore,
  accountApproval,
  uploadDoc,
};
