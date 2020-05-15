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

//获取商品数据
export const reqProduct = (pageNum,pageSize) => ajax(baseURL + "/manage/product/list",{pageNum,pageSize})
//搜索商品
export const reqSearchProduct = ({pageNum,pageSize,searchName,searchType}) => ajax(baseURL + "/manage/product/search",{
  pageNum,
  pageSize,
  [searchType]:searchName
})

//删除图片
export const reqDeleteImg = (name) => ajax(baseURL + "/manage/img/delete",{name},'POST')

//添加或更新商品
export const reqAddorUpdateProd = (product) => ajax(baseURL + "/manage/product/" + (product._id ? 'update' : 'add'),product,'POST')

//获取角色列表
export const reqRoles = () => ajax(baseURL + "/manage/role/list")
//添加角色
export const reqAddRoles = (roleName) => ajax(baseURL + "/manage/role/add",{roleName},'POST')
//修改角色
export const reqUpdateRole = (role) => ajax(baseURL + "manage/role/update",role,'POST')

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