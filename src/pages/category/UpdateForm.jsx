import React,{Component} from "react"
import PropTypes from "prop-types"
import { Form, Input } from 'antd';


export default class UpdateForm extends Component{
  static propTypes = {
    categoryName:PropTypes.string.isRequired,
    getUpdateForm:PropTypes.func.isRequired
  }

  formRef = React.createRef();

  componentDidMount(){
    this.props.getUpdateForm(this.formRef)

    this.formRef.current.setFieldsValue({
      categoryName: this.props.categoryName,
    });
  }
  componentWillReceiveProps(newProps){
    //每次都要重新赋值一下，否则显示的还是上次德尔
    this.formRef.current.setFieldsValue({
      categoryName: newProps.categoryName,
    });
  }
  render(){
    const {categoryName} = this.props
    return <Form ref={this.formRef}  >
            <Form.Item name="categoryName"   rules={[{ required: true,message:"请输入分类名称!" }]} >
              <Input type="text" placeholder="请输入分类名称"  />
            </Form.Item>
            
          </Form>
  }
}