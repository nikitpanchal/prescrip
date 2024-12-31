import axios from "axios/index";
import humps from "humps";
import { AUTH_URL } from "../constants/apis";
import{} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isStagging, staging, prod } from "../../app.json";

const apikey="RXKSIbnjklOp19PIKNnsmkOrosxkWO==";

let authClient = (baseUrl) => {
  let client =axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "apikey" : apikey,
      
    },
    transformResponse: [
      //data => humps.camelizeKeys(JSON.parse(data)),
      data => (JSON.parse(data)),
    ],
  })
  client.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        config.headers.authorization = token
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  );
 return client;
};

const clients = {
  default: {
    client: authClient(isStagging ? staging.baseURL : prod.baseURL),
  },
  
  //metric: perfClient(AUTH_URL)
};


export default clients;
