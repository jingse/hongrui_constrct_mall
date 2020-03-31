import React from 'react';
import { InputItem, WhiteSpace, List, Picker, Checkbox, Toast} from 'antd-mobile';
import Card from "../../../../../components/card/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import Navigation from "../../../../../components/navigation/index.jsx"
import './index.less';
import PropTypes from 'prop-types';

export default class AddSpecification extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            specification: '',
            marketPrice: '',
            costPrice: '',
            platformPrice: '',
            vInboundNumber: '',
            deliverPrice: '',
        };
    }

    componentWillMount() {
       
    }
    onReceiveSpecification = (value) =>{
        this.setState({
            specification: value,
        });
    };
    onReceiveMarketPrice = (value) =>{
        this.setState({
            marketPrice: value,
        });
    };
    onReceiveCostPrice = (value) =>{
        this.setState({
            costPrice: value,
        });
    };
    onReceiveSalePrice = (value) =>{
        this.setState({
            platformPrice: value,
        });
    };
    onReceiveVInboundNumber = (value) =>{
        this.setState({
            vInboundNumber: value,
        });
    };
    onReceiveDeliverPrice = (value) =>{
        this.setState({
            deliverPrice: value,
        });
    };

    addInformation(){
        if(this.state.specification==''||this.state.marketPrice==''||this.state.costPrice==''||
            this.state.platformPrice==''||this.state.vInboundNumber==''){
                Toast.fail("有信息未填写！",3,null,true);
            }
        else{
            var passuser={
                "specification":this.state.specification,
                "marketPrice": parseFloat(this.state.marketPrice),
                "costPrice": parseFloat(this.state.costPrice),
                "platformPrice": parseFloat(this.state.platformPrice),
                "vInboundNumber": parseFloat(this.state.vInboundNumber),
                "deliverPrice": parseFloat(this.state.deliverPrice),
            }
            {console.log("哈哈哈", passuser);}

            var temp = JSON.parse(localStorage.getItem("modifySpecificationList"))
            console.log("temp",temp)
            temp.push(passuser)
            console.log("ahsfkhsadf",temp);
            localStorage.setItem("modifySpecificationList",JSON.stringify(temp))
            this.context.router.history.push({ pathname: '/my/productMan/modify',params: { id: this.props.location.myid,isEdit: true} });
        }
    }

    render(){
        return <div>
            {console.log("得到的", this.props)}
            {console.log("现在的state", this.state)}
            <Navigation title="添加包装规格"/>
            <WhiteSpace/>
            <Card>
            <InputItem clear placeholder="例如：个、个*2" value={this.state.specification} onChange={this.onReceiveSpecification}>规格</InputItem>
            <InputItem clear placeholder="例如：10" value={this.state.marketPrice} onChange={this.onReceiveMarketPrice} type='digit'>市场价</InputItem>
            <InputItem clear placeholder="例如：10" value={this.state.costPrice} onChange={this.onReceiveCostPrice} type='digit'>成本价</InputItem>
            <InputItem clear placeholder="例如：10" value={this.state.platformPrice} onChange={this.onReceiveSalePrice} type='digit'>销售价</InputItem>
            <InputItem clear placeholder="例如：10" value={this.state.vInboundNumber} onChange={this.onReceiveVInboundNumber} type='digit'>库存</InputItem>
            {/* <InputItem clear placeholder="例如：10" value={this.state.deliverPrice} onChange={this.onReceiveDeliverPrice} type='digit'>运费</InputItem> */}
            </Card>
            <Submit>
                <div onClick={()=>{this.addInformation()}}>确认添加</div>
            </Submit>
        </div>
    }
}
AddSpecification.contextTypes = {
    router: PropTypes.object.isRequired
};