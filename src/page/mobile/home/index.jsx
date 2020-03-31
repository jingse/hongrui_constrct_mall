import React from 'react';
import {Link} from 'react-router-dom';
import {ActivityIndicator, Carousel, Modal, WhiteSpace, Toast} from "antd-mobile";

import LoadingHoc from "../../../common/loading/loading-hoc.jsx";
import Layout from "../../../common/layout/layout.jsx";
import Bottom from "../../../components/bottom/index.jsx";

import {InfoCard} from "./card.jsx";
import Grid from "./grid_categoryList.jsx";

import WxManager from "../../../manager/WxManager.jsx";
import locManager from "../../../manager/LockManager.jsx";

import homeApi from "../../../api/home.jsx";
import cartApi from "../../../api/cart.jsx";
import {getServerIp} from '../../../config.jsx';

import './index.less';


class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            carousel: [{}, {}],
            card: {},
            tags: [],
            gridCategory: [],

            isLoading: false,
            animating: false,
            modalBack: false,

            cusuid:-1
        };
    }

    componentWillMount() {
        console.groupCollapsed("首页");

        this.setState({animating: !this.state.animating});

        // console.log("browser localStorage", localStorage.valueOf());

        // window.addEventListener("popstate", function(e) {
        //     //alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
        //     var ua = navigator.userAgent.toLowerCase();
        //     if(ua.match(/MicroMessenger/i)=="micromessenger") {
        //         localStorage.clear();
        //         WeixinJSBridge.call('closeWindow'); //微信
        //     }
        // }, false);


        WxManager.auth();

        this.init();

        

        setTimeout(() => {
            this.checkLogin();
        }, 500);

        localStorage.removeItem("dest");

        // Toast.info('???', localStorage.getItem("isWebusiness"));

    }

    componentDidMount() {
        this.closeTimer = setTimeout(() => {
            this.setState({animating: !this.state.animating});
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.closeTimer);
        console.groupEnd();
        // WxManager.wxClosePage('home');
    }


    // 初始操作：判断用户是否是第一次登录
    // 是微商第一次登录：将他的微信昵称、微信openid、点开的链接中的微商uid提交给后台
    // 不是第一次登录：提交微信昵称、微信openid给后台，创建账号
    init() {
        // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=你自己的appid&redirect_uri=微信想要回调的你的页面&response_type=code&scope=snsapi_userinfo&state=xxx#wechat_redirect'
        const uid = locManager.getUId();
        const myopenid = locManager.getMyOpenId();
        const mynickname = locManager.getMyNickname();

        // Toast.info(`oldUid: ${oldUid}`,1)
        console.log("openid: ", myopenid);


        if (uid) {          // 第一次扫码，url带uid字段，不带from_user
            localStorage.setItem("uid", uid);

            console.log("uid存在");
            console.log("myopenid", myopenid);

            homeApi.postOpenId(uid, mynickname, myopenid, (rs) => {
                if (rs.msg && rs.msg !== "")
                    console.log(rs);

                if (rs.obj !== null)
                    window.location.href = rs.obj;
            });

        } else {            // 分享后的链接，url不带uid字段，带from_user
            console.log("uid不存在");
            homeApi.createAccount(mynickname, myopenid, (rs) => {
                // localStorage.setItem("isWebusiness", 'false');
                // alert(rs);
            });
        }
    }

    getCookie(c_name)
    {
        console.log("coo",document.cookie)
        　　　　if (document.cookie.length>0){　　//先查询cookie是否为空，为空就return ""
        　　　　　　var c_start=document.cookie.indexOf(c_name + "=")　　//通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
        　　　　　　if (c_start!=-1){ 
        　　　　　　　　c_start=c_start + c_name.length+1　　//最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
        　　　　　　　　var c_end=document.cookie.indexOf(";",c_start)　　//其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
        　　　　　　　　if (c_end==-1) c_end=document.cookie.length　　
        　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))　　//通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
        　　　　　　} 
        　　　　}
        return "kong"
    }

    checkLogin() {

        let uid = locManager.getUId();
        const myopenid = locManager.getMyOpenId();
        const wechatName = localStorage.getItem('nickname');

        if (!uid)
            uid = -1;

        console.log("login param openid", myopenid);
        console.log("login param wechatName", wechatName);
        console.log(" uiduiduid", uid);

        //微商测试
        // let leoopid = 'o0zQdxCx7HoEC8AczE8MnJJf6Ftk';
        // let uuuu = 2;
        // let leoname = 'Leo';

        // let leoopid = 'o0zQdxB1JcLO19VR2D6eoQHYOH5s';
        // let uuuu = 3;
        // let leoname = '我是......';

        // let leoopid = 'o0zQdxBKCEgmV9WnVXI8fAvhA25k';
        // let uuuu = 6;
        // let leoname = 'chinalcc';
        // homeApi.loginCheck(leoopid, uuuu, leoname, (rs) => {
        homeApi.loginCheck(myopenid, uid, wechatName, (rs) => {
            if (rs && rs.success) {

                console.log("loginCheck rs:", rs);

                const wechatId = rs.obj.id;
                const balance = rs.obj.totalbalance;
                const isVip = rs.obj.isVip;
                // const bindPhone = rs.obj.phone;


                rs.obj.isWeBusiness ? localStorage.setItem("isWebusiness", '1') : localStorage.setItem("isWebusiness", '0');

                if (rs.obj.phone)
                    localStorage.setItem("bindPhone", rs.obj.phone);

                localStorage.setItem("wechatId", wechatId);
                localStorage.setItem("balance", balance);
                localStorage.setItem("isVip", isVip);

                if(uid == -1 && rs.obj.customer_uid  != null){
                    this.state.cusuid = rs.obj.customer_uid
                    console.log("?进到这了",this.state.cusuid)
                    uid = rs.obj.customer_uid
                    // window.location.href="http://hrmall.bjhongruijiye.com/?uid=" + uid; 
                }
                else if(uid == -1 && rs.obj.customer_uid  == null){
                    this.state.cusuid = 1
                    uid = 1
                    // window.location.href="http://hrmall.bjhongruijiye.com/?uid=" + uid; 
                }
                // localStorage.setItem("businessId", uuuu); //测试缓存
                localStorage.setItem("businessId", uid); //实际缓存
                localStorage.setItem("uid", uid); //实际缓存

                localStorage.setItem("cusuid", rs.obj.customer_uid);
                uid !== -1 && this.requestMerchantInfo(uid);
                // document.cookie="webusiness_id="+uid;
                // console.log("cookie",this.getCookie('webusiness_id'))
                // if(localStorage.getItem("isWebusiness")==0){
                //     console.log("????",localStorage.getItem("isWebusiness"))
                //     Toast.info('您还不是微商，请注册！', 1);
                // }
                WxManager.share();
            }
        });

        this.requestCarousel();
        
        this.requestTags();
        this.requestCategories();


        localStorage.setItem("firstLog", 'true');


        // 为了测试使用
        // if (!localStorage.getItem("wechatId")) {
        //     localStorage.setItem("wechatId", "48");
        //     // localStorage.setItem("uid",'191'); 
        //     // localStorage.setItem("isWebusiness", "1");
        // }


        this.requestCartCount(); //设置初始时购物车的数量

        console.log("localStorage wechatId", localStorage.getItem("wechatId"));
        console.log("localStorage isWebusiness", localStorage.getItem("isWebusiness"));
        console.log("localStorage bindPhone", localStorage.getItem("bindPhone"));
    }


    requestCarousel() {
        homeApi.getCarousel((rs) => {
            if (rs && rs.success) {
                const carousel = rs.obj;
                this.setState({
                    carousel,
                });
            }
        });
    }

    requestMerchantInfo(merchantId) {
        homeApi.getMerchantInfo(merchantId, (rs) => {
            if (!rs.obj.weBusiness.isActive)
                this.setState({modalBack: true});

            if (rs && rs.success) {
                localStorage.setItem("address",rs.obj.weBusiness.address)
                localStorage.setItem("shopName",rs.obj.weBusiness.shopName)
                WxManager.share();
                const card = rs.obj;
                this.setState({
                    card
                }, () => {

                    if (this.state.card.weBusiness.openid === localStorage.getItem("openid")) {
                        console.log("isWebusiness设为1");
                        localStorage.setItem("isWebusiness", 1);
                    }

                });
            }

        });
    }

    requestTags() {
        homeApi.getTags((rs) => {
            if (rs && rs.success) {
                const tags = rs.obj;
                this.setState({
                    tags
                });
            }
        });
    }

    requestCategories() {
        homeApi.getCategories((rs) => {
            // this.checkLogin();//延迟重新登录
            if (rs && rs.success) {
                const gridCategory = rs.obj;
                this.setState({
                    gridCategory
                });
            }
        });
    }

    requestCartCount() {
        cartApi.getCartItemsList(localStorage.getItem("wechatId"), localStorage.getItem("businessId"),(rs) => {
            if (rs && rs.success) {
                const count = rs.obj.length;
                localStorage.setItem("cartCount", count);
            }
        });
    }


    render() {
        // if(localStorage.getItem("isWebusiness")=='0'){
        //     console.log("????",localStorage.getItem("isWebusiness"))
        //     Toast.info('您还不是微商，请注册！', 1);
        // }
        let content;
        const category = this.state.gridCategory;
        const categories = category && category.map((item, index) => {
            return <Grid key={index} categoryId={item.id} categoryPropData={item.name} picUrl={item.iconUrl} type="fruits"/>
        });

        const primaryImages = this.state.carousel;
        if (primaryImages.length === 1)
            primaryImages[1] = primaryImages[0];

        content = primaryImages && primaryImages.map((data, index) => {
            if (data.type === "广告")
                return <Link to={{pathname: '/home/ad', state: data.link}} key={index}>
                    <img key={index} src={"http://" + getServerIp() + data.img} className="carousel-img"
                         onLoad={() => { window.dispatchEvent(new Event('resize')); }}/>
                </Link>;
            else if (data.type === "活动")
                return <Link to={{pathname: data.isCheck === 0 ? "/home/sales" : "/home/sales_group", state: data.targetId}} key={index}>
                    <img src={"http://" + getServerIp() + data.img} className="carousel-img"
                         onLoad={() => { window.dispatchEvent(new Event('resize')); }}/>
                </Link>;
            else
                return <Link to={`/product/${data.targetId}`} key={index}>
                    <img src={"http://" + getServerIp() + data.img} className="carousel-img"
                         onLoad={() => { window.dispatchEvent(new Event('resize')); }}/>
                </Link>
        });
        // return  locManager.getUId()?<Layout header={true} footer={true}>
        return  <Layout header={true} footer={true}>

            <div className="carousel_view">
                <Carousel
                    className="my-carousel"
                    style={{touchAction: 'none'}}
                    autoplay={true}
                    infinite
                    selectedIndex={0}
                    swipeSpeed={35}
                    dots={true}
                >
                    {content}
                </Carousel>
            </div>

            <InfoCard cardData={this.state.card}/>
            {/* <GridCategory gridData={this.state.gridCategory} tagData={this.state.tags}/> */}

            {categories}

            <WhiteSpace/>
            <Bottom>已经到底啦</Bottom>


            {/* <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
            /> */}
            <Modal
                visible={this.state.modalBack}
                transparent
                maskClosable={false}
                title="提示"
                footer={[{
                    text: '退出', onPress: () => {
                        //WeixinJSBridge.call('closeWindow');
                        wx.closeWindow();
                    }
                }]}
            >
                该微商已失效
            </Modal>
        </Layout>
        // :
        // <div>
        // <div style={{height:'40%'}}></div>
        // <div className="tiaozhuan" style={{height:'50%'}}><font size="3">跳转中...</font></div>
        // {/* <ActivityIndicator toast text="跳转中..." /> */}
        // </div>    
    }
}

export default LoadingHoc(Home);