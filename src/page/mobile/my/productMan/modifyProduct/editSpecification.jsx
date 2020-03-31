import React from 'react';
import { InputItem, WhiteSpace, List, Picker, Checkbox, Toast} from 'antd-mobile';
import Card from "../../../../../components/card/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import Navigation from "../../../../../components/navigation/index.jsx"
import './index.less';
import PropTypes from 'prop-types';
export default class EditSpecification extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            specification: '',
            marketPrice: '',
            costPrice: '',
            platformPrice: '',
            vInboundNumber: '',
            deliverPrice: '',
            id: '',
        };
    }

    componentWillMount() {
        const information = this.props.location.state;
        const myid = this.props.location.id;
        console.log("myid", myid);
        this.setState({
            specification: information.specification,
            marketPrice: information.marketPrice,
            costPrice: information.costPrice,
            platformPrice: information.platformPrice,
            vInboundNumber: information.vInboundNumber,
            deliverPrice: information.deliverPrice,
            id:myid            
        });  
        console.log("asdfsa", this.state);  
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
            {console.log("哈哈哈",this.props);}
            var leu=JSON.stringify(passuser);

            var temp = JSON.parse(localStorage.getItem("modifySpecificationList"))
            console.log("temp",temp)
            console.log("对比的id",this.props.location.id)

            temp[this.props.location.id].specification = passuser.specification
            temp[this.props.location.id].marketPrice = passuser.marketPrice
            temp[this.props.location.id].costPrice = passuser.costPrice
            temp[this.props.location.id].platformPrice = passuser.platformPrice
            temp[this.props.location.id].vInboundNumber = passuser.vInboundNumber
            temp[this.props.location.id].deliverPrice = passuser.deliverPrice
            console.log("之后的",temp)
            localStorage.setItem("modifySpecificationList",JSON.stringify(temp))
            // history.go(-1);
            this.context.router.history.push({ pathname: '/my/productMan/modify',params: { id: this.props.location.myid,isEdit: true} });

        }
    }

    render(){
        return <div>
            {console.log("得到的", this.props)}
            {console.log("现在的state", this.state)}
            <Navigation title="添加包装规格" />
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

EditSpecification.contextTypes = {
    router: PropTypes.object.isRequired
};