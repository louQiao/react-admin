import React,{Component} from "react"
import { Card,Button,Table,Modal,message } from "antd"
import { PAGE_SIZE } from "../../utils/const"
import AddRoleForm from "./AddRoleForm"
import AuthTree from "./AuthTree"
import {reqRoles,reqAddRoles,reqUpdateRole} from "../../api/index"
import formatDate from "../../utils/formateDateUtils"
import memoryUtils from "../../utils/memoryUtils"

export default class role extends Component{
    authRef = React.createRef()
    state = {
        roles:[],
        role:{},
        isShowAdd:false,
        isShowAuth:false
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getRoles()
    }
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:formatDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:(auth_time) => formatDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }
    getRoles = async() => {
        const result = await reqRoles()
        console.log(result)
        if(result.status === 0){
            this.setState({
                roles:result.data
            })
        }
    }
    rowClick = role => {
        return {
            onClick:event => {
                this.setState({
                    role
                })
            }
        }
    }
    //添加角色
    addRole = () => {
        this.form.current.validateFields().then(async(values) => {
            this.setState({
                isShowAdd:false
            })
            const {rolename} = values
            this.form.current.resetFields()
            const result = await reqAddRoles(rolename)
            //console.log(result)
            if(result.status === 0){
                message.success("添加角色成功")
                const role = result.data
                this.setState(state => {
                    return {
                        roles:[...state.roles,role]
                    }
                })
            }else{
                message.error("添加角色成功")
            }
        }).catch(err => {
            console.log(err)
        })
    }
    //修改角色
    updateRole = async() => {
        const role = this.state.role;
        const checkedKeys = this.authRef.current.getMenus();
        role.menus = checkedKeys;
        console.log(memoryUtils.user)
        role.auth_name = memoryUtils.user.username;
        role.auth_time = Date.now()
        this.setState({
            isShowAuth:false
        })
        const result = await reqUpdateRole(role)
        if(result.status === 0){
            this.setState({
                roles:[...this.state.roles]
            })
        }
    }
    render(){
        const {roles,role,isShowAdd,isShowAuth} = this.state
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({isShowAdd:true})}>添加角色</Button>&nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={() => this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )
        return <Card title={title}>
            <Table dataSource={roles} 
                   columns={this.columns} 
                   rowSelection={{type:'radio',selectedRowKeys:[role._id]}}
                   onRow = {this.rowClick}
                   bordered 
                   pagination = {{defaultPageSize:PAGE_SIZE}}
                   rowKey="_id" />
            <Modal
                title="添加角色"
                visible={isShowAdd}
                onOk={this.addRole}
                onCancel={() => {
                    this.setState({isShowAdd:false})
                    this.form.current.resetFields()
                }}
            >
                <AddRoleForm addForm={form => this.form = form} />
            </Modal>
            <Modal
                title="设置角色权限"
                visible={isShowAuth}
                onOk={this.updateRole}
                onCancel={() => {
                    this.setState({isShowAuth:false})
                }}
            >
                <AuthTree role={role} ref={this.authRef} />
            </Modal>
        </Card>
    }
}