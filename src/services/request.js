// @ts-nocheck
import axios from 'axios'
import https from 'https';
import { HOST } from './../constants/url'
import { toast } from 'react-toastify';
import {
  getQueryString,
} from '../helper/common'

function send({
  method = method, path, data = null, query = null, headers = {}, newUrl
}) {
  return new Promise((resolve) => {
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });
    let url = HOST + `${path}${getQueryString(query)}`
    
    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`
      console.log("urllllll222222222", url)
    }
    let token = window.localStorage.getItem('accessToken')
    
    if (token) {
      const newToken = token.replace(/"/g, "");
      headers.Authorization =`Bearer ${newToken}`
    }
    console.log("axiso", url)
    axios({
      method, url, data, headers, httpsAgent: agent
    })
      .then((result) => {
        
        const data = result.data
        return resolve(data)
      })
      .catch((error) => {
        const {response ={}} = error
        
        const result = response.data ? response.data :null
        if (!result) {
          toast.warn("Somethig was wrong")
        }
        else {
          const { statusCode, message: data } = result
          if(statusCode === 505){
            toast.warn("Unauthorized")
          }
         else if (statusCode === 401 && data === 'Expired token received for JSON Web Token validation') {
            window.localStorage.clear()
            window.location.href = '/'
           
          }
          else if (
            (statusCode === 401 && data === 'Unauthorized') || (statusCode === 403 && data === 'InvalidToken')) {
              window.localStorage.clear()
              window.location.href = '/'
            
          }
          else {
            toast.warn(data||"Somethig was wrong")
            return resolve(result.data)
          }
        }
      })
  })
}

  export default {
  send,
}
