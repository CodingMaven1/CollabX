import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.headers.common = {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWE2YmIzODgzMjQxYjRjMTAzNTk3ZGYiLCJpYXQiOjE1ODgwODA4OTB9.0nhd38rm2l9AU6vdJ1uEa_As_U2e3BEHta7UicGxhmQ`}

export default axios;