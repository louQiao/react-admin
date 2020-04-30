import React,{Component} from "react"
import {Redirect,Route,Switch} from "react-router-dom"
import memoryUtils from "../../utils/memoryUtils"
import { Layout } from 'antd';
import Leftnav from "../../components/left-nav"
import Header from "../../components/header"
import "./index.less"
import Home from "../home/Home"
import Category from "../category/Category"
import User from "../user/User"
import Role from "../role/Role"
import Bar from "../charts/Bar"
import Pie from "../charts/Pie"
import Line from "../charts/Line"
import Production from "../production/Production"

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component{
    render(){
        //如果内存中没有user表示没有登陆,在render中跳转需要用Redirect
        const user = memoryUtils.user;
        if(!user || !user._id){
            return <Redirect to="/login" />
        }
        return (
            <Layout className="admin-wrapper">
                <Sider>
                    <Leftnav />
                </Sider>
                <Layout>
                    <Header/>
                    <Content>
                        <Switch>
                            <Route path="/home" component={Home} />
                            <Route path="/category" component={Category} />
                            <Route path="/user" component={User} />
                            <Route path="/role" component={Role} />
                            <Route path="/charts/bar" component={Bar} />
                            <Route path="/charts/pie" component={Pie} />
                            <Route path="/charts/line" component={Line} />
                            <Route path="/product" component={Production} />
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
        )
    }
}