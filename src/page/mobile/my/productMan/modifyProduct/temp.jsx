import React from 'react';
import ReactDOM from 'react-dom'
import { List, InputItem, WhiteSpace, Button, Toast, WingBlank, Card, Flex, Tabs, Picker, ImagePicker, TextareaItem } from 'antd-mobile'; //这里引入ant-mobile的组件
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import addIcon from "../../../../../static/images/icons/add.png"; // 这个页面用到的图片
import Submit from "../../../../../components/submit/index.jsx";
import './index.less';
import { get } from 'https';
import { createForm } from 'rc-form';
import myApi from '../../../../../api/my.jsx';
import ImgCropper from "../../../../../components/img_cropper/imgCropper.jsx";


import PropTypes from 'prop-types';
const Item = List.Item;
const tabs = [
    { title: '基本信息', sub: '0' },
    { title: '包装规格', sub: '1' },
    { title: '图文信息', sub: '2' },
];
const isShow = [
    {
        label: '是',
        value: 0,
    },
    {
        label: '否',
        value: 1,
    },
];
const isActive = [
    {
        label: '有效',
        value: true,
    },
    {
        label: '无效',
        value: false,
    },
];
// const categoryList = [{"children":[{"children":[],"label":"国内水果","value":2}],"label":"水果专区","value":1},{"children":[{"children":[],"label":"杉木山装","value":4}],"label":"箱包","value":3},{"children":[{"children":[],"label":"帅康电器","value":6}],"label":"电器","value":5},{"children":[{"children":[],"label":"国内水果区","value":8},{"children":[],"label":"国外水果区","value":9}],"label":"水果区","value":7},{"children":[{"children":[],"label":"国外玩具区","value":11}],"label":"玩具区","value":10},{"children":[{"children":[],"label":"国内日用品","value":14},{"children":[],"label":"俄罗斯日用品","value":15},{"children":[],"label":"德国日用品","value":16},{"children":[],"label":"澳洲日用品","value":17},{"children":[],"label":"日本日用品","value":18},{"children":[],"label":"韩国日用品","value":19},{"children":[],"label":"泰国日用品","value":20}],"label":"日用品","value":12},{"children":[{"children":[],"label":"国内食品酒水","value":21},{"children":[],"label":"国外食品酒水","value":22},{"children":[],"label":"俄罗斯食品酒水","value":23}],"label":"食品酒水","value":13},{"children":[{"children":[],"label":"韩国化妆品","value":25},{"children":[],"label":"国内化妆品","value":26},{"children":[],"label":"欧美化妆品","value":27},{"children":[],"label":"泰国化妆品","value":28},{"children":[],"label":"日本化妆品","value":29},{"children":[],"label":"俄罗斯化妆品","value":30},{"children":[],"label":"英国BOOTS小黄瓜系列","value":48}],"label":"化妆品","value":24},{"children":[{"children":[],"label":"泰国皇家乳胶","value":32}],"label":"乳胶产品专区","value":31},{"children":[{"children":[],"label":"国内饰品","value":34},{"children":[],"label":"国外饰品","value":35}],"label":"饰品服饰专区","value":33},{"children":[{"children":[],"label":"日本保健品","value":37},{"children":[],"label":"国内保健品","value":38},{"children":[],"label":"澳洲Bio Island保健品区","value":39},{"children":[],"label":"澳洲Healthy Care保健品区","value":40},{"children":[],"label":"澳洲Blackmores保健品区","value":41},{"children":[],"label":"澳洲swisse保健品区","value":42},{"children":[],"label":"澳洲保健品区","value":43},{"children":[],"label":"泰国保健品区","value":44},{"children":[],"label":"韩国保健品区","value":45}],"label":"保健品专区","value":36},{"children":[{"children":[],"label":"国外奢侈品","value":47}],"label":"奢侈品专区","value":46}];
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

