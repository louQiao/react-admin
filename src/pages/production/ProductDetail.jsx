import React,{Component} from "react"
import { Card,List } from 'antd';
import { ArrowLeftOutlined  } from '@ant-design/icons'; 
import LinkButton from "../../components/link-button/index"
const logo = require("../../assets/images/logo.png")

const {Item} = List;

export default class ProductDetail extends Component{

  render(){
    const {name,desc,price} = this.props.location.state
    const title =(
      <span>
        <LinkButton>
          <ArrowLeftOutlined style={{marginRight:15}} onClick={() => this.props.history.goBack()} />
        </LinkButton>
        <span>返回</span>
      </span>
    )
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="left">商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格：</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className="left">所属分类：</span>
            <span>bbbbb</span>
          </Item>
          <Item>
            <span className="left">商品图片：</span>
            <span>
              <img src={logo} className="product-img" />
              <img src={logo} className="product-img" />
            </span>
          </Item>
          <Item>
            <span className="left">商品详情：</span>
            <span dangerouslySetInnerHTML={{__html:'<h1 style="color:red">呵呵呵呵呵呵呵呵</h1>'}}>
            </span>
          </Item>
        </List>
      </Card>
    )
  }
}