import React,{Component} from "react"
import {Switch,Route,Redirect} from "react-router-dom"
import ProductHome from "./ProductHome"
import ProductDetail from "./ProductDetail"
import ProductAddUpdate from "./ProductAddUpdate"

export default class Production extends Component{
    render(){
        return (
            <Switch>
                <Route path="/product" component={ProductHome} exact />
                <Route path="/product/detail" component={ProductDetail}  />
                <Route path="/product/add" component={ProductAddUpdate} />
                <Redirect to="/product" />
            </Switch>
        )
    }
}