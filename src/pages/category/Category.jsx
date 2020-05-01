import React,{Component} from "react"
import { Card,Table,Button,Modal,message } from 'antd';
import { PlusOutlined,ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from "../../components/link-button"
import AddForm from "./AddForm"
import UpdateForm from "./UpdateForm"

import { reqCategorys,reqAddCategory,reqUpdateCategory } from "../../api"


export default class Category extends Component{
    state = {
        categorys:[],
        subCategorys:[],
        showModelStatus:0,   //0为不显示弹窗，1为添加分类弹窗，2为修改弹窗
        parentId:'0',   //当前显示的父id
        parentName:'' ,
        isLoading:false  
    }
    componentWillMount(){
        this.initColumn()
    }
    componentDidMount(){
       this.getCategorys() 
    }
    //初始化表格的列数据
    initColumn = () => {
        this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
                title: '操作',
                width:300,
                render:(category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => {this.showSubCategorys(category)}}>查看子分类</LinkButton> : null
                        }
                        
                    </span>
                )
              },
          ];
    }
    //获取表格数据，可能是一级，也可能是二级
    getCategorys = async(parentId) => {
        parentId = parentId || this.state.parentId
        this.setState({
            isLoading:true
        })
        const result = await reqCategorys(parentId)
        const categorys = result.data;
        this.setState({
            isLoading:false
        })
        if(result.status === 0){
            if(parentId === '0'){
                this.setState({
                    categorys
                })
            }else{
                this.setState({
                    subCategorys:categorys
                })
            }
        }else{
            message.error("获取分类数据失败")
        }
    }
    //显示二级分类信息
    showSubCategorys = (category) => {
        this.setState({
            parentId:category._id,
            parentName:category.name
        },() => {
            console.log(this.state.parentId,"hhhhh")
            this.getCategorys()
        })
    }
    //显示一级分类信息
    showCategory = () => {
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }
    //关闭弹窗
    handleCancel = () => {
        if(this.updateForm){
            this.updateForm.current.resetFields(["categoryName"])
        }
        if(this.addForm){
            this.addForm.current.resetFields(["parentId"])
        }
        this.setState({
            showModelStatus:0
        })
        
    }
    //添加分类
    showAdd = () => {
        this.setState({
            showModelStatus:1
        })
    }
    addCategory = () => {
        this.addForm.current.validateFields().then(async(values) => {
            this.setState({
                showModelStatus:0
            })
            //若不通过表单验证，可以这样获取
            //const {parentId,categoryName} = this.addForm.current.getFieldsValue();
            const {parentId,categoryName} = values;
            const result = await reqAddCategory(categoryName,parentId)
            console.log(result)
            if(result.status === 0){
                if(parentId === this.state.parentId){
                    this.getCategorys()
                }else if(this.state.parentId !== '0' && parentId === "0"){  
                    //在二级分类下添加一级分类，需要重新获取数据，因为面包屑的返回没有重新获取数据
                    //更新但是不需要显示一级列表，所以不能修改parentId
                    this.getCategorys("0")
                }
            }
        }).catch(err=>{
            console.log(err)
        })  
    }
    //修改分类
    showUpdate = (category) => {
        
        this.category = category
        this.setState({
            showModelStatus:2
        })
    }
    updateCategory = () => {
        //要先进行表单验证
        this.updateForm.current.validateFields().then(async(values) => {
            this.setState({
                showModelStatus:0
            })
            const categoryId = this.category._id
            const {categoryName} = values;
           
            const result = await reqUpdateCategory({categoryName,categoryId})
            
            if(result.status === 0){
                this.getCategorys()
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render(){
        const {categorys,subCategorys,parentId,parentName,isLoading} = this.state

        const categoryName = (this.category && this.category.name) || ''
        
        
        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight:10}} />
                <span>{parentName}</span>
            </span>
        )
        const extra = <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
                        添加
                    </Button>                    

        return <Card title={title} extra={extra}>
                    <Table dataSource={parentId === '0' ? categorys : subCategorys} 
                           columns={this.columns} 
                           bordered
                           loading={isLoading}
                           pagination={{defaultPageSize:5,showQuickJumper:true}}
                           rowKey="_id" />
                    <Modal
                        title="添加分类"
                        visible={this.state.showModelStatus === 1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                        >
                        <AddForm getForm={(from) => {this.addForm = from}}
                                 categorys={categorys}
                                 parentId={parentId}
                         />
                    </Modal>
                    <Modal
                        title="修改分类"
                        visible={this.state.showModelStatus === 2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                        >
                        <UpdateForm categoryName={categoryName} getUpdateForm = {(from) => {this.updateForm = from}}  />
                    </Modal>
                </Card>
    }
}