import React,{Component} from "react"
import {Redirect} from "react-router-dom"
import "./login.less"

import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from "../../api"

import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils"

const imgsrc = require("../../assets/images/logo.png")

const login  = class Login extends Component{
    validatePwd = (rule,value,callback) => {
        if(!value.trim()){
            return callback("请输入密码")
        }else if(value.length <5){
            return callback("密码需大于4位")
        }else if(value.length >12){
            return callback("密码长度不能大于12位")
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            return callback("密码为字母、数字、下划线组成")
        }else{
            return callback()
        }
    }
    onFinish = async values => {
        
        const {username,password} = values;
        let result = await reqLogin(username,password);
        console.log(result)
        if(result.status === 0){
            message.success("登陆成功")
            storageUtils.saveUser(result.data)
            memoryUtils.user = result.data
            this.props.history.replace("/")
        }else{
            message.error(result.msg)
        }
      };
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };
    render(){
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to="/" />
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={imgsrc} alt=""/>
                    <h1>后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>登陆</h2>
                      <Form
                        className="login-form"
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名!' },
                                    { min: 5, message: '用户名长度必须大于4位' },
                                    { max: 12, message: '用户名长度不能超过12位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message:'用户名为数字、字母、下划线'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ validator: this.validatePwd }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                                />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                            </Button>
                        </Form.Item>
                        </Form>
                </section>
            </div>
        )
    }
}
export default login