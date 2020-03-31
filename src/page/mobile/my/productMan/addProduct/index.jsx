import React from 'react';
import PropTypes from 'prop-types';
import {
    List,
    InputItem,
    WhiteSpace,
    Button,
    Toast,
    Card,
    Tabs,
    Picker,
    TextareaItem,
    ActivityIndicator
} from 'antd-mobile'; //这里引入ant-mobile的组件
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import addIcon from "../../../../../static/images/icons/add.png"; // 这个页面用到的图片
import './index.less';
import {createForm} from 'rc-form';
import myApi from '../../../../../api/my.jsx';

import ImgCropper from "../../../../../components/img_cropper/imgCropper.jsx";
import AnotherImgCropper from "../../../../../components/img_cropper/anotherImgCropper.jsx";
import {LocalStorageManager} from "../../../../../manager/StorageManager.jsx";
import upload from "../../../../../api/upload.jsx";


const tabs = [
    {title: '基本信息', sub: '0'},
    {title: '包装规格', sub: '1'},
    {title: '图文信息', sub: '2'},
];

const isShow = [
    {
        label: '是',
        value: true,
    },
    {
        label: '否',
        value: false,
    },
];

// const categoryList = [{
//     "children": [{"children": [], "label": "国内水果", "value": 2}],
//     "label": "水果专区",
//     "value": 1
// }, {
//     "children": [{"children": [], "label": "杉木山装", "value": 4}],
//     "label": "箱包",
//     "value": 3
// }, {
//     "children": [{"children": [], "label": "帅康电器", "value": 6}],
//     "label": "电器",
//     "value": 5
// }, {
//     "children": [{"children": [], "label": "国内水果区", "value": 8}, {"children": [], "label": "国外水果区", "value": 9}],
//     "label": "水果区",
//     "value": 7
// }, {
//     "children": [{"children": [], "label": "国外玩具区", "value": 11}],
//     "label": "玩具区",
//     "value": 10
// }, {
//     "children": [{"children": [], "label": "国内日用品", "value": 14}, {
//         "children": [],
//         "label": "俄罗斯日用品",
//         "value": 15
//     }, {"children": [], "label": "德国日用品", "value": 16}, {
//         "children": [],
//         "label": "澳洲日用品",
//         "value": 17
//     }, {"children": [], "label": "日本日用品", "value": 18}, {
//         "children": [],
//         "label": "韩国日用品",
//         "value": 19
//     }, {"children": [], "label": "泰国日用品", "value": 20}], "label": "日用品", "value": 12
// }, {
//     "children": [{"children": [], "label": "国内食品酒水", "value": 21}, {
//         "children": [],
//         "label": "国外食品酒水",
//         "value": 22
//     }, {"children": [], "label": "俄罗斯食品酒水", "value": 23}], "label": "食品酒水", "value": 13
// }, {
//     "children": [{"children": [], "label": "韩国化妆品", "value": 25}, {
//         "children": [],
//         "label": "国内化妆品",
//         "value": 26
//     }, {"children": [], "label": "欧美化妆品", "value": 27}, {
//         "children": [],
//         "label": "泰国化妆品",
//         "value": 28
//     }, {"children": [], "label": "日本化妆品", "value": 29}, {
//         "children": [],
//         "label": "俄罗斯化妆品",
//         "value": 30
//     }, {"children": [], "label": "英国BOOTS小黄瓜系列", "value": 48}], "label": "化妆品", "value": 24
// }, {
//     "children": [{"children": [], "label": "泰国皇家乳胶", "value": 32}],
//     "label": "乳胶产品专区",
//     "value": 31
// }, {
//     "children": [{"children": [], "label": "国内饰品", "value": 34}, {"children": [], "label": "国外饰品", "value": 35}],
//     "label": "饰品服饰专区",
//     "value": 33
// }, {
//     "children": [{"children": [], "label": "日本保健品", "value": 37}, {
//         "children": [],
//         "label": "国内保健品",
//         "value": 38
//     }, {"children": [], "label": "澳洲Bio Island保健品区", "value": 39}, {
//         "children": [],
//         "label": "澳洲Healthy Care保健品区",
//         "value": 40
//     }, {"children": [], "label": "澳洲Blackmores保健品区", "value": 41}, {
//         "children": [],
//         "label": "澳洲swisse保健品区",
//         "value": 42
//     }, {"children": [], "label": "澳洲保健品区", "value": 43}, {
//         "children": [],
//         "label": "泰国保健品区",
//         "value": 44
//     }, {"children": [], "label": "韩国保健品区", "value": 45}], "label": "保健品专区", "value": 36
// }, {"children": [{"children": [], "label": "国外奢侈品", "value": 47}], "label": "奢侈品专区", "value": 46}];

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}


