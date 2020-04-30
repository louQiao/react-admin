//因为原生的有些浏览器不支持，可以使用store库，安装 yarn add store，语法更简洁
import store from "store"
const USER_KEY = "user_key"

export default {
    saveUser(user){
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },
    getUser(){
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },
    removeUser(){
        //localStorage.removeItem(USER_KEY)
        return store.remove(USER_KEY)
    }
}