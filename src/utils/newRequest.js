import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://cors-anywhere.herokuapp.com/https://clever-clam-visor.cyclic.app/api/",
  withCredentials: true,
});

export default newRequest;
