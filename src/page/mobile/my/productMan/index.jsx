import React from 'react';
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import { WhiteSpace, Flex, Tabs, ListView, List, Badge, Icon, TextareaItem, Drawer, Picker, Button, DatePicker, SwipeAction, Toast } from 'antd-mobile'; //这里引入ant-mobile的组件
import Layout from "../../../../common/layout/layout.jsx";
// import SearchNavBar from "../../../../components/search/index.jsx";
import myApi from "../../../../api/my.jsx";
import { getServerIp } from "../../../../config.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import PropTypes from "prop-types";
import "./index.less";
import {LocalStorageManager} from "../../../../manager/StorageManager.jsx";

/**
 * @ListView 使用了一些react-native中ListView的API，可以查询 https://mobile.ant.design/components/list-view-cn/
 * @ListView.dataSource 同上，查询 https://reactnative.cn/docs/0.26/listviewdatasource.html
 */

var hasMore = true;
const NUM_SECTIONS = 1;
const NUM_ROWS_PER_SECTION = 10;
let pageIndex = 0;

let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

const productStatus = [
    {
        label: '本店产品',
        value: 0,
    },
    {
        label: '未代售产品',
        value: 1,
    },
    {
        label: '已代售产品',
        value: 2,
    },
];

export default class ProductMan extends React.Component {

