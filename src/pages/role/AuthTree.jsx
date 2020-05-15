import React,{Component,useState} from "react"
import {Form,Input,Tree} from "antd"
import menuList from "../../config/menuConfig"
const { Item } = Form
const { TreeNode } = Tree


export default class AuthTree extends Component{
  formRef = React.createRef()

  constructor(props){
    super(props)
    const {menus} = props.role
    
    this.state = {
      treeData:[],
      checkedKeys:menus
    }
  }
  componentWillMount(){
    this.getTreeData(menuList)
  }
  componentWillReceiveProps(newProps){
    console.log(newProps)
    //每次都要重新赋值一下，否则显示的还是上次德尔
    this.formRef.current.setFieldsValue({
      rolename: newProps.role.name,
    });
    const {menus} = newProps.role;
    this.state.checkedKeys = menus
  }
  getTreeData = (menuList) => {
    let treeData = [{
      title:"平台权限",
      key:"all",
      children:[...menuList]
    }]
    this.setState({
      treeData
    })
  }
  //点击复选框
  onCheck = checkedKeys => {
    //console.log('onCheck', checkedKeys);
    //this.setCheckedKeys(checkedKeys);
    this.setState({
      checkedKeys
    })
  };
  //获取选中的menu
  getMenus = () => this.state.checkedKeys
 

  render(){
    const { treeData,checkedKeys} = this.state;
    const {role} = this.props;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    return (<Form ref={this.formRef} initialValues={{rolename:role.name}}>
      <Item {...layout}
          label="角色名称"
          name="rolename" >
           <Input disabled  />
      </Item>
      <Tree
        checkable
        defaultExpandAll
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={this.onCheck}
      >
      </Tree>
    </Form>)
  }

}