import axios from "axios";



const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});



API.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response && error.response.status === 401){
            console.log(error.response?.data?.message || error.message || "Error in Axios");
        }
        return Promise.reject(error);
    }
)

export default API;