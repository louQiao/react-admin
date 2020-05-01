import ajax from "./ajax"
import jsonp from "jsonp"
import {message} from "antd"

//接口请求函数
const baseURL = "" //不一定是3000还有可能是3001，所以不能写死

export const reqLogin = (username,password) => ajax(baseURL+"/login",{username,password},"POST")

export const reqAdduser = (user) => ajax(baseURL+"/manage/user/add",user,"POST")

//商品分类数据，所有分类，添加分类，修改分类

export const reqCategorys = (parentId) => ajax(baseURL+"/manage/category/list",{parentId})

export const reqAddCategory = (categoryName,parentId) => ajax(baseURL+"/manage/category/add",{categoryName,parentId},'POST')

export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(baseURL+"/manage/category/update",{categoryId,categoryName},'POST')

//jsonp请求天气数据

export const reqWeather = (city) => {
  return new Promise((resolve,reject) => {
    const url =`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url,{},(err,data) => {
      if(!err && data.status ==="success"){
        const {dayPictureUrl,weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl,weather})
      }else{
        message.error("获取天气信息失败")
      }
    })
  })
}