// src/providers/dataProvider.ts
import { DataProvider } from "@refinedev/core";
import { axiosInstance , API_URL } from "./axios";
// Base dataProvider (from refine-simple-rest, refine-nestjs, etc.)
import dataProvider from "@refinedev/simple-rest";
import * as pkg from "@refinedev/simple-rest";

const API_URL = "http://localhost:8000";
const base = dataProvider(API_URL, axiosInstance);
export const mydataProvider: DataProvider = {
  ...base,
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { current = 1, pageSize = 10 } = pagination ?? {};

    try{
        const response = await axiosInstance.get(`/${resource}`, {
      params: {
        page: current,
        size: pageSize,
        // filters, sorters can be mapped here if your API supports it
      },
    });

    return {
      data: response.data.items ?? response.data, // for endpoints like /users, /leads
      total: response.data.total ?? response.data.length,
    };
    }catch(error){
        console.error(`❌ Error in getList -> resource: "${resource}"`, error);
      throw error;
    }
  },

  // 🔹 GET ONE
  getOne: async ({ resource, id }) => {
    // console.log(pkg);
    const response = await axiosInstance.get(`/${resource}/${id}`);
    return { data: response.data };
  },

  // 🔹 CREATE
  create: async ({ resource, variables }) => {
    try{
        const response = await axiosInstance.post(`/${resource}`, variables);
    return { data: response.data };
    } catch(error){
        console.error(`❌ Error in getList -> resource: "${resource}"`, error);
      throw error;
    }
  },

  // 🔹 UPDATE
  update: async ({ resource, id, variables }) => {
    try{
        const response = await axiosInstance.put(`/${resource}/${id}`, variables);
    return { data: response.data };
    }catch(error){
        console.error(`❌ Error in getList -> resource: "${resource}"`, error);
      throw error;
    }
  },

  // 🔹 DELETE
  deleteOne: async ({ resource, id }) => {
    try{
        const response = await axiosInstance.delete(`/${resource}/${id}`);
    return { data: response.data };
    }catch(error){
        console.error(`❌ Error in getList -> resource: "${resource}"`, error);
      throw error;
    }
  },

  // 🔹 CUSTOM (for APIs like /auth/login, /analytics/dashboard, etc.)
  custom: async ({ url, method, headers, meta, payload, query }) => {
    const response = await axiosInstance.request({
      url,
      method,
      headers,
      data: payload,
      params: query    ,
    });

    return { data: response.data };
  },

  // Optional
  getApiUrl: () => API_URL,
};
