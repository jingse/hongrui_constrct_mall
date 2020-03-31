import React from "react";
import { Flex, WhiteSpace } from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import Card from "../../../../components/card/index.jsx";
import InfoCard from "./infocard.jsx";
import './index.less';
import myApi from "../../../../api/my.jsx";
import { LocalStorageManager } from "../../../../manager/StorageManager.jsx";

export default class ProfitShare extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,
            profit: [],
            tabIndex: 0,

            headerName: '',
            headerValue: '',
            totalDataList: [],
            dailyDataList: []
        };
    }

    componentWillMount() {
        this.requestData();
    }

    componentDidMount() {
        const type = this.props.location.type;
        switch (type) {
            case 'daily':
                this.setState({
                    headerName: '今日分成总额',
                    headerValue: '￥' + this.props.location.money
                });
                break;
            case 'total':
                this.setState({
                    headerName: '累计分成总额',
                    headerValue: '￥' + this.props.location.money
                });
                break;
            default:
                break;
        }

    }

    requestData() {
        // const uid = LocalStorageManager.getUid();
        const uid = LocalStorageManager.getUid();
        // const webusinessId = (!localStorage.getItem("uid")) ? 26 : parseInt(localStorage.getItem("uid"));
        myApi.getTotalDivideList(uid, (rs) => {
            const data = rs.obj.rows;
            this.setState({
                totalDataList: data
            });
        });

        myApi.getDailyDivideList(uid, (rs) => {
            console.log("自定义”按钮来更改默认的终端 shell",rs);
            const data = rs.obj.rows;
            this.setState({
                dailyDataList: data
            });
        });
    }


    render() {

        let dataList = [];
        console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",this.props);
        if (this.props.location.type === 'daily')
            dataList = this.state.dailyDataList;
        else if (this.props.location.type === 'total')
            dataList = this.state.totalDataList;
        console.log("lulallalallalllalallala", dataList);
        let content = dataList.map((item, index) => {
            console.log("33333333333333333333333333");
            let data = {
                xiadantime: item.orderTime,
                fenchengtime: item.acceptTime,
                // user_name: item.wechatName,
                itemSpecification: item.itemSpecification,
                quantity: item.quantity,
                total_fee: item.totalAmount,
                share_fee: item.weBusinessAmount,
                goods_name: item.itemName,
                originalPrice: item.platformPrice,
            };
            return <InfoCard data={data} key={index} />
        });




        return <Layout header={false} footer={false}>

            <Navigation title="微商分成" left={true} />

            <WhiteSpace size="xs" />


            <Card className="profitshare_infocard">
                <Flex justify="around">
                    <div>{this.state.headerName}</div>
                    <div>{this.state.headerValue}</div>
                </Flex>
            </Card>

            {content}

        </Layout>
    }
}
