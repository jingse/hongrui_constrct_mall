import React from 'react';
import PropTypes from "prop-types";
import {Button, Modal, TabBar, Toast} from 'antd-mobile';
import "./putincart.less";
import cartApi from "../../api/cart.jsx";
import systemSet from "../../api/setting.jsx"


const alert = Modal.alert;


export default class PutInCart extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedTab: '',

            cartCount: parseInt(localStorage.getItem("cartCount")) !== 0 ? parseInt(localStorage.getItem("cartCount")) : 0,
        };
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    linkTo(link) {
        if (link !== this.state.selectedTab) {
            this.context.router.history.push(link);
            this.setState({
                selectedTab: link
            });
        }
    }

    getCartCount() {
        cartApi.getCartItemsList(localStorage.getItem("wechatId"), localStorage.getItem("businessId"),(rs) => {
            if (rs && rs.success) {
                const count = rs.obj.length;
                localStorage.setItem("cartCount", count);

                this.setState({
                    cartCount: count,
                });
            }
        });
    }


    checkSpecificationSelection(modalSelectorText, showModal) {
        if (modalSelectorText === '未选择') {
            Toast.info("您还未选择商品规格~", 1);

            showModal();

            return false;
        }
        return true;
    }

    addToCart(cartProps) {
        cartApi.addSingleItemToCart(cartProps.wechatId, cartProps.specificationId, cartProps.specialtyId,
            cartProps.isGroupPromotion, cartProps.quantity, localStorage.getItem("businessId"), localStorage.getItem("ownerbusinessId"), (rs) => {

                if (rs && rs.success) {
                    Toast.success('加入成功，快去购物车看看你的宝贝吧～', 1, null, false);

                    this.getCartCount();
                } else {
                    Toast.info("添加失败！", 1);
                }

            });
    }


    buyImmediately(buyProps) {
        let buyItem = buyProps.buyItem;
        let isPromotion = buyProps.isPromotion;
        let origin = buyProps.origin;

        let price = {};
        let presents = [];

        cartApi.getTotalPriceInCart(buyItem, (rs) => {
            if (rs && rs.success) {
                price = rs.obj;

                rs.obj.promotions && rs.obj.promotions.map((item, index) => {
                    if (item.promotion && JSON.stringify(item.promotion) !== '{}') {
                        if (item.promotion.promotionRule === "满赠") {
                            item.promotionCondition && item.promotionCondition.map((pre, index2) => {
                                pre.promotionId = item.promotionId;
                                presents.push(pre);
                            });
                        }
                    }
                });

                console.log("赠品：", presents);
                console.log("buyImmediately price", price);

                if (price !== {}) {

                    this.context.router.history.push({
                        pathname: '/cart/payment',

                        origin: origin,
                        isPromotion: isPromotion,
                        products: buyItem,

                        price: price,
                        presents: presents,
                        // shipFee: this.state.data[0].deliverPrice
                    });
                }
            } else {
                Toast.info("购买失败！", 1);
            }
        });

    }


    renderButton(modalSelectorText, showModal, cartProps, buyProps) {

        return <div className="putincart">

            <span className="product_footer">
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#f28b12"
                    barTintColor="#fff"

                >
                    <TabBar.Item
                        key="首页"
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/home.png) center center /  24px 24px no-repeat'
                        }}
                        />}
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/home-fill2.png) center center /  24px 24px no-repeat'
                        }}
                        />}
                        selected={this.state.selectedTab === 'home'}
                        onPress={() => {
                            this.linkTo('/home');
                        }}
                        data-seed="logId"
                    />
                    <TabBar.Item
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/cart.png) center center /  24px 24px no-repeat'
                        }}
                        />}
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/cart-fill2.png) center center /  24px 24px no-repeat'
                        }}
                        />}
                        key="购物车"
                        badge={this.state.cartCount}
                        selected={this.state.selectedTab === 'cart'}
                        onPress={() => {
                            this.linkTo('/cart');
                        }}
                    />
                    <TabBar.Item
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/phone.png) center center /  24px 24px no-repeat'
                        }}
                        />}
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/phone.png) center center /  24px 24px no-repeat'
                        }}
                        />}
                        key="联系卖家"
                        selected={this.state.selectedTab === 'phone'}
                        // onPress={()=>{window.location.href="tel:" + "13103361866"}}
                        onPress={() => alert('请选择联系电话', <div/>, [
                            {
                                text: '手机', onPress: () => {
                                    systemSet.getSystemSetting("运营人员手机号", (rs)=>{
                                        if(rs && rs.success){
                                            window.location.href = "tel:" + rs.obj.settingValue
                                        }
                                        else{
                                            Toast.info("获取号码出错！",1);
                                        }
                                    })                                  
                                }
                            },
                            // {
                            //     text: '座机', onPress: () => {
                            //         window.location.href = "tel:" + "0316-2360787"
                            //     }
                            // },
                        ])}
                    />
                </TabBar>
            </span>

            <Button type="primary" inline
                    style={{
                        marginLeft: '37%',
                        marginTop: '4px',
                        marginBottom: '4px',
                        marginRight: '4px',
                        width: '30%',
                        backgroundColor: 'darkorange',
                        fontSize: '1rem'
                    }}
                    onClick={() => {
                        this.props.handleAction('addToCart');
                        this.checkSpecificationSelection(modalSelectorText, showModal) && this.addToCart(cartProps)
                    }}>
                加购物车
            </Button>

            <Button type="primary" inline
                    style={{
                        marginTop: '4px',
                        marginBottom: '4px',
                        marginRight: '4px',
                        width: '30%',
                        backgroundColor: 'red',
                        fontSize: '1rem'
                    }}
                    onClick={() => {
                        this.props.handleAction('buyImmediately');
                        this.checkSpecificationSelection(modalSelectorText, showModal) && this.buyImmediately(buyProps)
                    }}>
                立即购买
            </Button>

        </div>
    }

    render() {
        let {style, modalSelectorText, showModal, cartProps, buyProps} = this.props;
        const button = this.renderButton(modalSelectorText, showModal, cartProps, buyProps);

        return <div style={{...style}}>
            {button}
        </div>
    }
}


PutInCart.contextTypes = {
    router: PropTypes.object.isRequired
};
