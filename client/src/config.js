import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'https://turismo-israel.herokuapp.com/'
})