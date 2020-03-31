const isHrServer = true;  //控制配置是宏瑞服务器的还是123服务器的

let onlineURL = isHrServer ? "//hrmall.bjhongruijiye.com" : "//ymymmall.swczyc.com";                   // 线上地址
let devURL = isHrServer ? "//www.bjhongruijiye.com/hyapi/ymmall" : "//admin.swczyc.com/hyapi/ymmall";  // 后台地址

// let devURL = "//10.28.154.163:8080/hongrui/ymmall";       // 测试地址----后台地址---杜恩博
// let devURL = "//10.108.165.89:8080/hongyu/ymmall";       // 测试地址----后台地址---陈晓茵
// let devURL = "//10.108.164.156:80/hongrui/ymmall";       // 测试地址----后台地址---钟师兄


function getServerHost() {
    const search = location.search.substr(1);
    const searches = search.split("&");
    const params = {};
    for (const i in searches) {
        const theParams = searches[i].split("=");
        params[theParams[0]] = decodeURI(theParams[1]);
    }

    if (/*/huiyan\.baidu\.com/.test(location.href) || */params.apitype === "online")
        return onlineURL;
    else
        return devURL;
}


function getServerIp() {
    return isHrServer ? "//www.bjhongruijiye.com" : "//admin.swczyc.com";       // 47服务器  123服务器
}

/*----------------------------------------公众号部署的通用配置-----------------------------------------------*/
const wxconfig = {
    appId: 'wx045560c73e1dbdde',
    appSecret: '9453b3ebeb4cb223f90f22a2ed9ed59c', //拿到宏瑞的信息

    // 宏瑞服务器  123服务器
    redirectUri: isHrServer ? 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
        'appid=wx4cda79d72459e7da' + '&' +
        'redirect_uri=http:'+ onlineURL + '&' +
        'response_type=code&scope=snsapi_info&state=1#wechat_redirect'
        :
        'https://open.weixin.qq.com/connect/oauth2/authorize?' +
        'appid=wx4cda79d72459e7da' + '&' +
        'redirect_uri=http:'+ onlineURL + '&' +
        'response_type=code&scope=snsapi_info&state=1#wechat_redirect',

    hostURL: 'http:' + onlineURL,
    adminURL: isHrServer ? '//www.bjhongruijiye.com/hyapi' : '//admin.swczyc.com/hyapi',
    adminURLHttp: isHrServer ? 'http://www.bjhongruijiye.com/' : 'http://admin.swczyc.com/',

    // 测试地址
    // adminURL:'//10.108.164.159:8080/hy_backend',
};


/*----------------------------------------图片上传的通用配置-----------------------------------------------*/
const imgUploadURL = "http://www.bjhongruijiye.com/hyapi/resource/image/multisize/upload"; // 宏瑞图片上传地址,有sourcePath、thumbnailPath、mediumPath、largePath
                    //"http://www.bjhongruijiye.com/hyapi/resource/image/upload"; // 宏瑞图片上传地址,只有mediumPath
                    //"http://admin.lvxingbox.cn/hyapi/resource/image/upload"  //47服务器上传图片地址
const imgPath = "mediumPath";        //项目中，所有调用图片地址的字段
const MAXIMGSIZE = 15 * 1024 * 1024; //最大图片上传大小：15M
const MAXIMGSIZESTR = "15M";


export {getServerHost, getServerIp, wxconfig, imgUploadURL, imgPath, MAXIMGSIZE, MAXIMGSIZESTR};