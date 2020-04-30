import axios from "axios"
import {message} from "antd"

export default function(url,data={},type="GET"){
    let promise;
    return new Promise((resolve,reject) => {
        if(type === "GET"){
            promise =  axios.get(url,{
                params:data
            })
        }else{
            promise =  axios.post(url,data)
        }

        promise.then(res => {
            resolve(res.data)
        }).catch(err => {
            message.error("请求出错"+err.message)
        })
    })
    
}