// @Form.create()
class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: sessionStorage.hasOwnProperty('tabIndex') ? parseInt(sessionStorage.getItem('tabIndex')) : 0,
            categoryList: [],

            //产品基本信息
            name: sessionStorage.hasOwnProperty('nameStorage') ? sessionStorage.getItem('nameStorage') : "",
            brand: sessionStorage.hasOwnProperty('brandStorage') ? sessionStorage.getItem('brandStorage') : "",
            originalPlace: sessionStorage.hasOwnProperty('originalPlaceStorage') ? sessionStorage.getItem('originalPlaceStorage') : "",
            quality: sessionStorage.hasOwnProperty('qualityStorage') ? sessionStorage.getItem('qualityStorage') : "",
            dividePlatform: sessionStorage.hasOwnProperty('dividePlatformStorage') ? sessionStorage.getItem('dividePlatformStorage') : "",
            divideStore: sessionStorage.hasOwnProperty('divideStoreStorage') ? sessionStorage.getItem('divideStoreStorage') : "",

            //包装规格
            specificationList: [],
            defaultDivideRatio: 0,

            //图文信息
            productIntro: sessionStorage.hasOwnProperty('productIntroStorage') ? sessionStorage.getItem('productIntroStorage') : "",
            files: sessionStorage.hasOwnProperty('iconStorage') ? JSON.parse(sessionStorage.getItem('iconStorage')) : [],
            files2: sessionStorage.hasOwnProperty('imagesStorage') ? JSON.parse(sessionStorage.getItem('imagesStorage')) : [],
            isloading:false
        };
    }

    componentWillMount() {
        console.groupCollapsed("新建产品页");

        myApi.getCategory((rs) => {
            if (rs && rs.success) {
                this.setState({
                    categoryList: rs.obj,
                })
            }
        });

        if (!sessionStorage.hasOwnProperty('addexit'))
            sessionStorage.clear();

        // 初始化包装规格游客缓存
        this.initSpecificationStorage();


        // 判断是否从包装规格页面返回，并作出相应信息的更新
        this.getSpecificationInfo();

        this.getDefaultDivideRatio();
    }

    componentWillUnmount() {
        console.log("历史", this.context.router.history);

        if (this.context.router.history.location.pathname.indexOf("/my/productMan/add") === -1) {
            console.log("清除缓存");
            this.destroyStorage();
        }

        console.groupEnd();
    }

    // 判断页面是否刷新
    shouldComponentUpdate() {
        // console.log('shouldComponentUpdate');
        // sessionStorage.setItem('gCustomers', this.state.generalCustomers);
        // sessionStorage.setItem('sCustomers', this.state.specialCustomers);


        return true;
    }

    // 页面刷新时的操作
    componentWillUpdate() {
        // console.log('componentWillUpdate');

        // 页面刷新时清除游客页面的缓存
        if (sessionStorage.hasOwnProperty('user'))
            sessionStorage.removeItem('user');
        if (sessionStorage.hasOwnProperty('editUser'))
            sessionStorage.removeItem('editUser');
    }

    // 页面刷新完成后
    componentDidUpdate() {
        // console.log('componentDidUpdate');
    }

    //清除页面所有缓存
    destroyStorage() {
        //清除基本信息缓存
        if (sessionStorage.hasOwnProperty('nameStorage'))
            sessionStorage.removeItem('nameStorage');
        if (sessionStorage.hasOwnProperty('brandStorage'))
            sessionStorage.removeItem('brandStorage');
        if (sessionStorage.hasOwnProperty('originalPlaceStorage'))
            sessionStorage.removeItem('originalPlaceStorage');
        if (sessionStorage.hasOwnProperty('qualityStorage'))
            sessionStorage.removeItem('qualityStorage');
        if (sessionStorage.hasOwnProperty('dividePlatformStorage'))
            sessionStorage.removeItem('dividePlatformStorage');
        if (sessionStorage.hasOwnProperty('divideStoreStorage'))
            sessionStorage.removeItem('divideStoreStorage');
        if (sessionStorage.hasOwnProperty('categoryValueStorage'))
            sessionStorage.removeItem('categoryValueStorage');
        if (sessionStorage.hasOwnProperty('isShowStorage'))
            sessionStorage.removeItem('isShowStorage');
        // 清除包装规格相关缓存
        if (sessionStorage.hasOwnProperty('gSpecifications')) {
            sessionStorage.removeItem("gSpecifications");
        }
        if (sessionStorage.hasOwnProperty('user')) {
            sessionStorage.removeItem("user");
        }
        if (sessionStorage.hasOwnProperty('editUser')) {
            sessionStorage.removeItem("editUser");
        }
        if (sessionStorage.hasOwnProperty('tabIndex')) {
            sessionStorage.removeItem("tabIndex");
        }
        //清除图文信息缓存
        if (sessionStorage.hasOwnProperty('iconStorage'))
            sessionStorage.removeItem('iconStorage');
        if (sessionStorage.hasOwnProperty('imagesStorage'))
            sessionStorage.removeItem('imagesStorage');
        if (sessionStorage.hasOwnProperty('productIntroStorage'))
            sessionStorage.removeItem('productIntroStorage');
    }

    setPageStorage() {
        // 添加已选择情况的缓存
        //产品基本信息缓存
        if (sessionStorage.hasOwnProperty('nameStorage'))
        sessionStorage.setItem('nameStorage', this.state.name);

        if (sessionStorage.hasOwnProperty('brandStorage'))
            sessionStorage.setItem('brandStorage', this.state.brand);

        if (sessionStorage.hasOwnProperty('originalPlaceStorage'))
        sessionStorage.setItem('originalPlaceStorage', this.state.originalPlace);

        if (sessionStorage.hasOwnProperty('qualityStorage'))
        sessionStorage.setItem('qualityStorage', this.state.quality);

        if (sessionStorage.hasOwnProperty('dividePlatformStorage'))
        sessionStorage.setItem('dividePlatformStorage', this.state.dividePlatform);

        if (sessionStorage.hasOwnProperty('divideStoreStorage'))
        sessionStorage.setItem('divideStoreStorage', this.state.divideStore);

        if (sessionStorage.hasOwnProperty('categoryValueStorage'))
        sessionStorage.setItem('categoryValueStorage', this.props.form.getFieldValue('category'))

        if (sessionStorage.hasOwnProperty('isShowStorage'))
        sessionStorage.setItem('isShowStorage', this.props.form.getFieldsValue().isShow[0])

        // 包装规格缓存
        if (sessionStorage.hasOwnProperty('gSpecifications'))
        sessionStorage.setItem('gSpecifications', JSON.stringify(this.state.specificationList));

        //图文信息缓存
        // if (sessionStorage.hasOwnProperty('iconStorage'))
        // sessionStorage.setItem('iconStorage', JSON.stringify(this.state.files));
        //
        // if (sessionStorage.hasOwnProperty('imagesStorage'))
        // sessionStorage.setItem('imagesStorage', JSON.stringify(this.state.files2));

        if (sessionStorage.hasOwnProperty('productIntroStorage'))
        sessionStorage.setItem('productIntroStorage', this.state.productIntro);

        //页面tab缓存
        sessionStorage.setItem('tabIndex', "1");
        // console.log("添加后：sessionStorage.getItem('chosenStartPlaceStorage')", sessionStorage.getItem('chosenStartPlaceStorage'));
    }

    // 初始化存储包装规格信息的缓存
    initSpecificationStorage() {
        if (!sessionStorage.hasOwnProperty('gSpecifications')) {
            sessionStorage.setItem("gSpecifications", JSON.stringify([]));
        }
    }

    //从包装规格页面拿到规格信息-获取缓存
    getSpecificationInfo() {
        // 获取包装规格信息
        if (sessionStorage.hasOwnProperty('gSpecifications')) {
            if (sessionStorage.hasOwnProperty('user')) {
                let tmp = JSON.parse(sessionStorage.getItem("gSpecifications"));
                tmp.push(JSON.parse(sessionStorage.getItem('user')));
                sessionStorage.setItem("gSpecifications", JSON.stringify(tmp));

                console.log("JSON.parse(sessionStorage.getItem('user'))", JSON.parse(sessionStorage.getItem('user')));
                console.log("tmp", tmp);
                console.log("JSON.parse(sessionStorage.getItem(\"gSpecifications\"))", JSON.parse(sessionStorage.getItem("gSpecifications")));
            }

            console.log("getCustomerInfo JSON.parse(sessionStorage.getItem(\"gSpecifications\")) ", JSON.parse(sessionStorage.getItem("gSpecifications")));

            this.setState({
                specificationList: JSON.parse(sessionStorage.getItem("gSpecifications")),
            }, () => {
                console.log("设置成功");
                console.log();
                this.editSpecification();
            });
        }

        console.log("getCustomerInfo this.state.specificationList", this.state.specificationList);
    }

    // 获取修改包装规格页面的信息并修改
    editSpecification() {
        if (sessionStorage.hasOwnProperty('editUser')) {
            const editUser = JSON.parse(sessionStorage.getItem('editUser'));
            const index = editUser.id;

            console.log("editTourist  this.state.specificationList", this.state.specificationList);
            // this.state.generalCustomers[index] = editUser;
            this.state.specificationList.splice(index, 1, editUser);

            this.setState({
                specificationList: this.state.specificationList,
            });

            sessionStorage.setItem('gSpecifications', JSON.stringify(this.state.specificationList));

        }
    }

    getDefaultDivideRatio() {
        myApi.requestDefaultDivideRatio((rs) => {
            if (rs && rs.success)
                this.setState({
                    defaultDivideRatio: rs.obj.settingValue,
                });
        });
    }

    linkTo(link) {
        this.context.router.history.push(link);
    }

    // 返回
    onBack = () => {
        this.destroyStorage();
        this.context.router.history.push({pathname: '/my/productMan'});
    };

    onTabChange(tab, index) {
        console.log('onTabChange：', tab, index);
        this.setState({
            tabIndex: index,
});
};

    checkSpecification() {
        if (this.state.specificationList.length > 0) {
            console.log("checkSpecification this.state.specificationList", this.state.specificationList);
            const specifications = this.state.specificationList && this.state.specificationList.map((item, index) => {
                return <Card className="address_card" key={index}>
                    <div className="address_card_underline">
                        <div className="addr_name">规格：{item.specification}</div>
                        <div className="addr_phone">市场价：{item.marketPrice}</div>
                        <div className="addr_name">成本价：{item.costPrice}</div>
                        <div className="addr_name">销售价：{item.platformPrice}</div>
                        <div className="addr_name">库存：{item.vInboundNumber}</div>
                        {/*<div className="addr_name">运费：{item.deliverPrice}</div>*/}
                    </div>
                    <div className="address_card_edit">

                        <Button type="ghost" size="small" inline style={{marginLeft: '5px', float: 'right'}}
                                onClick={() => {
                                    this.deleteSpecification(index);
                                }}
                        >删除</Button>
                        <Button type="ghost" size="small" inline style={{float: 'right'}}
                                onClick={() => {
                                    sessionStorage.removeItem('editUser'); // 清空缓存
                                    sessionStorage.setItem('gSpecifications', JSON.stringify(this.state.specificationList));
                                    sessionStorage.setItem("tabIndex", "1");
                                    this.context.router.history.push({
                                        pathname: '/my/productMan/add/editSpecification',
                                        state: item,
                                        id: index
                                    });
                                }}
                        >编辑</Button>
                    </div>
                </Card>
            });
            return <List>
                {specifications}
            </List>
        }
        return "暂未添加包装规格信息"
    }

    // 新增包装规格
    addSpecification() {
        // 清除缓存
        sessionStorage.removeItem('user');

        // 设置本页面信息缓存
        this.setPageStorage();

        this.context.router.history.push({pathname: '/my/productMan/add/addSpecification'});
    }

    // 删除包装规格
    deleteSpecification(index) {
        console.log("deleteSpecification index", index);
        this.state.specificationList.splice(index, 1);
        this.setState({
            specificationList: this.state.specificationList,
        });

        sessionStorage.setItem("gSpecifications", JSON.stringify(this.state.specificationList));
        console.log("删除完之后sessionStorage.getItem('gSpecifications')", sessionStorage.getItem('gSpecifications'));
    }

    handleFiles(val) {
        this.setState({ files: val });
    }

    handleFiles2(val) {
        this.setState({ files2: val });
    }

    onSubmit = () => {
        this.props.form.validateFields({force: true}, (error) => {
            if (!error) {
                // submit the values
                // const categoryId = parseInt(this.state.categoryValue[this.state.categoryValue.length - 1], 10);

                // const files = JSON.parse(sessionStorage.getItem('iconStorage'));
                // const files2 = JSON.parse(sessionStorage.getItem('imagesStorage'));

                console.log("files", this.state.files)
                console.log("files2", this.state.files2)

                if (this.state.files.length === 0) {
                    Toast.info('请添加标志图片！');
                    return;
                }
                if (this.state.files2.length === 0) {
                    Toast.info('请添加产品图片！');
                    return;
                }
                if (!this.state.specificationList || this.state.specificationList.length === 0) {
                    Toast.info('请添加包装规格！');
                    return;
                }
                if (!this.state.productIntro) {
                    Toast.info('请添加产品介绍！');
                    return;
                }
                this.setState({isloading: true});

                const {getFieldValue} = this.props.form;
                console.log("getFieldValue('category')", getFieldValue('category'));
                const index = getFieldValue('category').length - 1;
                const categoryId = parseInt(getFieldValue('category')[index], 10);
                let imageList = [];
                let iconList = [];


                //标志图片
                let formData = new FormData();
                let files = this.state.files[0].file;
                formData.append("files", files);

                upload.uploadImg(formData, (rs)=>{

                    if (rs && rs.success) {
                        console.log('mediumPath', rs)
                        iconList.push(rs.obj[0]);
                        console.log('iconList: ', iconList);
                        Toast.info("正在上传标志图片...");

                        //产品图片
                        let sendPic = 0;
                        const shouldUploadNum = this.state.files2.length;

                        for (let i = 0; i < this.state.files2.length; i++) {
                            let formData2 = new FormData();
                            let files2 = this.state.files2[i].file;
                            formData2.append("files", files2);


                            upload.uploadImg(formData2, (rs)=> {

                                if (rs && rs.success) {
                                    console.log('mediumPath', rs)
                                    imageList.push(rs.obj[0]);
                                    sendPic = sendPic + 1;

                                    // Toast.info("正在上传第" + sendPic + "张产品图片...");
                                    console.log('imageList: ', imageList);

                                    if (sendPic === shouldUploadNum)
                                        this.add(categoryId, iconList, imageList);
                                } else {
                                    this.setState({isloading: false});
                                    Toast.info("上传产品图片失败！");
                                }
                            });

                        }
                    } else {
                        this.setState({isloading: false});
                        Toast.info("上传标志图片失败！");
                    }
                });

            }

        })
    };

    add(categoryId, iconList, imageList) {

        console.log('iconList2: ', iconList);
        console.log('imageList2: ', imageList);

        this.state.specificationList && this.state.specificationList.map((item, index) => {
            item.parent = 0
            item.saleNumber = 1
            item.deliverPrice = 0
        });

        if (!iconList[0]) {
            this.setState({isloading: false});
            Toast.info("上传标志图片失败！请重试！");
            return
        }
        if (!imageList[0]) {
            this.setState({isloading: false});
            Toast.info("上传产品图片失败！请重试！");
            return
        }

        const param = {
            specialty: {
                name: this.state.name,
                brand: this.state.brand,
                originalPlace: this.state.originalPlace,
                durabilityPeriod: this.state.quality,
                dividePlatform: parseFloat(this.state.dividePlatform),
                divideStore: parseFloat(this.state.divideStore),
                isVisible: this.props.form.getFieldsValue().isShow[0],//是否对其他店铺可见
                category: {
                    id: categoryId,
                },//分类
                specifications: this.state.specificationList,//包装规格
                icon: iconList[0],//标志图片
                images: imageList,//特产介绍图片
                descriptions: this.state.productIntro,
            },
            webusinessId: LocalStorageManager.getUid(),
            // webusinessId: 36,
        };

        console.log("param: ", param);

        myApi.addProduct(param, (rs) => {
            if (rs && rs.success) {
                this.setState({isloading: false});
                Toast.info(rs.msg, 1);
                history.go(-1);
            } else {
                // Toast.info(rs.msg, 1);
                this.setState({isloading: false});
                Toast.offline(rs.msg, 1);
            }
        });
    }

    onNameChange = (val) => {
        this.setState({
            name: val,
        });
        sessionStorage.setItem('nameStorage', this.state.name);
    };

    onBrandChange = (val) => {
        this.setState({
            brand: val,
        });
        sessionStorage.setItem('brandStorage', this.state.brand);
    };

    onOriginalChange = (val) => {
        this.setState({
            originalPlace: val,
        });
        sessionStorage.setItem('originalPlaceStorage', this.state.originalPlace);
    };

    onQualityChange = (val) => {
        this.setState({
            quality: val,
        });
        sessionStorage.setItem('qualityStorage', this.state.quality);
    };

    onDividePlatformChange = (val) => {
        this.setState({
            dividePlatform: val,
        });
        sessionStorage.setItem('dividePlatformStorage', this.state.dividePlatform);
    };

    onDivideStoreChange = (val) => {
        this.setState({
            divideStore: val,
        });
        sessionStorage.setItem('divideStoreStorage', this.state.divideStore);
    };

    onProductIntroChange = (value) => {
        this.setState({
            productIntro: value,
        });
        sessionStorage.setItem('productIntroStorage', this.state.productIntro);
    };


    render() {
        const {getFieldProps, getFieldError} = this.props.form;
        const {files, files2} = this.state;

        console.log("this.state.categoryList", this.state.categoryList)

        let categoryIds = [];
        if (sessionStorage.hasOwnProperty('categoryValueStorage')) {
            let categories = sessionStorage.getItem('categoryValueStorage').split(",");
            for (let i = 0; i < categories.length; i++) {
                let tmp = parseInt(categories[i]);
                categoryIds.push(tmp);
            }
        }
        console.log("categoryIds", categoryIds)


        return <Layout header={false} footer={false}>
            <Navigation title="新建产品" left={true}/>
            <WhiteSpace/>
            <div className="product_container">
                <Tabs tabs={tabs}
                      initialPage={this.state.tabIndex}
                      useOnPan={false}
                      onChange={(tab, index) => {
                          this.onTabChange(tab, index)
                      }}
                >
                    <div>
                        <InputItem
                            placeholder="请输入产品名称"
                            clear
                            value={this.state.name}
                            onChange={this.onNameChange}
                        >
                            产品名称
                        </InputItem>
                        <Picker
                            // data={categoryList}
                            data={this.state.categoryList}
                            cols={2}
                            {...getFieldProps('category', {
                                initialValue: sessionStorage.hasOwnProperty('categoryValueStorage') ?
                                    categoryIds : null
                            })}
                            onOk={v =>
                                sessionStorage.setItem('categoryValueStorage', this.props.form.getFieldValue('category'))
                            }
                        >
                            <List.Item arrow="horizontal">产品类别</List.Item>
                        </Picker>
                        <InputItem
                            placeholder="请输入品牌"
                            clear
                            value={this.state.brand}
                            onChange={this.onBrandChange}
                        >
                            品牌
                        </InputItem>
                        <InputItem
                            placeholder="请输入产地"
                            clear
                            value={this.state.originalPlace}
                            onChange={this.onOriginalChange}
                        >
                            产地
                        </InputItem>
                        <InputItem
                            placeholder="请输入保质期"
                            clear
                            value={this.state.quality}
                            extra="天"
                            type="digit"
                            onChange={this.onQualityChange}
                        >
                            保质期
                        </InputItem>
                        <Picker
                            data={isShow}
                            cols={1}
                            {...getFieldProps('isShow', {
                                initialValue: [!sessionStorage.hasOwnProperty('isShowStorage') ? true : JSON.parse(sessionStorage.getItem('isShowStorage'))],
                            })}
                            onOk={v =>
                                sessionStorage.setItem('isShowStorage', this.props.form.getFieldsValue().isShow)
                                // console.log(this.props.form.getFieldsValue().isShow) //[true]/[false]
                                // console.log(this.props.form.getFieldsValue().isShow[0]) //0
                                // console.log(isShow[this.props.form.getFieldsValue().isShow[0]]) //{label: "是", value: 0}
                                // console.log(isShow[this.props.form.getFieldsValue().isShow[0]].value)//0
                            }>
                            <List.Item arrow="horizontal">允许其它微商代理</List.Item>
                        </Picker>
                        <InputItem
                            type='digit'
                            clear
                            labelNumber={8}
                            value={this.state.divideStore}
                            onChange={this.onDivideStoreChange}
                        >
                            代理微商分成比例
                        </InputItem>
                        <InputItem
                            type='digit'
                            labelNumber={8}
                            clear
                            editable={false}
                            value={this.state.defaultDivideRatio}
                            onChange={this.onDividePlatformChange}
                        >
                            平台分成比例
                        </InputItem>

                    </div>
                    <div className="product_container">
                        <WhiteSpace/>

                        {this.checkSpecification()}
                        <WhiteSpace/>

                        <Button icon={<img src={addIcon} alt=""/>}
                                inline size="small" type="primary" style={{height: '2.5rem' , width: '40%', margin:'0 auto'}}
                                onClick={() => {
                                    this.addSpecification();
                                }
                                }>
                            新增包装规格
                        </Button>
                        <WhiteSpace/>

                    </div>
                    <div className="product_container">
                        <List.Item>
                            标志图片

                            {/*<ImgCropper filesLength={1} storageName="iconStorage"*/}
                            {/*            files={this.state.files} handleFiles={this.handleFiles.bind(this)}/>*/}
                            <AnotherImgCropper filesLength={1} storageName="iconStorage"
                              files={this.state.files} handleFiles={this.handleFiles.bind(this)} biaozhi={true}/>

                        </List.Item>
                        <List.Item>
                            产品图片

                            {/*<ImgCropper filesLength={6} storageName="imagesStorage"*/}
                            {/*            files={this.state.files2} handleFiles={this.handleFiles2.bind(this)}/>*/}
                            <AnotherImgCropper filesLength={6} storageName="imagesStorage"
                            files={this.state.files2} handleFiles={this.handleFiles2.bind(this)} biaozhi={false}/>

                        </List.Item>
                        <TextareaItem
                            title="产品介绍"
                            autoHeight
                            rows={5}
                            count={600}
                            placeholder="快来具体介绍一下产品吧~"
                            onChange={this.onProductIntroChange}
                            value={this.state.productIntro}
                        />
                        <List.Item>
                            <div>
                                <Button size="small" inline style={{margin: '20px 0 0 4px', float: 'right'}}
                                        onClick={this.onBack}>返回</Button>
                                <Button size="small" type="primary" inline
                                        style={{margin: '20px 4px 0 0', float: 'right'}}
                                        onClick={this.onSubmit}>提交</Button>
                            </div>
                        </List.Item>
                    </div>


                </Tabs>
                <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.isloading}
            />

            </div>


        </Layout>
    }
}


AddProduct.contextTypes = {
    router: PropTypes.object.isRequired
};
const AddProductPage = createForm()(AddProduct);
export default AddProductPage;