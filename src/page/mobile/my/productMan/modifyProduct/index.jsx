import React from 'react';
import ReactDOM from 'react-dom'
import { List, InputItem, WhiteSpace, Button, Toast, Card, Tabs, Picker, TextareaItem,ActivityIndicator } from 'antd-mobile'; //这里引入ant-mobile的组件
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import addIcon from "../../../../../static/images/icons/add.png"; // 这个页面用到的图片
import './index.less';
import { get } from 'https';
import { createForm } from 'rc-form';
import myApi from '../../../../../api/my.jsx';
import ImgCropper from "../../../../../components/img_cropper/imgCropper.jsx";
import {LocalStorageManager} from "../../../../../manager/StorageManager.jsx";
import AnotherImgCropper from "../../../../../components/img_cropper/anotherImgCropper.jsx";

import PropTypes from 'prop-types';
import upload from "../../../../../api/upload.jsx";


const Item = List.Item;
const tabs = [
    { title: '基本信息', sub: '0' },
    { title: '包装规格', sub: '1' },
    { title: '图文信息', sub: '2' },
];
const isShow = [
    {
        label: '是',
        value: 1,
    },
    {
        label: '否',
        value: 0,
    },
];
const isActive = [
    {
        label: '上架',
        value: true,
    },
    {
        label: '下架',
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

            brand:'',
            isloading:false
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
                                    // file: ImgCropper.dataURLtoFile(this.getBase64("http://www.bjhongruijiye.com/" + rs.obj.images[i].mediumPath), "newFile.jpeg"),
                                    // orientation: 1,
                                    id: rs.obj.images[i].id,
                                    url: "http://www.bjhongruijiye.com/" + rs.obj.images[i].mediumPath,
                                    origin: rs.obj.images[i].mediumPath
                                });
                                // this.getBase64(imageList[i].url)
                            }
                            this.setState({
                                files2: imageList,
                            });
                        }
                        if (rs.obj.icon) {//标志图片
                            let iconUrl = [];
                            iconUrl.push({
                                // file: ImgCropper.dataURLtoFile(this.getBase64("http://www.bjhongruijiye.com/"+ rs.obj.icon.mediumPath), "newFile.jpeg"),
                                id: rs.obj.icon.id,
                                url: "http://www.bjhongruijiye.com/" + rs.obj.icon.mediumPath,
                                origin: rs.obj.icon.mediumPath
                            });
                            this.setState({
                                files: iconUrl,
                            });
                            console.log("asdfsd",iconUrl)
                        }
                        // this.state.isShowValue[0]=1
                        // this.state.isActiveValue[0]=rs.obj.isActive,
                        // this.state.categoryValue[0]=rs.obj.category.id
        
                        // this.setState({
                        //     name: rs.obj.name,
                        //     originalPlace: rs.obj.originalPlace,
                        //     quality: rs.obj.durabilityPeriod,
                        //     dividePlatform: rs.obj.dividePlatform,
                        //     divideStore: rs.obj.divideStore,
                        //     // categoryValue: rs.obj.category,
                        //     // isShowValue: rs.obj.isShowValue,
                        //     // isShowValue: 1,
                        //     // isActiveValue: rs.obj.isActive,
                        //     specificationList: rs.obj.specifications,
                        //     productIntro: rs.obj.descriptions,
        
                        // });
        
                        if(!localStorage.getItem("modifySpecificationList")){
                            localStorage.setItem("modifySpecificationList",JSON.stringify(rs.obj.specifications))
                        }
        
                        if(!localStorage.getItem("modifybasic")){
                            console.log("safsafdsafdsafda",this.state.categoryList)
                            this.state.categoryList && this.state.categoryList.map((item, index) => {
                                if(item.value == rs.obj.category.id){
                                    this.state.categoryValue[0]=rs.obj.category.id
                                }
                                else{
                                    let ttemp;
                                    for(ttemp=0;ttemp<item.children.length;ttemp++){
                                        if(item.children[ttemp]&&item.children[ttemp].value == rs.obj.category.id){
                                            this.state.categoryValue[0]=item.value
                                            this.state.categoryValue[1]=rs.obj.category.id
                                        }
                                    }
                                }
                            });
                            console.log("tets",this.state.categoryValue[0],this.state.categoryValue[1],rs.obj.category.id)
                            console.log("tets",this.state)
                            this.state.isShowValue[0]=rs.obj.isVisible?1:0,
                            this.state.isActiveValue[0]=rs.obj.isActive,
                            // this.state.categoryValue[0]=rs.obj.category.id
                            this.setState({
                                name: rs.obj.name,
                                originalPlace: rs.obj.originalPlace,
                                quality: rs.obj.durabilityPeriod,
                                dividePlatform: rs.obj.dividePlatform,
                                divideStore: rs.obj.divideStore,
                                specificationList: rs.obj.specifications,
                                productIntro: rs.obj.descriptions,
                                brand: rs.obj.brand
                            });
                        }
                        else{
                            //todo : 读缓存
                            var temp = JSON.parse(localStorage.getItem("modifybasic"))
                            this.state.isShowValue[0]=temp.isShowValue
                            this.state.isActiveValue[0]=temp.isActiveValue,
                            this.state.categoryValue[0]=temp.categoryValue,
                            this.setState({
                                name: temp.name,
                                originalPlace: temp.originalPlace,
                                quality: temp.quality,
                                dividePlatform: temp.dividePlatform,
                                divideStore: temp.divideStore,
                                specificationList: rs.obj.specifications,
                                productIntro: temp.productIntro,
                                brand: temp.brand
                            });
                        }
        
                    }
                });
            }
        });



    }

    getBase64(img){
        function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
            var canvas = document.createElement("canvas");
            canvas.width = width ? width : img.width;
            canvas.height = height ? height : img.height;
    
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL('image/jpeg');
            return dataURL;
        }
        var image = new Image();
        image.crossOrigin = '*';
        image.src = img;

        return getBase64Image(image);//将base64传给done上传处理
        // return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAyADIDASIAAhEBAxEB/8QAHQAAAgICAwEAAAAAAAAAAAAAAAYHCAEJAgQFA//EADAQAAEDAwMBBgUEAwAAAAAAAAECAwQABREGEiEHCBMxQVFxFCIyYZEVQmKxQ1KC/8QAGwEAAgMAAwAAAAAAAAAAAAAABQYCAwQAAQf/xAAqEQABAwIEBQMFAAAAAAAAAAABAAIDBBEFEjEzBhMhQWEUFVEikaHR4f/aAAwDAQACEQMRAD8Arlp2XIt8BTKwQptWKXup2J1qTJCMlPp5VJWtNI3DTF1kNSYqgytZ2qA4xSpcbSm4QVxlpylY4P3o5LG5t43ahB4JWvtK3QqDIDihKZCQPr8R5046jmiOmMjH1JGTXQY0fNYvCmynCG1bh9+fKvprVlxD7TYzwjHFD8pDTdEy4FwWFRy7HU61gjGSCrGfal1bxYCorsVpaA6HFEjC/Dw3eOKZ9LvIlJUwsJSpGE7c5JOPEVw1Dph9bwdZSlORyV8AADNUXGhWkMNszUobR/sr8UV2zapQONufvRUlVZbXU2zpVrFr9I16iTYZSjtRJcT3jB/68qX712JL5cCudoW526821z5m3I7wPHl4ZppkxI8tpTMhpDiCMEKGRVe711p1F0P6hA6evc23x1rOUNOHYOfNB4IpixqkqKdvNa/MPOv37pWwGrp6l/JLMjvGn8XDWnZQ6q6bLsh3SMpxCElRcaTuAA8+Kq31At0i1XXurlHcZcaPKVpx/dbS+nvbvauNtQnVVkj3VspwqRCUEqIxzuQcj8UjdYNNdnbr3b5D2nYiLbPkJJWhSQlTbnqPSlltUZDkKa5KY04zuHT8LWrYnosef8W2dpVxnimz9WiS1llzBUv1GSax1J6T3/pnfTa5UYvRC7lmUkfIpJ9T5V4VwcgMrZTnasAZwamWBzrKxkrmx3A6L0+9t44DaMD+IopbMtGTh0496Kny/Kq5xW01VUl7UcGSdeIIBCF5q8DUR6QoJbbJzUX9ZugN41o5HucC3OOuhQBCU5Ipwx2ohbT2c7qEh8PQTGqBa02IVNrBOmabK5CJrrChylSD/Yp0gdVt70fvZrSZK+O/ZGw5/kKnWP2KpirambqKSpjKdxR5gelJ0js9WePcxbLLD+IdCtuduTmkJ88FS76dR3XpUTZ6RtnaHsf0lq9a5lXeMm23p1uWhYwncndUQaz0Yw86Z0ZpSAAcbc4q8+g+xrIkpauOoDsRjIQr0ps130l0JoiwubrVGeUlH705zWV+IRxODAblbIcPdUtLgAAtVyrHcUqKQtJwceFFW5kRdJF9wiwQAN5/wJ9faitHrW/BUPZ5fkK7+kWmlOjc2k+4FSXbmmxtw2n8UUVziXeKF8L7AS/1K4tzgHA2Gop6QR2HdUOKcYbWQvgqSCaKKC02y5GKndCsLM+VnCeBjwFVn7R7jggOAOKx70UVgj3kep9pVIX9avc0UUUbXS//2Q=="
    }
    
    linkTo(link) {
        this.context.router.history.push(link);
    }

    // 返回
    onBack = () => {
        this.context.router.history.push({ pathname: '/my/productMan' ,params: { fromedit: true}});
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
        this.state.specificationList = JSON.parse(localStorage.getItem("modifySpecificationList"))
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
                                {/* <div className="addr_name">运费：{item.deliverPrice}</div> */}
                            </div>
                            :
                            <div className="address_card_underline">
                                <div className="addr_name">规格：{item.specification}</div>
                                <div className="addr_phone">市场价：{item.marketPrice}</div>
                                <div className="addr_name">成本价：{item.costPrice}</div>
                                <div className="addr_name">销售价：{item.platformPrice}</div>
                                <div className="addr_name">库存：{item.vInboundNumber}</div>
                                {/* <div className="addr_name">运费：{item.deliverPrice}</div> */}
                                <div className="addr_name">代理分成金额：{parseFloat((item.platformPrice-item.costPrice)*this.state.divideStore).toFixed(2)}</div>
                            </div>
                    }
                    {this.state.isEdit ?
                        <div className="address_card_edit">

                            <Button type="ghost" size="small" inline style={{ marginLeft: '5px', float: 'right' }}
                                onClick={() => {
                                    this.deleteSpecification(index);
                                }}
                            >删除</Button>
                            <Button type="ghost" size="small" inline style={{ float: 'right' }}
                                onClick={() => {
                                    var passuser={
                                        "name":this.state.name,
                                        "originalPlace": this.state.originalPlace,
                                        "quality": this.state.quality,
                                        "dividePlatform": this.state.dividePlatform,
                                        "divideStore": this.state.divideStore,
                                        "vInboundNumber": this.state.vInboundNumber,
                                        "productIntro": this.state.productIntro,
                                        "isShowValue":this.state.isShowValue[0],
                                        "isActiveValue":this.state.isActiveValue[0],
                                        "categoryValue":this.state.categoryValue[0],
                                        "brand": this.state.brand
                                    }
                                    localStorage.setItem("modifybasic",JSON.stringify(passuser))
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



    addSpecification() {
        var passuser={
            "name":this.state.name,
            "originalPlace": this.state.originalPlace,
            "quality": this.state.quality,
            "dividePlatform": this.state.dividePlatform,
            "divideStore": this.state.divideStore,
            "vInboundNumber": this.state.vInboundNumber,
            "productIntro": this.state.productIntro,
            "isShowValue":this.state.isShowValue[0],
            "isActiveValue":this.state.isActiveValue[0],
            "categoryValue":this.state.categoryValue[0],
            "brand": this.state.brand
        }
        localStorage.setItem("modifybasic",JSON.stringify(passuser))
        this.context.router.history.push({pathname: '/my/productMan/edit/addSpecification',myid:this.props.location.params.id});
    }

    // 删除包装规格
    deleteSpecification(index) {
        console.log("deleteSpecification index", index);
        this.state.specificationList = JSON.parse(localStorage.getItem("modifySpecificationList"))
        this.state.specificationList.splice(index, 1);
        this.setState({
            specificationList: this.state.specificationList,
        });
        localStorage.setItem("modifySpecificationList",JSON.stringify(this.state.specificationList))
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
            console.log("hahah",this.props.form)
            if (!error) {
                // submit the values
                const categoryId = parseInt(this.state.categoryValue[this.state.categoryValue.length - 1], 10);
                const imageList = [];
                let iconList = [];
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
                if (!this.state.specificationList || this.state.specificationList.length == 0) {
                    Toast.info('请添加包装规格！');
                    return;
                }
                else{
                    this.state.specificationList && this.state.specificationList.map((item, index) => {
                            item.parent = 0
                            item.saleNumber = 1
                            item.deliverPrice = 0
                    });
                }

                console.log("asdfdsaf",this.state.specificationList)
                if (!this.state.productIntro) {
                    Toast.info('请添加产品介绍！');
                    return;
                }

                this.setState({isloading: true});
                //标志图片
                let formData = new FormData();
                if(this.state.files[0].id){
                    let files = this.state.files[0].file;
                    formData.append("files", files);
    
                        iconList.push({
                            // "mediumPath": "http://hrmall.bjhongruijiye.com" + rs.obj[0],
                            "mediumPath": this.state.files[0].origin,
                        });
                        console.log('iconList: ', iconList);
    
                        //产品图片
                        let sendPic = 0;
                        const shouldUploadNum = this.state.files2.length;
                        for (let i = 0; i < this.state.files2.length; i++) {
                            
                            let formData2 = new FormData();
                            let files2 = this.state.files2[i].file;
                            formData2.append("files", files2);
    
                            if(this.state.files2[i].id){
                                imageList.push({
                                    // "mediumPath": "hrmall.bjhongruijiye.com" + rs.obj[0],
                                    "mediumPath": this.state.files2[i].origin,
                                });
                                sendPic = sendPic + 1;
                                if (sendPic === shouldUploadNum){
                                    const param = {
                                        specialty: {
                                            name: this.state.name,
                                            originalPlace: this.state.originalPlace,
                                            durabilityPeriod: this.state.quality.toString(),
                                            dividePlatform: parseFloat(this.state.dividePlatform),
                                            divideStore: parseFloat(this.state.divideStore),
                                            isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                                            category: {
                                                id: categoryId,
                                            },//分类
                                            specifications: this.state.specificationList,//包装规格
                                            icon: iconList[0],//标志图片
                                            images: imageList,//特产介绍图片
                                            descriptions: this.state.productIntro,
                    
                                            id: this.props.location.params.id,//商品id
                                            isActive: this.state.isActiveValue[0],//有效
                                            brand:this.state.brand
                                        },
                                        webusinessId: LocalStorageManager.getUid(),
                                    }
                    
                                    console.log("param: ", param);
                    
                                    myApi.editProduct(param, (rs) => {
                                        if (rs && rs.success) {
                                            this.setState({isloading: false});
                                            Toast.info(rs.msg, 1);
                                            this.context.router.history.push({pathname: '/my/productMan',params: { fromedit: true}});
                                        } else {
                                            this.setState({isloading: false});
                                            // Toast.info(rs.msg, 1);
                                            Toast.offline(rs.msg, 1);
                                        }
                                    });
                                } 
                            }
                            else{
                                upload.uploadImg(formData2, (rs)=>{

                                    if (rs && rs.success) {
                                        console.log('mediumPath', rs)
                                        imageList.push(rs.obj[0]);
                                        sendPic = sendPic + 1;
                                        console.log('imageList: ', imageList);

                                        if (sendPic === shouldUploadNum){
                                            const param = {
                                                specialty: {
                                                    name: this.state.name,
                                                    originalPlace: this.state.originalPlace,
                                                    durabilityPeriod: this.state.quality.toString(),
                                                    dividePlatform: parseFloat(this.state.dividePlatform),
                                                    divideStore: parseFloat(this.state.divideStore),
                                                    isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                                                    category: {
                                                        id: categoryId,
                                                    },//分类
                                                    specifications: this.state.specificationList,//包装规格
                                                    icon: iconList[0],//标志图片
                                                    images: imageList,//特产介绍图片
                                                    descriptions: this.state.productIntro,

                                                    id: this.props.location.params.id,//商品id
                                                    isActive: this.state.isActiveValue[0],//有效
                                                    brand:this.state.brand
                                                },
                                                webusinessId: LocalStorageManager.getUid(),
                                            }

                                            console.log("param: ", param);

                                            myApi.editProduct(param, (rs) => {
                                                if (rs && rs.success) {
                                                    this.setState({isloading: false});
                                                    Toast.info(rs.msg, 1);
                                                    this.context.router.history.push({pathname: '/my/productMan',params: { fromedit: true}});
                                                } else {
                                                    this.setState({isloading: false});
                                                    // Toast.info(rs.msg, 1);
                                                    Toast.offline(rs.msg, 1);
                                                }
                                            });
                                        }


                                    } else {

                                    }
                                });

                                // fetch(imgUploadURL, {
                                //     method: 'POST',
                                //     headers: {}, body: formData2,
                                // }).then((response) => response.json()).then((rs) => {
                                //     console.log('mediumPath', rs)
                                //     imageList.push(rs.obj[0]);
                                //     sendPic = sendPic + 1;
                                //     console.log('imageList: ', imageList);
                                //
                                //     if (sendPic === shouldUploadNum){
                                //         const param = {
                                //             specialty: {
                                //                 name: this.state.name,
                                //                 originalPlace: this.state.originalPlace,
                                //                 durabilityPeriod: this.state.quality.toString(),
                                //                 dividePlatform: parseFloat(this.state.dividePlatform),
                                //                 divideStore: parseFloat(this.state.divideStore),
                                //                 isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                                //                 category: {
                                //                     id: categoryId,
                                //                 },//分类
                                //                 specifications: this.state.specificationList,//包装规格
                                //                 icon: iconList[0],//标志图片
                                //                 images: imageList,//特产介绍图片
                                //                 descriptions: this.state.productIntro,
                                //
                                //                 id: this.props.location.params.id,//商品id
                                //                 isActive: this.state.isActiveValue[0]//有效
                                //             },
                                //             webusinessId: LocalStorageManager.getUid(),
                                //         }
                                //
                                //         console.log("param: ", param);
                                //
                                //         myApi.editProduct(param, (rs) => {
                                //             if (rs && rs.success) {
                                //                 Toast.info(rs.msg, 1);
                                //                 this.context.router.history.push({pathname: '/my/productMan'});
                                //             } else {
                                //                 // Toast.info(rs.msg, 1);
                                //                 Toast.offline(rs.msg, 1);
                                //             }
                                //         });
                                //     }
                                //         // this.add(categoryId, iconList, imageList);
                                // });
                            }

                        }
                }
                else{
                    let files = this.state.files[0].file;
                    formData.append("files", files);

                    upload.uploadImg(formData, (rs)=> {

                        if (rs && rs.success) {
                            console.log('mediumPath', rs)
                            iconList.push(rs.obj[0]);
                            console.log('iconList: ', iconList);

                            //产品图片
                            let sendPic = 0;
                            const shouldUploadNum = this.state.files2.length;
                            for (let i = 0; i < this.state.files2.length; i++) {

                                let formData2 = new FormData();
                                let files2 = this.state.files2[i].file;
                                formData2.append("files", files2);

                                if(this.state.files2[i].id){
                                    imageList.push({
                                        // "mediumPath": "hrmall.bjhongruijiye.com" + rs.obj[0],
                                        "mediumPath": this.state.files2[i].origin,
                                    });
                                    sendPic = sendPic + 1;
                                    if (sendPic === shouldUploadNum){
                                        const param = {
                                            specialty: {
                                                name: this.state.name,
                                                originalPlace: this.state.originalPlace,
                                                durabilityPeriod: this.state.quality.toString(),
                                                dividePlatform: parseFloat(this.state.dividePlatform),
                                                divideStore: parseFloat(this.state.divideStore),
                                                isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                                                category: {
                                                    id: categoryId,
                                                },//分类
                                                specifications: this.state.specificationList,//包装规格
                                                icon: iconList[0],//标志图片
                                                images: imageList,//特产介绍图片
                                                descriptions: this.state.productIntro,

                                                id: this.props.location.params.id,//商品id
                                                isActive: this.state.isActiveValue[0],//有效
                                                brand:this.state.brand
                                            },
                                            webusinessId: LocalStorageManager.getUid(),
                                        }

                                        console.log("param: ", param);

                                        myApi.editProduct(param, (rs) => {
                                            if (rs && rs.success) {
                                                this.setState({isloading: false});
                                                Toast.info(rs.msg, 1);
                                                this.context.router.history.push({pathname: '/my/productMan',params: { fromedit: true}});
                                            } else {
                                                this.setState({isloading: false});
                                                // Toast.info(rs.msg, 1);
                                                Toast.offline(rs.msg, 1);
                                            }
                                        });
                                    }
                                }
                                else{
                                    upload.uploadImg(formData2, (rs)=> {

                                        if (rs && rs.success) {
                                            console.log('mediumPath', rs)
                                            imageList.push(rs.obj[0]);
                                            sendPic = sendPic + 1;
                                            console.log('imageList: ', imageList);

                                            if (sendPic === shouldUploadNum){
                                                const param = {
                                                    specialty: {
                                                        name: this.state.name,
                                                        originalPlace: this.state.originalPlace,
                                                        durabilityPeriod: this.state.quality.toString(),
                                                        dividePlatform: parseFloat(this.state.dividePlatform),
                                                        divideStore: parseFloat(this.state.divideStore),
                                                        isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                                                        category: {
                                                            id: categoryId,
                                                        },//分类
                                                        specifications: this.state.specificationList,//包装规格
                                                        icon: iconList[0],//标志图片
                                                        images: imageList,//特产介绍图片
                                                        descriptions: this.state.productIntro,

                                                        id: this.props.location.params.id,//商品id
                                                        isActive: this.state.isActiveValue[0],//有效
                                                        brand:this.state.brand
                                                    },
                                                    webusinessId: LocalStorageManager.getUid(),
                                                }

                                                console.log("param: ", param);

                                                myApi.editProduct(param, (rs) => {
                                                    if (rs && rs.success) {
                                                        this.setState({isloading: false});
                                                        Toast.info(rs.msg, 1);
                                                        this.context.router.history.push({pathname: '/my/productMan',params: { fromedit: true}});
                                                    } else {
                                                        this.setState({isloading: false});
                                                        // Toast.info(rs.msg, 1);
                                                        Toast.offline(rs.msg, 1);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    // fetch(imgUploadURL, {
                                    //     method: 'POST',
                                    //     headers: {}, body: formData2,
                                    // }).then((response) => response.json()).then((rs) => {
                                    //     console.log('mediumPath', rs)
                                    //     imageList.push(rs.obj[0]);
                                    //     sendPic = sendPic + 1;
                                    //     console.log('imageList: ', imageList);
                                    //
                                    //     if (sendPic === shouldUploadNum){
                                    //         const param = {
                                    //             specialty: {
                                    //                 name: this.state.name,
                                    //                 originalPlace: this.state.originalPlace,
                                    //                 durabilityPeriod: this.state.quality.toString(),
                                    //                 dividePlatform: parseFloat(this.state.dividePlatform),
                                    //                 divideStore: parseFloat(this.state.divideStore),
                                    //                 isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                                    //                 category: {
                                    //                     id: categoryId,
                                    //                 },//分类
                                    //                 specifications: this.state.specificationList,//包装规格
                                    //                 icon: iconList[0],//标志图片
                                    //                 images: imageList,//特产介绍图片
                                    //                 descriptions: this.state.productIntro,
                                    //
                                    //                 id: this.props.location.params.id,//商品id
                                    //                 isActive: this.state.isActiveValue[0]//有效
                                    //             },
                                    //             webusinessId: LocalStorageManager.getUid(),
                                    //         }
                                    //
                                    //         console.log("param: ", param);
                                    //
                                    //         myApi.editProduct(param, (rs) => {
                                    //             if (rs && rs.success) {
                                    //                 Toast.info(rs.msg, 1);
                                    //                 this.context.router.history.push({pathname: '/my/productMan'});
                                    //             } else {
                                    //                 // Toast.info(rs.msg, 1);
                                    //                 Toast.offline(rs.msg, 1);
                                    //             }
                                    //         });
                                    //     }
                                    //     // this.add(categoryId, iconList, imageList);
                                    // });
                                }

                            }
                        }
                    });

                    // fetch(imgUploadURL, {
                    //     method: 'POST',
                    //     headers: {}, body: formData,
                    // }).then((response) => response.json()).then((rs) => {
                    //     console.log('mediumPath', rs)
                    //     iconList.push(rs.obj[0]);
                    //     console.log('iconList: ', iconList);
                    //
                    //     //产品图片
                    //     let sendPic = 0;
                    //     const shouldUploadNum = this.state.files2.length;
                    //     for (let i = 0; i < this.state.files2.length; i++) {
                    //
                    //         let formData2 = new FormData();
                    //         let files2 = this.state.files2[i].file;
                    //         formData2.append("files", files2);
                    //
                    //         if(this.state.files2[i].id){
                    //             imageList.push({
                    //                 // "mediumPath": "hrmall.bjhongruijiye.com" + rs.obj[0],
                    //                 "mediumPath": this.state.files2[i].origin,
                    //             });
                    //             sendPic = sendPic + 1;
                    //             if (sendPic === shouldUploadNum){
                    //                 const param = {
                    //                     specialty: {
                    //                         name: this.state.name,
                    //                         originalPlace: this.state.originalPlace,
                    //                         durabilityPeriod: this.state.quality.toString(),
                    //                         dividePlatform: parseFloat(this.state.dividePlatform),
                    //                         divideStore: parseFloat(this.state.divideStore),
                    //                         isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                    //                         category: {
                    //                             id: categoryId,
                    //                         },//分类
                    //                         specifications: this.state.specificationList,//包装规格
                    //                         icon: iconList[0],//标志图片
                    //                         images: imageList,//特产介绍图片
                    //                         descriptions: this.state.productIntro,
                    //
                    //                         id: this.props.location.params.id,//商品id
                    //                         isActive: this.state.isActiveValue[0]//有效
                    //                     },
                    //                     webusinessId: LocalStorageManager.getUid(),
                    //                 }
                    //
                    //                 console.log("param: ", param);
                    //
                    //                 myApi.editProduct(param, (rs) => {
                    //                     if (rs && rs.success) {
                    //                         Toast.info(rs.msg, 1);
                    //                         this.context.router.history.push({pathname: '/my/productMan'});
                    //                     } else {
                    //                         // Toast.info(rs.msg, 1);
                    //                         Toast.offline(rs.msg, 1);
                    //                     }
                    //                 });
                    //             }
                    //         }
                    //         else{
                    //             fetch(imgUploadURL, {
                    //                 method: 'POST',
                    //                 headers: {}, body: formData2,
                    //             }).then((response) => response.json()).then((rs) => {
                    //                 console.log('mediumPath', rs)
                    //                 imageList.push(rs.obj[0]);
                    //                 sendPic = sendPic + 1;
                    //                 console.log('imageList: ', imageList);
                    //
                    //                 if (sendPic === shouldUploadNum){
                    //                     const param = {
                    //                         specialty: {
                    //                             name: this.state.name,
                    //                             originalPlace: this.state.originalPlace,
                    //                             durabilityPeriod: this.state.quality.toString(),
                    //                             dividePlatform: parseFloat(this.state.dividePlatform),
                    //                             divideStore: parseFloat(this.state.divideStore),
                    //                             isVisible: this.state.isShowValue[0]==1?true:false,//是否对其他店铺可见
                    //                             category: {
                    //                                 id: categoryId,
                    //                             },//分类
                    //                             specifications: this.state.specificationList,//包装规格
                    //                             icon: iconList[0],//标志图片
                    //                             images: imageList,//特产介绍图片
                    //                             descriptions: this.state.productIntro,
                    //
                    //                             id: this.props.location.params.id,//商品id
                    //                             isActive: this.state.isActiveValue[0]//有效
                    //                         },
                    //                         webusinessId: LocalStorageManager.getUid(),
                    //                     }
                    //
                    //                     console.log("param: ", param);
                    //
                    //                     myApi.editProduct(param, (rs) => {
                    //                         if (rs && rs.success) {
                    //                             Toast.info(rs.msg, 1);
                    //                             this.context.router.history.push({pathname: '/my/productMan'});
                    //                         } else {
                    //                             // Toast.info(rs.msg, 1);
                    //                             Toast.offline(rs.msg, 1);
                    //                         }
                    //                     });
                    //                 }
                    //                     // this.add(categoryId, iconList, imageList);
                    //             });
                    //         }
                    //
                    //     }
                    // });
                }


            }

        })
    }

    onSale() {
        const id = this.props.location.params.id;
        myApi.sellProductHandler(LocalStorageManager.getUid(), id, (rs) => {
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
        console.log("asd",this.state.isloading)
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
                            // {...getFieldProps('name', {
                            //     rules: [
                            //         { required: true, message: '产品名称为必填项' },
                            //     ],

                            // })}
                            error={!!getFieldError('name')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('name').join(','), 2);
                            }}
                            placeholder="请输入产品名称"
                            clear
                            value={this.state.name}
                            onChange={v => this.setState({ name: v })}
                            editable={isEdit}
                        >
                            产品名称
                        </InputItem>
                        <Picker
                            // data={this.state.categoryList}
                            data = {this.state.categoryList}
                            cols={2}
                            className="forss"
                            value={this.state.categoryValue}
                            onChange={this.onChangeCategory}
                            disabled={!isEdit}
                        >
                            <List.Item arrow="horizontal">产品类别</List.Item>
                        </Picker>
                        <InputItem
                            placeholder="请输入品牌"
                            clear
                            value={this.state.brand}
                            onChange={v => this.setState({ brand: v })}
                            editable={isEdit}
                        >
                            品牌
                        </InputItem>
                        <InputItem
                            // {...getFieldProps('originalPlace', {
                            //     rules: [
                            //         { required: true, message: '产地为必填项' },
                            //     ],

                            // })}
                            error={!!getFieldError('originalPlace')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('originalPlace').join(','), 2);
                            }}
                            placeholder="请输入产地"
                            clear
                            value={this.state.originalPlace}
                            onChange={v => this.setState({ originalPlace: v })}
                            editable={isEdit}
                        >
                            产地
                        </InputItem>
                        <InputItem
                            // {...getFieldProps('quality', {
                            //     rules: [
                            //         { required: true, message: '保质期为必填项' },
                            //     ],

                            // })}
                            error={!!getFieldError('quality')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('quality').join(','), 2);
                            }}
                            placeholder="请输入保质期"
                            clear
                            value={this.state.quality}
                            editable={isEdit}
                            onChange={v => this.setState({ quality: v })}
                        >
                            保质期
                        </InputItem>
                        <Picker
                            extra="请选择"
                            data={isShow}
                            value={this.state.isShowValue}
                            cols={1}
                            className="forss"
                            onChange={this.onChangeShow}
                            disabled={!isEdit}
                        >
                            <List.Item arrow="horizontal">允许其他微商代理</List.Item>
                        </Picker>
                        <InputItem
                            // {...getFieldProps('divideStore', {
                            //     rules: [
                            //         { required: true, message: '代理店铺分成比例为必填项' },
                            //     ],

                            // })}
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
                            onChange={v => this.setState({ divideStore: v })}
                            editable={isEdit}
                        >
                            代理店铺分成比例
                        </InputItem>
                        <InputItem
                            // {...getFieldProps('dividePlatform', {
                            //     rules: [
                            //         { required: true, message: '平台分成比例为必填项' },
                            //     ],

                            // })}
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
                            onChange={v => this.setState({ dividePlatform: v })}
                            editable={false}
                        >
                            平台分成比例
                        </InputItem>
                        <Picker
                            extra="请选择"
                            data={isActive}
                            value={this.state.isActiveValue}
                            cols={1}
                            className="forss"
                            onChange={this.onChangeActive}
                            disabled={!isEdit}
                        >
                            <List.Item arrow="horizontal">销售状态</List.Item>
                        </Picker>

                    </div>
                    <div className="product_container">
                        <WhiteSpace />

                        {this.checkSpecification()}
                        <WhiteSpace />
                        {
                            this.state.isEdit ?
                                <div style={{height: '2.5rem' , width: '40%',margin:'0 auto'}}>
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
                        <List.Item className={this.state.isEdit?"":"caijiankuang"}>
                            标志图片

                            {/* <ImgCropper filesLength={1} storageName="iconStorage"
                                        files={this.state.files} handleFiles={this.handleFiles.bind(this)}/> */}
                            
                            {/* {this.state.files[0].url}?<img src={this.state.files[0].url}></img>:<div></div> */}
                            <AnotherImgCropper filesLength={1} storageName="iconStorage"
                            files={this.state.files} handleFiles={this.handleFiles.bind(this)} biaozhi={true} chakan={isEdit}/>
                        </List.Item>
                        <List.Item className={this.state.isEdit?"":"caijiankuang"}>
                            产品图片

                            {/* <ImgCropper filesLength={6} storageName="imagesStorage"
                                        files={this.state.files2} handleFiles={this.handleFiles2.bind(this)}/> */}
                            <AnotherImgCropper filesLength={6} storageName="imagesStorage"
                            files={this.state.files2} handleFiles={this.handleFiles2.bind(this)} biaozhi={false} chakan={isEdit}/>

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
                            editable={isEdit}
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
                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={this.state.isloading}
                />
            </div>




        </Layout>
    }
}


ModifyProduct.contextTypes = {
    router: PropTypes.object.isRequired
};
const ModifyProductPage = createForm()(ModifyProduct);
export default ModifyProductPage;