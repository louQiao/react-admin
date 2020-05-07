import React,{Component} from "react"
import { Card,Select,Input ,Button ,Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from "../../components/link-button/index"
import "./product.less"
import { reqSearchProduct,reqProduct } from "../../api/index"

const { Option } = Select;



export default class ProductHome extends Component{
  state = {
    total:0,
    product:[],
    searchName:'',//搜索内容
    searchType:'productName' //按什么搜
  }
  componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getProducts(1)
  }
  getProducts = async(pageNum) => {
    const result = await reqProduct(pageNum,2)
    console.log(result)
    if(result.status === 0) {
      const product = result.data.list;
      this.setState({
        product,
        total:result.data.total
      })
    }
  }
  initColumns(){
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price) => {
          return '¥' + price
        }
      },
      {
        title: '状态',
        width:100,
        dataIndex: 'status',
        render:(status) => {
          return (
            <span>
              <Button type="primary">在售</Button>
              <span>下架</span>
            </span>
          )
        }
      },
      {
        title:'操作',
        width:100,
        render:(product) => {
          return (
            <span>
              <LinkButton onClick={() => {this.props.history.push("/product/detail",product)}}>详情</LinkButton>
              <LinkButton onClick={() => {this.props.history.push("/product/add",product)}}>修改</LinkButton>
            </span>
          )
        }
      }
    ];
  }

  render(){
    const {product,searchType,searchName} = this.state

    const title = (
      <div>
        <Select defaultValue={searchType} style={{width:150}} onChange={value => this.setState({searchType:value})}>
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input placeholder="关键字" style={{width:200,margin:'0 10px'}} onChange={e => this.setState({searchName:e.target.value})} />
        <Button type="primary">搜索</Button>
      </div>
    )
    const extra = (
      <Button type="primary" icon={<PlusOutlined />} onClick={() => {this.props.history.push("/product/add")}}>
        添加商品
      </Button>
    )

    return <Card title={title} extra={extra} >
    <Table dataSource={product} 
           columns={this.columns} 
           bordered 
           rowKey="_id" 
           pagination={{total:this.state.total,pageSize:2,onChange:(newPage)=>{this.getProducts(newPage)}}}
             />
  </Card>
  }
}