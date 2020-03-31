import httpManager from "../manager/HttpManager.jsx";
import {imgUploadURL} from "../config.jsx";

const api = {
    uploadImg(formData, callback) {

        console.log("navigator.userAgent", navigator.userAgent)
        if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
            let ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            ver = parseInt(ver[1], 10);
            console.log("IOS版本", ver)

            if (ver <= 10) {
                httpManager.ajax({
                    method: "POST",
                    url: imgUploadURL,
                    // type: "application/json",
                    crossDomain: true,
                    data: formData,
                    success: (rs) => {
                        callback && callback(rs);
                    }
                });
            } else {
                fetch(imgUploadURL, {
                    method: 'POST',
                    headers: {}, body: formData,
                }).then((response) => response.json()).then((rs) => {
                    callback && callback(rs);
                })
            }
        } else {
            fetch(imgUploadURL, {
                method: 'POST',
                headers: {}, body: formData,
            }).then((response) => response.json()).then((rs) => {
                callback && callback(rs);
            })
        }
    }
};

export default api;