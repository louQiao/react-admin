import React,{Component} from "react"
import { withRouter } from "react-router-dom"
import "./index.less"
import { Modal } from 'antd';

import LinkButton from "../link-button"
import { reqWeather } from "../../api/index.js"
import formateDate from "../../utils/formateDateUtils"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils"
import menuList from "../../config/menuConfig"

class Header extends Component{
    constructor(props){
        super(props)
        this.state = {
            currentTime:formateDate(Date.now()),
            dayPictureUrl:'',
            weather:''
        }
    }
    setTime = () => {
       this.timer =  setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather = async() => {
        const {dayPictureUrl,weather} = await reqWeather("北京")
        this.setState({
            dayPictureUrl,
            weather
        })
    }
    getTitle = () => {
        const path = this.props.location.pathname;
        let title = ""
        menuList.forEach(item => {
            if(item.key === path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => cItem.key === path)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }
    logOut = () => {
        Modal.confirm({
            title: '确定要退出吗?',
            onOk:() => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            }
        })
    }
    componentDidMount(){
        this.setTime()
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }
    render(){
        const {currentTime,dayPictureUrl,weather} = this.state
        const username = memoryUtils.user.username;
        const title = this.getTitle()

        return <div className="header">
            <div className="header-top">
                <span>{username}</span>
                <LinkButton onClick={this.logOut}>退出</LinkButton>
            </div>
            <div className="header-bottom">
                <div className="header-top-left">{title}</div>
                <div className="header-top-right">
                    <span>{currentTime}</span>
                    <img src={dayPictureUrl} alt="weather"/>
                    <span>{weather}</span>
                </div>
            </div>
        </div>
    }
}

export default withRouter(Header)