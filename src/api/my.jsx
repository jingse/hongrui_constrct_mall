import { getServerHost } from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';

var api = {
    /**
     * [my center info]
     */
    getInfo(wechat_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/usermanagement/info?wechat_id=' + wechat_id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    validatePhone(phone, callback) {
        let formdata = new FormData();
        formdata.append("phone", phone);

        httpManager.ajax({
            method: "POST",
            url: getServerHost() + '/usermanagement/validate_phone',
            crossDomain: true,
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    bindPhoneOrTel(wechat_id, phone, code, callback) {
        let formdata = new FormData();
        formdata.append("wechat_id", wechat_id);
        formdata.append("phone", phone);
        formdata.append("code", code);

        httpManager.ajax({
            method: "POST",
            // url: 'http://admin.swczyc.com/hyapi/business/usermanagement/bind_phone',
            url: getServerHost() + '/usermanagement/bind_phone',
            crossDomain: true,
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    /**
     * [setting part]
     */
    vipAddressView(wechat_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/receiver/vipAddress/view?wechat_id=' + wechat_id,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    vipBirthdayAdd(wechat_id, birthday, callback) {
        httpManager.ajax({
            url: getServerHost() + '/receiver/birthday/add?wechat_id=' + wechat_id + '&birthday=' + birthday,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    vipAddressAdd(wechat_id, receiverName, receiverMobile, receiverAddress, callback) {
        httpManager.ajax({
            url: getServerHost() + '/receiver/vipAddress/add?wechat_id=' + wechat_id + '&receiverName=' + receiverName + '&receiverMobile=' + receiverMobile + '&receiverAddress=' + receiverAddress,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    vipAddressEdit(wechat_id, id, receiverName, receiverMobile, receiverAddress, callback) {
        httpManager.ajax({
            url: getServerHost() + '/receiver/vipAddress/edit?wechat_id=' + wechat_id + '&id=' + id + '&receiverName=' + receiverName + '&receiverMobile=' + receiverMobile + '&receiverAddress=' + receiverAddress,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    /**
     * [webusiness part]
     */
    webusinessLogoEdit(weBusinessId, logoUrl, callback) {
        httpManager.ajax({
            // url: '//10.108.164.11:8080/hongyu/ymmall'+'/webusiness/logo/edit?weBusinessId=' + weBusinessId + '&logoUrl='+logoUrl,
            url: getServerHost() + '/webusiness/logo/edit?weBusinessId=' + weBusinessId + '&logoUrl=' + logoUrl,
            method: "POST",
            // crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    webusinessShopNameEdit(weBusinessId, shopName, callback) {
        httpManager.ajax({
            // url: '//10.108.164.11:8080/hongyu/ymmall'+'/webusiness/shopName/edit?weBusinessId=' + weBusinessId + '&shopName='+shopName,
            url: getServerHost() + '/webusiness/shopName/edit?weBusinessId=' + weBusinessId + '&shopName=' + shopName,
            method: "POST",
            // crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    //----------------------------------设置微商城通信地址 api-------------------------------------------
    webusinessShopAddressEdit(weBusinessId, shopAddress, callback) {
        httpManager.ajax({
            // url: '//10.108.164.11:8080/hongyu/ymmall'+'/webusiness/shopName/edit?weBusinessId=' + weBusinessId + '&shopName='+shopName,
            url: getServerHost() + '/usermanagement/modify?webusiness_id=' + weBusinessId + '&address=' + shopAddress,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    /**
     * [Divide part]
     */

    getTotalDivide(webusiness_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/divide/total_divide?webusiness_id=' + webusiness_id,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getDailyDivide(webusiness_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/divide/daily_divide?webusiness_id=' + webusiness_id,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTotalDivideList(webusiness_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/divide/total_divide_list?webusiness_id=' + webusiness_id,
            // url: '//localhost/hyapi/ymmall' + '/webusiness/total_divide_list?webusiness_id='+webusiness_id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getDailyDivideList(webusiness_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/divide/daily_divide?webusiness_id=' + webusiness_id,
            // url: '//localhost/hyapi/ymmall' + '/webusiness/total_divide_list?webusiness_id='+webusiness_id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getUnfilledOrders(webusiness_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/webusiness/unfilled_orders?webusiness_id=' + webusiness_id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    /**
     * [order part]
     */
    getAllOrderListByAccount(wechat_id, page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/list_by_account?wechat_id=' + wechat_id + "&page=" + page + "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrderListByAccount(wechat_id, status, page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/list_by_account?wechat_id=' + wechat_id + "&status=" + status + "&page=" + page + "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getmyAllOrderListByAccount(webusiness_id, page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/list_by_webusiness?webusiness_id=' + webusiness_id + "&page=" + page + "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getmyOrderListByAccount(webusiness_id, status, page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/list_by_webusiness?webusiness_id=' + webusiness_id + "&status=" + status + "&page=" + page + "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrderDetailById(orderid, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/detail?orderid=' + orderid,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrderDetailByCode(ordercode, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/detail?ordercode=' + ordercode,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getmydelivery(orderId, deliveryName, deliveryCode, callback) {
        httpManager.ajax({
            url: getServerHost() + '/delivery?orderId=' + orderId + "&deliveryName=" + deliveryName + "&deliveryCode=" + deliveryCode,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrderRefund(orderid, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/refund_detail?orderid=' + orderid,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    applyRefund(refund_info, callback) {
        httpManager.ajax({
            method: "POST",
            url: getServerHost() + '/order/apply_refund',
            type: "application/json",
            crossDomain: true,
            data: JSON.stringify(refund_info),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    applyAppraise(appraise_info, callback) {
        httpManager.ajax({
            method: "POST",
            // url: '//localhost/hyapi/ymmall' + '/order/appraise/create',
            url: getServerHost() + '/order/appraise/create',
            type: "application/json",
            crossDomain: true,
            data: JSON.stringify(appraise_info),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    applyAppraises(appraise_info, callback) {
        httpManager.ajax({
            method: "POST",
            // url: '//localhost/hyapi/ymmall' + '/order/appraise/create',
            url: getServerHost() + '/order/appraises/create',
            type: "application/json",
            crossDomain: true,
            data: JSON.stringify(appraise_info),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    cancelOrder(orderId, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/cancel?order_id=' + orderId,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    confirmReceive(orderId, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/confirm_receive?order_id=' + orderId,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    deleteOrder(orderId, callback) {
        httpManager.ajax({
            url: getServerHost() + '/order/delete?id=' + orderId,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    //----------------------------------设置微信号 api-------------------------------------------
    webusinessWeAccountEdit(weBusinessId, weAccount, callback) {
        httpManager.ajax({
            // url: '//10.108.164.11:8080/hongyu/ymmall'+'/webusiness/shopName/edit?weBusinessId=' + weBusinessId + '&shopName='+shopName,
            url: getServerHost() + '/webusiness/shopAddress/edit?weBusinessId=' + weBusinessId + '&weAccount=' + weAccount,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    //---------------------------------- productMan api-------------------------------------------
    getCategory(callback) {
        httpManager.ajax({
            url: getServerHost() + '/specialty/category/treelist/view',
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getProductManList(webusiness_id, productStatus, specialtyName, page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/specialty/info?webusiness_id=' + webusiness_id + '&specialtyType=' + productStatus +
                "&specialtyName=" + specialtyName + "&page=" + page + "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getProductDetail(id, callback) {
        httpManager.ajax({
            // url: getServerHost() + '/admin/pinkong/xianlu/detail/view?id='+id,
            url: getServerHost() + '/specialty/detail?id=' + id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getSpecificationList(id, callback) {
        httpManager.ajax({
            url: getServerHost() + "/receiver/list?specialtyid=" + id,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    deleteSpecification(id, callback) {
        httpManager.ajax({
            // method: 'POST',
            url: getServerHost() + "/specification/delete?specificationid=" + id,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    addSpecification(specificationData, callback) {
        httpManager.ajax({
            method: 'POST',
            url: getServerHost() + "/specification/add",
            type: 'application/json',
            data: JSON.stringify(specificationData),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    editSpecification(specificationInfo, callback) {
        httpManager.ajax({
            method: 'POST',
            url: getServerHost() + "/specification/edit",
            type: 'application/json',
            data: JSON.stringify(specificationInfo),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    addProduct(param, callback) {
        console.log("发送的", JSON.stringify(param))
        httpManager.ajax({
            method: "POST",
            url: getServerHost() + '/specialty/add',
            type: "application/json",
            crossDomain: true,
            data: JSON.stringify(param),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    editProduct(param, callback) {
        httpManager.ajax({
            method: "POST",
            url: getServerHost() + '/specialty/modify',
            type: "application/json",
            crossDomain: true,
            data: JSON.stringify(param),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    //获取默认平台分成比例
    requestDefaultDivideRatio(callback) {
        httpManager.ajax({
            url: getServerHost() + '/specialty/divide/detail/view',
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    //----------------------------------代售产品 api-------------------------------------------
    sellProductHandler(webusinessId, id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/specialty/agent?id=' + id + "&webusiness_id=" + webusinessId,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


};

export default api;