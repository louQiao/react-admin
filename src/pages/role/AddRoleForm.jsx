import React,{Component} from "react"
import { Form, Input } from 'antd'; 
const {Item} = Form

export default class AddRoleForm extends Component {
  formRef = React.createRef()

  componentWillMount(){
    this.props.addForm(this.formRef)
  }
  onFinish = () => {

  }
  render(){
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form
        ref={this.formRef}
        initialValues={{ rolename: '' }}
        onFinish={this.onFinish}
      >
        <Item
          {...layout}
          label="角色名称"
          name="rolename"
          rules={[{ required: true, message: '角色名称不能为空!' }]}
        >
          <Input />
        </Item>
      </Form>
    )
  }
}