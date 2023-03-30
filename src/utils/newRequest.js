import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://clever-clam-visor.cyclic.app/api/",
  withCredentials: false,
});

export default newRequest;