// @Form.create()
class ModifyProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowValue: [],
            tabIndex: 0,
            categoryList: [],
            categoryValue: [],
            files: [],
            files2: [],
            productIntro: '',
            specificationList: [],
            isEdit: true,
            name: '',
            originalPlace: '',
            quality: '',
            dividePlatform: '',
            divideStore: '',
            isActiveValue: [],//有效
        };
    }


    componentWillMount() {
        const id = this.props.location.params.id;
        this.setState({
            isEdit: this.props.location.params.isEdit,
        });

        myApi.getCategory((rs) => {
            if (rs && rs.success) {
                this.setState({
                    categoryList: rs.obj,
                })
            }
        });

        myApi.getProductDetail(id, (rs) => {
            if (rs && rs.success) {
                console.log("产品详情rs:", rs);
                let category = rs.obj.category;
                let categoryId = [];
                if (category) {
                    categoryId.push(category.id);
                    while (category.parent != null) {
                        category = category.parent;
                        categoryId.push(category.id);
                    }
                    categoryId.reverse();
                }
                if (rs.obj.images) {//产品图片
                    let imageList = [];
                    for (let i = 0; i < rs.obj.images.length; i += 1) {
                        imageList.push({
                            uid: -i,
                            name: 'xxx.png',
                            status: 'done',
                            url: rs.obj.images[i].mediumPath,
                            // thumbnailPath: rs.obj.images[i].thumbnailPath,
                            // largePath: rs.obj.images[i].largePath,
                            // mediumPath: rs.obj.images[i].mediumPath,
                        });
                    }
                    this.setState({
                        files2: imageList,
                    });
                }
                if (rs.obj.icon) {//标志图片
                    let iconUrl = [];
                    iconUrl.push({
                        uid: -1,
                        name: 'iconUrl.png',
                        status: 'done',
                        url: rs.obj.icon.mediumPath,
                        // thumbnailPath: rs.obj.icon.thumbnailPath,
                        // largePath: rs.obj.icon.largePath,
                        // mediumPath: rs.obj.icon.mediumPath,
                    });
                    this.setState({
                        files: iconUrl,
                    });
                    console.log("asdfsd",iconUrl)
                }
                this.state.isShowValue[0]=1
                this.state.isActiveValue[0]=rs.obj.isActive,
                this.state.categoryValue[0]=rs.obj.category.id

                this.setState({
                    name: rs.obj.name,
                    originalPlace: rs.obj.originalPlace,
                    quality: rs.obj.durabilityPeriod,
                    dividePlatform: rs.obj.dividePlatform,
                    divideStore: rs.obj.divideStore,
                    // categoryValue: rs.obj.category,
                    // isShowValue: rs.obj.isShowValue,
                    // isShowValue: 1,
                    // isActiveValue: rs.obj.isActive,
                    specificationList: rs.obj.specifications,
                    productIntro: rs.obj.descriptions,

                });
            }
        });

    }

    linkTo(link) {
        this.context.router.history.push(link);
    }

    // 返回
    onBack = () => {
        this.context.router.history.push({ pathname: '/my/productMan' });
    }

    onTabChange(tab, index) {
        console.log('onTabChange：', tab, index);
        this.setState({
            tabIndex: index,
        });
    }

    onChangeShow = (value) => {
        console.log("onChangeShow: ", value);
        this.setState({
            isShowValue: value,
        });

    };

    onChangeActive = (value) => {
        console.log("onChangeActive: ", value);
        this.setState({
            isActiveValue: value,
        });

    };

    onChangeCategory = (value) => {
        console.log("onChangeCategory: ", value);
        this.setState({
            categoryValue: value,
        });

    };

    onChange = (files, type, index) => {
        console.log('onChange', files, type, index);
        // console.log('files', files);
        // this.state.files = files;
        this.setState({
            files: files,
        });
    };

    onChange2 = (files, type, index) => {
        console.log('onChange', files, type, index);
        // this.state.files2 = files;
        this.setState({
            files2: files,
        });
        console.log("this.state.files2: ", this.state.files2);
    };

    onProductIntroChange = (value) => {
        this.setState({
            productIntro: value,
        });
    };

    checkSpecification() {
        // const type = this.props.location.params.type;
        if (this.state.specificationList && this.state.specificationList.length > 0) {
            console.log("checkSpecification this.state.specificationList", this.state.specificationList);
            const specifications = this.state.specificationList && this.state.specificationList.map((item, index) => {
                return <Card className="address_card" key={index}>
                    {//编辑页“包装规格”信息不展示“可获分成金额”，查看页“包装规格”信息展示“可获分成金额”
                        this.state.isEdit ?
                            <div className="address_card_underline">
                                <div className="addr_name">规格：{item.specification}</div>
                                <div className="addr_phone">市场价：{item.marketPrice}</div>
                                <div className="addr_name">成本价：{item.costPrice}</div>
                                <div className="addr_name">销售价：{item.platformPrice}</div>
                                <div className="addr_name">库存：{item.vInboundNumber}</div>
                                <div className="addr_name">运费：{item.deliverPrice}</div>
                            </div>
                            :
                            <div className="address_card_underline">
                                <div className="addr_name">规格：{item.specification}</div>
                                <div className="addr_phone">市场价：{item.marketPrice}</div>
                                <div className="addr_name">成本价：{item.costPrice}</div>
                                <div className="addr_name">销售价：{item.platformPrice}</div>
                                <div className="addr_name">库存：{item.vInboundNumber}</div>
                                <div className="addr_name">运费：{item.deliverPrice}</div>
                                <div className="addr_name">可获分成金额：{item.fencheng}</div>
                            </div>
                    }
                    {this.state.isEdit ?
                        <div className="address_card_edit">

                            <Button type="ghost" size="small" inline style={{ marginLeft: '5px', float: 'right' }}
                                onClick={() => {
                                    this.deleteSpecification(item.id);
                                }}
                            >删除</Button>
                            <Button type="ghost" size="small" inline style={{ float: 'right' }}
                                onClick={() => {
                                    this.context.router.history.push({ pathname: '/my/productMan/edit/editSpecification', state: item, id: index ,myid:this.props.location.params.id});
                                }}
                            >编辑</Button>
                        </div>
                        :
                        <div></div>
                    }

                </Card>
            });
            return <List >
                {specifications}
            </List>
        }
        return "暂未添加包装规格信息"
    }

    setPageStorage() {
        // 添加已选择情况的缓存
        //产品基本信息缓存
        if (sessionStorage.hasOwnProperty('nameStorage'))
        sessionStorage.setItem('nameStorage', this.state.name);

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
        if (sessionStorage.hasOwnProperty('iconStorage'))
        sessionStorage.setItem('iconStorage', JSON.stringify(this.state.files));

        if (sessionStorage.hasOwnProperty('imagesStorage'))
        sessionStorage.setItem('imagesStorage', JSON.stringify(this.state.files2));

        if (sessionStorage.hasOwnProperty('productIntroStorage'))
        sessionStorage.setItem('productIntroStorage', this.state.productIntro);

        // console.log("添加后：sessionStorage.getItem('chosenStartPlaceStorage')", sessionStorage.getItem('chosenStartPlaceStorage'));
    }

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
        this.props.form.validateFields({ force: true }, (error) => {
            const { getFieldValue, getFieldsValue } = this.props.form;
            if (!error) {
                // submit the values
                const categoryId = parseInt(this.state.categoryValue[this.state.categoryValue.length - 1], 10);
                const imageList = [];
                let iconList = [];
                if (this.state.files.length) {
                    let formData = new FormData();
                    let files = this.state.files[0].file;
                    formData.append("files", files);
                    fetch("http://www.bjhongruijiye.com/hyapi/resource/image/upload", {
                        method: 'POST',
                        headers: {}, body: formData,
                    }).then((response) => response.json()).then((rs) => {
                        console.log('mediumPath', rs)
                        iconList.push({
                            "mediumPath": "http://hrmall.bjhongruijiye.com" + rs.obj[0].url,
                        });
                        console.log('iconList: ', iconList);

                    });
                }
                else {
                    Toast.info('请添加标志图片！');
                    return;
                }
                if (this.state.files2.length) {
                    for (var i = 0; i < this.state.files2.length; i++) {
                        let formData = new FormData();
                        let files2 = this.state.files2[i].file;
                        formData.append("files", files2);
                        fetch("http://www.bjhongruijiye.com/hyapi/resource/image/upload", {
                            method: 'POST',
                            headers: {}, body: formData,
                        }).then((response) => response.json()).then((rs) => {
                            console.log('mediumPath', rs)
                            imageList.push({
                                "mediumPath": "http://hrmall.bjhongruijiye.com" + rs.obj[0].url,
                            });
                            console.log('imageList: ', imageList);

                        });
                    }
                }
                else {
                    Toast.info('请添加产品图片！');
                    return;
                }
                if (!this.state.specificationList || this.state.specificationList.length == 0) {
                    Toast.info('请添加包装规格！');
                    return;
                }
                if (!this.state.productIntro) {
                    Toast.info('请添加产品介绍！');
                    return;
                }

                const param = {
                    specialty: {
                        name: getFieldValue('name'),
                        originalPlace: getFieldValue('originalPlace'),
                        quality: getFieldValue('quality'),
                        dividePlatform: parseFloat(getFieldValue('dividePlatform')),
                        divideStore: parseFloat(getFieldValue('divideStore')),
                        isShowElse: this.state.isShowValue,//是否对其他店铺可见
                        category: {
                            id: categoryId,
                        },//分类
                        specifications: this.state.specificationList,//包装规格
                        icon: iconList,//标志图片
                        images: imageList,//特产介绍图片
                        descriptions: this.state.productIntro,
                        id: this.props.location.params.id,//商品id
                        isActive: this.state.isActiveValue//有效
                    },
                }

                console.log("param: ", param);

                myApi.editProduct(param, (rs) => {
                    if (rs && rs.success) {
                        Toast.info(rs.msg, 1);
                        history.go(-1);
                    } else {
                        // Toast.info(rs.msg, 1);
                        Toast.offline(rs.msg, 1);
                    }
                });

            }

        })
    }

    onSale() {
        const id = this.props.location.params.id;
        myApi.sellProductHandler(localStorage.setItem("weBusinessID"), id, (rs) => {
            if (rs && rs.success) {
                Toast.info(rs.msg, 1);
            }
            else {
                // Toast.info(rs.msg, 1);
                Toast.offline('代售产品失败');
            }
        });
    }



    render() {
        const id = this.props.location.params.id;
        const type = this.props.location.params.type;
        const { getFieldProps, getFieldError } = this.props.form;
        const { files, files2, isEdit } = this.state;
        console.log("asd",this.state)
        let categories = [];
        this.state.categoryList && this.state.categoryList.map((item, index) => {
            categories.push(
                {
                    label: item.name,
                    value: item.id,
                }
            )
        });
        console.log("??",categories)
        console.log("??",isShow)
        return <Layout header={false} footer={false}>
            {this.state.isEdit ?<Navigation title="编辑产品" left={true} />:<Navigation title="查看产品" left={true} />}
            <WhiteSpace />
            <div className="product_container">
                <Tabs tabs={tabs}
                    // initialPage={0}
                    useOnPan={false}
                    onChange={(tab, index) => { this.onTabChange(tab, index) }}
                >
                    <div>
                        <InputItem
                            {...getFieldProps('name', {
                                rules: [
                                    { required: true, message: '产品名称为必填项' },
                                ],

                            })}
                            error={!!getFieldError('name')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('name').join(','), 2);
                            }}
                            placeholder="请输入产品名称"
                            clear
                            value={this.state.name}
                            disabled={!isEdit}
                        >
                            产品名称
                        </InputItem>
                        <InputItem
                            {...getFieldProps('originalPlace', {
                                rules: [
                                    { required: true, message: '产地为必填项' },
                                ],

                            })}
                            error={!!getFieldError('originalPlace')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('originalPlace').join(','), 2);
                            }}
                            placeholder="请输入产地"
                            clear
                            value={this.state.originalPlace}
                            disabled={!isEdit}
                        >
                            产地
                        </InputItem>
                        <InputItem
                            {...getFieldProps('quality', {
                                rules: [
                                    { required: true, message: '保质期为必填项' },
                                ],

                            })}
                            error={!!getFieldError('quality')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('quality').join(','), 2);
                            }}
                            placeholder="请输入保质期"
                            clear
                            value={this.state.quality}
                            disabled={!isEdit}
                        >
                            保质期
                        </InputItem>
                        <InputItem
                            {...getFieldProps('dividePlatform', {
                                rules: [
                                    { required: true, message: '平台分成比例为必填项' },
                                ],

                            })}
                            error={!!getFieldError('dividePlatform')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('dividePlatform').join(','), 2);
                            }}
                            // placeholder="请输入默认平台分成比例"
                            type='money'
                            labelNumber={8}
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                            clear
                            value={this.state.dividePlatform}
                            disabled={!isEdit}
                        >
                            默认平台分成比例
                        </InputItem>
                        <InputItem
                            {...getFieldProps('divideStore', {
                                rules: [
                                    { required: true, message: '代理店铺分成比例为必填项' },
                                ],

                            })}
                            error={!!getFieldError('divideStore')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('divideStore').join(','), 2);
                            }}
                            // placeholder="请输入代理店铺分成比例"
                            type='money'
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                            clear
                            labelNumber={8}
                            value={this.state.divideStore}
                            disabled={!isEdit}
                        >
                            代理店铺分成比例
                        </InputItem>
                        <Picker
                            // data={this.state.categoryList}
                            data = {categories}
                            className="forss"
                            value={this.state.categoryValue}
                            onChange={this.onChangeCategory}
                            disabled={!isEdit}
                        >
                            <List.Item arrow="horizontal">分类</List.Item>
                        </Picker>
                        <Picker
                            extra="请选择"
                            data={isShow}
                            value={this.state.isShowValue}
                            cols={1}
                            className="forss"
                            onChange={this.onChangeShow}
                            disabled={!isEdit}
                        >
                            <List.Item arrow="horizontal">是否对其他店铺可见</List.Item>
                        </Picker>
                        <Picker
                            extra="请选择"
                            data={isActive}
                            value={this.state.isActiveValue}
                            cols={1}
                            className="forss"
                            onChange={this.onChangeActive}
                            disabled={!isEdit}
                        >
                            <List.Item arrow="horizontal">有效</List.Item>
                        </Picker>

                    </div>
                    <div className="product_container">
                        <WhiteSpace />

                        {this.checkSpecification()}
                        <WhiteSpace />
                        {
                            this.state.isEdit ?
                                <div>
                                    <Button icon={<img src={addIcon} alt="" />}
                                        inline size="small" type="primary"
                                        onClick={() => {
                                            this.addSpecification();
                                        }
                                        }>
                                        新增包装规格
                                    </Button>
                                </div>
                                :
                                <div></div>
                        }

                        <WhiteSpace />

                    </div>
                    <div className="product_container">
                        <List.Item>
                            标志图片

                            <ImgCropper filesLength={1} storageName="iconStorage"
                                        files={this.state.files} handleFiles={this.handleFiles.bind(this)}/>

                        </List.Item>
                        <List.Item>
                            产品图片

                            <ImgCropper filesLength={6} storageName="imagesStorage"
                                        files={this.state.files2} handleFiles={this.handleFiles2.bind(this)}/>

                        </List.Item>
                        {/* <List.Item>
                            标志图片
                            <ImagePicker
                                files={files}
                                onChange={this.onChange}
                                onImageClick={(index, fs) => console.log('onImageClick', index, fs)}
                                selectable={files.length < 1}
                                multiple={false}
                            />
                        </List.Item>
                        <List.Item>
                            产品图片
                            <ImagePicker
                                files={files2}
                                onChange={this.onChange2}
                                onImageClick={(index, fs) => console.log('onImageClick2', index, fs)}
                                selectable={files2.length < 6}
                                multiple={false}
                            />
                        </List.Item> */}
                        <TextareaItem
                            title="产品介绍"
                            autoHeight
                            rows={5}
                            count={600}
                            placeholder="快来具体介绍一下产品吧~"
                            onChange={this.onProductIntroChange}
                            disabled={!isEdit}
                            value={this.state.productIntro}
                        />
                        <List.Item >
                            {isEdit ?//isEdit为true时，当前为“编辑”页;isEdit为false时，当前页为“查看”页
                                <div >
                                    <Button size="small" inline style={{ margin: '20px 0 0 4px', float: 'right' }} onClick={this.onBack}>返回</Button>
                                    <Button size="small" type="primary" inline style={{ margin: '20px 4px 0 0', float: 'right' }} onClick={this.onSubmit}>提交</Button>
                                </div>
                                :
                                <div>
                                    {type == 0 ?//type为0时，“查看”页控制按钮显示为“返回”；
                                        //type为1时，“查看”页控制按钮显示为“返回”&"代售"；
                                        //type为2时，“查看”页控制按钮显示为“返回”；
                                        <div >
                                            <Button size="small" inline style={{ margin: '20px 0 0 4px', float: 'right' }} onClick={this.onBack}>返回</Button>
                                        </div>
                                        :
                                        type == 1 ?
                                            <div >
                                                <Button size="small" inline style={{ margin: '20px 0 0 4px', float: 'right' }} onClick={this.onBack}>返回</Button>
                                                <Button size="small" type="primary" inline style={{ margin: '20px 4px 0 0', float: 'right' }} onClick={this.onSale}>代售</Button>
                                            </div>
                                            :
                                            <div >
                                                <Button size="small" inline style={{ margin: '20px 0 0 4px', float: 'right' }} onClick={this.onBack}>返回</Button>
                                            </div>
                                    }
                                </div>


                            }

                        </List.Item>
                    </div>


                </Tabs>

            </div>




        </Layout>
    }
}


ModifyProduct.contextTypes = {
    router: PropTypes.object.isRequired
};
const ModifyProductPage = createForm()(ModifyProduct);
export default ModifyProductPage;