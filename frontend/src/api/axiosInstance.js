import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082/api', 
  withCredentials: true, // 🛑 Session Cookies යැවීමට මෙය අත්‍යවශ්‍යයි
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;