    constructor(props, context) {
        super(props, context);
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            open: false,
            productManData: [],

            dataSource,
            isLoading: true,
            // ascChoose: true,
            tabIndex: 0,
            // productStatus: "",
            // specialtyName: "",
            height: document.documentElement.clientHeight * 3 / 4,

            searchValue: {
                productStatus: [0],
                specialtyName: "",
            },
        };
    }

    componentWillMount() {
        console.groupCollapsed("产品列表页");

        localStorage.setItem("searchCondition", this.state.searchValue);

        if(localStorage.getItem("modifySpecificationList")){
            localStorage.removeItem("modifySpecificationList");
        }

        if(localStorage.getItem("modifybasic")){
            localStorage.removeItem("modifybasic");
        }

        this.requestSearchResults(this.state.searchValue, 1, 10);
        hasMore = true;
        pageIndex = 0;
        dataBlobs = {};
        sectionIDs = [];
        rowIDs = [];
        // this.requestProductManData(1, 10, 0);
        let stateObj = {
            foo: "title",
        };
        console.log("进到修改地址",history)

            
        history.pushState(stateObj, "title", "#/my");
        history.pushState(stateObj, "title", "#/my/productMan");
        
    }

    componentDidMount() {
        // you can scroll to the specified position
        // setTimeout(() => this.lv.scrollTo(0, 120), 800);

        //fixed id length bug
        // sectionIDs = [];
        // rowIDs = [];
        // pageIndex = 0;
        // dataBlobs = {};

        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.setState({
            height: hei,
        });
        // simulate initial Ajax
        setTimeout(() => {
            this.genData();
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            //     isLoading: false,
            //     height: hei,
            // });
            //console.log(dataBlobs)
        }, 500);
    }

    componentWillUnmount() {
        console.groupEnd();
    }

    requestSearchResults(value, page, rows) {
        console.log('value', value);
        const uid = LocalStorageManager.getUid();
        myApi.getProductManList(uid, value.productStatus[0], value.specialtyName, page, rows, (rs) => {
            if (rs && rs.success) {
                const results = rs.obj.rows;

                let numlist = (rs.obj.pageNumber - 1) * 10 + rs.obj.rows.length;
                console.log("asdfsdafds",hasMore,numlist,rs.obj.total)
                if (numlist === rs.obj.total) {
                    hasMore = false;
                }
                else{
                    hasMore = true;
                }
                console.log("asdfsdafds",hasMore,numlist,rs.obj.total)
                let reData = results;
                // console.log('reData1', reData)
                let pIndex = page - 1;
                for (let i = 0; i < 1; i++) {
                    let ii = (pIndex * 1) + i;
                    let sectionName = `Section ${ii}`;
                    // console.log('666', sectionName, sectionIDs.indexOf(sectionName))
                    if (sectionIDs.indexOf(sectionName) == -1)
                        sectionIDs.push(sectionName);
                    dataBlobs[sectionName] = sectionName;
                    rowIDs[ii] = [];

                    for (let jj = 0; jj < 10; jj++) {
                        let rowName = `S${ii}, R${jj}`;
                        rowIDs[ii].push(rowName);
                        dataBlobs[rowName] = reData[jj];
                    }
                }
                sectionIDs = [...sectionIDs];
                rowIDs = [...rowIDs];
                // console.log('199199', dataBlobs, sectionIDs, rowIDs)

                var getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
                var getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

                var dataSource_tem = new ListView.DataSource({
                    getRowData,
                    getSectionHeaderData: getSectionData,
                    rowHasChanged: (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
                });

                var fineData;
                if (page === 1)
                    fineData = dataSource_tem.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs)
                else
                    fineData = this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs)
                // console.log('fine', fine)
                this.setState({
                    productManData: results,
                    dataSource: fineData,
                    isLoading: false,
                });

            }
        });
    }

    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (!hasMore) {
            return;
        }
        // console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.genData(++pageIndex);
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            //     isLoading: false,
            // });
        }, 500);
    };

    addMore() {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (!hasMore) {
            console.log("asdfsad没有了")
            return;
        }
        // console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.genData(++pageIndex);
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            //     isLoading: false,
            // });
        }, 500);
    };

    genData(pIndex = 0) {
        this.requestSearchResults(this.state.searchValue, pIndex + 1, 10);
    }



    onOpenChange = (...args) => {
        this.setState({ open: !this.state.open });
    };


    onChangeProductStatusValue = (value) => {
        console.log("onChangeProductStatusValue", value)
        let search_v = this.state.searchValue;
        search_v.productStatus = value;
        this.setState({
            searchValue: search_v,
        });
    };

    onChangeSpecialtyNameValue = (value) => {
        let search_v = this.state.searchValue;
        search_v.specialtyName = value;
        this.setState({
            searchValue: search_v,
        });
    };

    clearAll = () => {
        let search_v = {};
        search_v.productStatus = '';
        search_v.specialtyName = '';
        this.setState({
            searchValue: search_v,
        });
    };

    filter_fin = () => {
        console.log("asdfsadenenn",this.state.searchValue);
        pageIndex = 0
        dataBlobs = {};
        sectionIDs = [];
        rowIDs = [];
        this.setState({
            productManData: [],
            dataSource: '',
            isLoading: false,
        });
        this.genData();
        this.onOpenChange();
    };

    addProductHandle() {
        this.context.router.history.push({ pathname: '/my/productMan/add' });
    }

    linkTo(link) {
        this.context.router.history.push(link);
    }

    //编辑产品
    editHandler(id,type) {
        this.context.router.history.push({ pathname: '/my/productMan/modify', params: { id: id,type:type, isEdit: true } });
    }
    //查看产品
    detailHandler(id,type) {
        this.context.router.history.push({ pathname: '/my/productMan/modify', params: { id: id, type: type,isEdit: false } });
    }
    //代售产品
    sellHandler(id) {
        myApi.sellProductHandler(LocalStorageManager.getUid(), id, (rs) => {
            if (rs && rs.success) {
                Toast.info('代售成功！', 1);
                // this.context.router.history.push({ pathname: '/my/productMan' });
                // this.requestSearchResults(this.state.searchValue, 1, 10);
                history.go(0)
            }
            else {
                // Toast.info(rs.msg, 1);
                Toast.offline('代售产品失败');
            }
        });
        this.requestSearchResults(this.state.searchValue, 1, 10);
    }

    render() {

        const tabs = [
            { title: '设置筛选条件>', sub: 'default' },
        ];

        const Badgestyle = {
            marginLeft: 12,
            padding: '0 3px',
            backgroundColor: '#fff',
            borderRadius: 2,
            color: '#f19736',
            border: '1px solid #f19736',

        };

        const searchdata = this.state.searchValue;

        const proCard = (obj) => {
            // console.log("obj", obj)
            return <div style={{ display: 'flex', padding: '15px 0' }}>
                <img style={{ height: '5rem', width: '5rem', marginRight: '2rem' }} src={"http://" + getServerIp() + obj.iconURL.mediumPath} />
                <div style={{ lineHeight: 1, color: 'black', textAlign: 'left' }}>
                    <div style={{ marginBottom: 10, fontWeight:'bold' }}>{obj.name}</div>
                    <div style={{ marginBottom: 10 }}><span style={{ color: 'darkorange' }}>￥{obj.platformPrice}元</span></div>
                    <div style={{ marginBottom: 10 }}>总销量：<span style={{ color: 'darkorange' }}>{obj.hasSold}</span></div>
                    <div style={{ marginBottom: 10 }}>代理分成金额：<span style={{ color: 'darkorange' }}>{obj.divideMoney}</span></div>
                </div>
            </div>
        };

        const viewButton = (obj) => {
            return {
                text: '查看',
                onPress: () => this.detailHandler(obj.id, obj.type),
                style: { backgroundColor: '#F4333C', color: 'white', width: '100%' },
            }
        };

        const editButton = (obj) => {
            return {
                text: '编辑',
                onPress: () => this.editHandler(obj.id, obj.type),
                style: { backgroundColor: '#ddd', color: 'white', width: '100%' },
            }
        };

        const sellButton = (obj) => {
            return {
                text: '代售',
                onPress: () => this.sellHandler(obj.id),
                style: { backgroundColor: '#FF8C00', color: 'white', width: '100%' },
            }
        };

        const data = this.state.productManData;
        // console.log("this.state", this.state);

        let index = data.length - 1;
        const row = (rowdata, sectionID, rowID) => {
            // console.log("rowdata**********", rowdata);
            if (index < 0) {
                index = data.length - 1; //这是使它循环的原因
                //hasMore = false;
                return null
            }
            const obj = rowdata;
            // const obj = data[index--];
            // console.log("obj", obj);

            // console.log(" sectionID rowID",sectionID,rowID);

            if (obj) {
                //specialtyType=0 时为自有产品，控制按钮显示“编辑”&“查看”
                //specialtyType=1 时为未代售产品，控制按钮显示“查看”&“代售”
                //specialtyType=2 时为已代售产品，控制按钮显示“查看”
                return <div key={rowID} style={{ padding: '0 0 0 15px' }}>
                    {
                        obj.specialtyType === 0 ?
                            <SwipeAction
                                autoClose
                                right={[ editButton(obj), viewButton(obj) ]}
                            >
                                {proCard(obj)}
                            </SwipeAction>
                            :
                            obj.specialtyType === 1 ?
                                <SwipeAction
                                    autoClose
                                    right={[ viewButton(obj), sellButton(obj) ]}
                                >
                                    {proCard(obj)}
                                </SwipeAction>
                                :
                                <SwipeAction
                                    autoClose
                                    right={[ viewButton(obj) ]}
                                >
                                    {proCard(obj)}
                                </SwipeAction>
                    }
                </div>
            }
            else {
                // return(<div></div>);
                return null;
            }
        };

        const sidebar = (<List>
            {
                [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i, index) => {
                    var tem;
                    switch (index) {
                        case 0:
                            tem = (
                                <List key={index} className="picker-list">
                                    <Picker
                                        data={productStatus}
                                        cols={1}
                                        className="forss"
                                        value={this.state.searchValue.productStatus}
                                        onChange={this.onChangeProductStatusValue}
                                    >
                                        <List.Item arrow="horizontal">产品类型</List.Item>
                                    </Picker>
                                </List>
                            );
                            break;
                        case 1:
                            tem = (<List key={index} >
                                <TextareaItem
                                    title="商品名称"
                                    placeholder="填入商品名称"
                                    data-seed="logId"
                                    autoHeight
                                    value={this.state.searchValue.specialtyName}
                                    onChange={this.onChangeSpecialtyNameValue}
                                />
                            </List>);
                            break;
                        case 2:
                            tem = (<List key={index} >
                                <List.Item>
                                    <Button size="small" inline style={{ marginLeft: '5px', float: 'right' }} onClick={this.clearAll}>清空</Button>
                                    <Button type="primary" size="small" inline style={{ marginLeft: '5px', float: 'right' }} onClick={this.filter_fin}>查询</Button>

                                </List.Item>

                            </List>);
                            break;
                        // case 3:
                        //     tem = (<List key={index} >
                        //         <Button style={{ marginTop: '10px' }} onClick={this.clearAll}>清空</Button>
                        //     </List>);
                        //     break;
                        default:
                            break;
                    }

                    return tem;
                })

            }
        </List>);

        return <Layout header={false} footer={false}>
            <Navigation title="产品管理" left={true} backLink="/my"/>
            <WhiteSpace size="xs" />
            <div style={{ borderBottom: '2px solid #f19736', backgroundColor: 'white', color: '#f19736', fontSize: 'bold' }}>
                <Flex>
                    {/* <Flex.Item style={{ flex: '0 0 4%', marginRight: '0.4rem' }}>
                        <img src='./images/category/菜篮子.png'
                            style={{ width: '90%', margin: '0.4rem' }} />
                    </Flex.Item> */}
                    <Flex.Item>
                        <Button type="primary" size="small" style={{ margin: '5px', width: '100px' }} onClick={() => { this.addProductHandle() }} >+新建</Button>
                    </Flex.Item>
                </Flex>

            </div>
                    {console.log("asdfsad",this.state)}
            <div className="search_container">
                <Tabs tabs={tabs}
                    initialPage={this.state.tabIndex}
                    useOnPan={false}
                    onTabClick={this.onOpenChange}
                // className="search_tabs"
                >
                </Tabs>
            </div>

            <Drawer
                className="my-drawer"
                style={{ minHeight: document.documentElement.clientHeight }}
                contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
                sidebar={sidebar}
                //open={this.state.open}
                docked={this.state.open}
            // onOpenChange={this.onOpenChange}

            >

                <List>
                    <List.Item wrap={true}>
                        当前条件:
                        {searchdata.productStatus == "" ? "" : <Badge text={searchdata.productStatus[0] == 0 ? "本店产品" : (searchdata.productStatus[0] == 1 ? "未代售产品" : "已代售产品")} style={Badgestyle} />}
                        {searchdata.specialtyName == "" ? "" : <Badge text={"产品名称:" + searchdata.specialtyName} style={Badgestyle} />}
                    </List.Item>
                </List>

                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ height: '10%', textAlign: 'center' }}>
                        {this.state.isLoading ? '加载中...' : (hasMore ? '加载完成' : '没有更多信息')}
                        {/* <div className='addMore' onClick={() => this.addMore()}>加载更多</div> */}
                    </div>)}
                    renderBodyComponent={() => <MyBody />}
                    renderRow={row}//从数据源(data source)中接受一条数据，以及它和它所在section的ID。返回一个可渲染的组件来为这行数据进行渲染。
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                    pageSize={10} //每次事件循环（每帧）渲染的行数
                    scrollRenderAheadDistance={500} //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached} //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                    onEndReachedThreshold={10} //调用onEndReached之前的临界值，单位是像素
                />

            </Drawer>

        </Layout>
    }

}

function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{ display: 'none' }}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}



ProductMan.contextTypes = {
    router: PropTypes.object.isRequired
};