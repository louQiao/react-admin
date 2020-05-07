import React,{Component} from "react"
import { Card,Form,Input,Cascader,Button,message } from 'antd';
import { ArrowLeftOutlined  } from '@ant-design/icons';
import LinkButton from "../../components/link-button/index"
import PicturesWall from "./PicturesWall"
import RichTextEditor from "./RichTextEditor"
import { reqCategorys,reqAddorUpdateProd } from "../../api/index"

const {Item} = Form
const { TextArea } = Input;


export default class ProductAddUpdate extends Component{
  state = {
    options : []
  }
  
  formRef = React.createRef();
  constructor(...args){
    super(...args)
    this.pw = React.createRef()
    this.richTE = React.createRef()
  }

  onFinish = async(values) => {
    const imgs = this.pw.current.getImgs()
    const detail = this.richTE.current.getDetail()
    const {name,desc,price,categoryIds} = values;
    let pCategoryId,categoryId
    if(categoryIds.length === 1){
      pCategoryId = '0'
      categoryId = categoryIds[0]
    }else{
      pCategoryId = categoryIds[0]
      categoryId = categoryIds[1]
    } 
    const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
    if(this.isUpdate){
      product._id = this.product._id
    }
    console.log(product)
    const result = await reqAddorUpdateProd(product)
    console.log(result)
    if(result.status === 0){
      message.success(`${this.isUpdate ? '更新' : '添加'}商品成功！`)
      this.props.history.goBack()
    }else{
      message.error(`${this.isUpdate ? '更新' : '添加'}商品失败！`)
    }
    console.log(imgs)
  };
  //验证输入价格
  validatePrice = (rule,value) => {
    if(value*1 > 0){
      return Promise.resolve();
    }else{
      return Promise.reject("价格不能小于0")
    }
  }
  //一级分类
  initCategory = async(categorys) => {
    const options = categorys.map(item => ({
      value: item._id,  //一级分类自身的id
      label: item.name,
      isLeaf: false
    }))
    //获取点击“修改”按钮传过来的值
    const {isUpdate,product} = this
    const { pCategoryId,categoryId} = product;

    if(isUpdate && pCategoryId !== '0'){  //如果pCategoryId不为0，说明肯定选的是二级分类
      const result = await this.getCategorys(pCategoryId) //传入该id来获取该id下的二级分类
      const childOptions = result.map(c => ({     //根据二级分类生成对应的二级列表需要的数据
        label: c.name,
        value: c._id
      }))
      options.map(item => {       //如果某个一级分类和该pCategoryId相等，证明这个二级列表该挂在它身上
        if(item.value === pCategoryId){     
          return item.children = childOptions;
        }
      })
    }
    this.setState({
      options
    })
  }
// 二级分类
  loadData = async(selectedOptions) => {
    const targetOption = selectedOptions[0];
    console.log(targetOption)
    targetOption.loading = true;
    
    const result = await this.getCategorys(targetOption.value)
    targetOption.loading = false;
    if(result.length === 0){
      targetOption.isLeaf = true
    }else{
      targetOption.children = result.map(item => ({
        label: item.name,
        value: item._id
      }))
      //console.log(targetOption)
    }
    this.setState({
      options: [...this.state.options],
    });
  };
  getCategorys = async(parentId) => {
    const result = await reqCategorys(parentId)
    if(result.status === 0){
      const categorys = result.data
      if(parentId === '0'){
        this.initCategory(categorys)
      }else{
        return categorys;
      }
    }
  }
  componentWillMount(){
     const product = this.props.location.state 
     this.isUpdate = !!product //强制转为boolean
     this.product = product || {}

  }
  componentDidMount(){
    this.getCategorys('0')
  }

  render(){
    const {isUpdate,product} = this;
    const { pCategoryId,categoryId,imgs,detail} = product;
    const categoryIds = []
    if(isUpdate){
      if(pCategoryId === '0'){
        categoryIds.push(categoryId)
      }else{
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 9,
      },
    };

    const title = (
      <span>
       <LinkButton>
          <ArrowLeftOutlined style={{marginRight:15}} onClick={() => this.props.history.goBack()} />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span> 
      </span>
    )
    return <Card title={title}>
      <Form {...layout} ref={this.formRef} 
            onFinish={this.onFinish}
            initialValues={{
              name: product.name,
              desc: product.desc,
              price: product.price,
              categoryIds:categoryIds
            }}
      >
        <Item label="商品名称" name="name"
              rules={[{required: true,message: '商品名称不能为空!'}]}>
          <Input placeholder="请输入商品名称" />
        </Item>
        <Item label="商品描述"
              name="desc"
              rules={[{required: true,message: '商品描述不能为空!'}]}
        >
          <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
        </Item>
        <Item label="商品价格"
              name="price"
              rules={[{required: true,message: '商品价格不能为空!'},{validator:this.validatePrice}]}
        >
          <Input type="number"   />
        </Item>
        <Item label="商品分类"
              name="categoryIds"
              rules={[{required: true,message: '必须指定商品分类!'}]}
        >
          <Cascader placeholder="请指定商品分类"
            options={this.state.options}
            loadData={this.loadData}
          />
        </Item>
        <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
        </Item>
        <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
          <RichTextEditor ref={this.richTE} detail={detail} />
        </Item>
        <Item>
          <Button htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Card>
  }
}