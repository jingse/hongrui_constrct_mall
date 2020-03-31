import {getServerHost} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';

var api = {
    /**
     * [my center info]
     */
    // getInfo(wechat_id, callback) {
    //     http.ajax({
    //         url: getServerHost() + '/usermanagement/info?wechat_id=' + wechat_id,
    //         crossDomain:true,
    //         success: (rs) => {
    //             callback && callback(rs);
    //         }
    //     });
    // },

    validateCode(mobile, callback) {
        let formdata = new FormData();
        formdata.append("phone", mobile);

        httpManager.ajax({
            method: "POST",
            url: getServerHost() + '/usermanagement/validate_phone',//改！！！！
            crossDomain:true,
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    register(register, callback) {
        httpManager.ajax({
            method: "POST",
            // url: 'http://admin.swczyc.com/hyapi/business/usermanagement/bind_phone',
            url: getServerHost() + '/usermanagement/register',//改！！！！
            type: "application/json",
            crossDomain:true,
            data: JSON.stringify(register),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },




};

export default api;