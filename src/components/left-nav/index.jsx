import React,{Component} from "react"
import {Link,withRouter} from "react-router-dom"
import "./index.less"
import logo from "../../assets/images/logo.png"
import { Menu } from 'antd';

import  * as Icon from '@ant-design/icons';
import menuConfig from "../../config/menuConfig"

const { SubMenu } = Menu;

 class LeftNav extends Component{
    //方法一：使用map方式实现
    getMenuNodesByMap = (menuConfig) => {
        console.log(menuConfig)
      return   menuConfig.map(item => {
            const iconType = item.icon;
            if(item.children){
                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                        {
                            React.createElement(
                                Icon[iconType],
                                {
                                style:{ fontSize: '16px' }
                                }
                            )
                        }
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }else{
                return ( 
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                        {
                            React.createElement(
                                Icon[iconType],
                                {
                                style:{ fontSize: '16px' }
                                }
                            )
                        }
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }
        })
    }
//方法二，通过reduce方法，初始是空数组[]，不断往里边push进Menu.Item或SubMenu最后返回pre
    getMenuNodes = (menuConfig) => {
        const path = this.props.location.pathname;
        return menuConfig.reduce((pre,item) => {
            const iconType = item.icon;
            if(item.children){
                item.children.find(childItem => {
                    if(path === childItem.key){
                        this.openNode = item.key
                    }
                })
                
                pre.push(
                    (
                        <SubMenu
                            key={item.key}
                            title={
                            <span>
                            {
                                React.createElement(
                                    Icon[iconType],
                                    {
                                    style:{ fontSize: '16px' }
                                    }
                                )
                            }
                                <span>{item.title}</span>
                            </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                )
            }else{
                pre.push(
                    ( 
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                            {
                                React.createElement(
                                    Icon[iconType],
                                    {
                                    style:{ fontSize: '16px' }
                                    }
                                )
                            }
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                )
            }
            return pre
        },[])
    }
    componentWillMount(){
        this.nodes = this.getMenuNodes(menuConfig)
    }

    render(){
        const path = this.props.location.pathname;
        console.log(path,"aa")
        var iconType = 'HomeOutlined';
        return <div>
            <Link to="/" className="left-nav-header">
                <img src={logo} alt="logo"/>
                <h2>后台管理</h2>
            </Link>
            <Menu
                selectedKeys={[path]}
                mode="inline"
                theme="dark"
                defaultOpenKeys={[this.openNode]}
                >
                    {this.nodes}
                
            </Menu>
        </div>
    }
}
//withRouter是高阶组件，包装不是路由组件的组件，返回新组件
//新组件给被包装组件传递三个参数 history、location、match
export default withRouter(LeftNav)