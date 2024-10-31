import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = "http://10.11.54.19:5000";

const api = axios.create({ baseURL });
// api.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
api.defaults.headers.post["Content-Type"] = "application/json";


// api.interceptors.request.use(async (config) => {
//   const user = await AsyncStorage.getItem("user");
//   if (user) {
//     const parsedUser = JSON.parse(user);
//     config.headers["x-auth-token"] = parsedUser.token;
//   }
//   return config;
// });

const apiRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export { api, apiRequest, baseURL };
