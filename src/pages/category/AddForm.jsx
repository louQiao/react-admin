import React,{Component} from "react"
import PropTypes from "prop-types"
import { Form, Input,  Select } from 'antd';


const { Option } = Select;

export default class AddForm extends Component{
  static propTypes = {
    categorys:PropTypes.array.isRequired,
    parentId:PropTypes.string.isRequired
  }
  
  formRef = React.createRef();

  componentDidMount(){
    //console.log(this.formRef)
    //把from实例传递给父组件
    this.props.getForm(this.formRef)
  }
  componentWillReceiveProps(newProps){
    //每次都要重新赋值一下，否则显示的还是上次德尔
    this.formRef.current.setFieldsValue({
      parentId: newProps.parentId,
    });
  }

  render(){
    const {categorys,parentId} = this.props
    console.log(parentId)
    return <Form ref={this.formRef} initialValues={{parentId:parentId}}>
    <Form.Item name="parentId"  rules={[{ required: true }]} >
      <Select >
        <Option value="0">一级分类</Option>
        {categorys.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>) }
      </Select>
    </Form.Item>
    <Form.Item name="categoryName"  rules={[{ required: true,message: '请输入分类名称!' }]}>
      <Input type="text" placeholder="请输入分类名称" />
    </Form.Item>
    
  </Form>
  }
}