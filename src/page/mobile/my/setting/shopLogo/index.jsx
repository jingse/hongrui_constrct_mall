import React from "react";
import { WhiteSpace, WingBlank, ImagePicker,Card, Toast} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import myApi from "../../../../../api/my.jsx";
import {imgUploadURL} from "../../../../../config.jsx";
import {LocalStorageManager} from "../../../../../manager/StorageManager.jsx";


const wechatId = localStorage.getItem("wechatId");
const webusinessID = localStorage.getItem("cusuid")


export default class shopLogo extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            files: [],
        }
    }

    // componentWillMount(){
    //     console.log("9999",this.props.location.state)
    //     let sta = this.props.location.state;
    //     this.setState({
    //         id: sta.webusinessID,
    //     })
    // }
    componentWillUnmount() {
        clearTimeout(this.closeTimer);
    }

    onChange = (files, type, index) => {
        this.setState({
            files,
        });
    };

    webusinessShopLogoEdit() {
        console.log('webusinessID shopLogo: ',webusinessID);

        const imageList = [];
        if (this.state.files.length) {
            let formData = new FormData();
            let files = this.state.files[0].file;
            formData.append("files", files);

            fetch(imgUploadURL, {
                method: 'POST',
                headers: {}, body: formData,
            }).then((response) => response.json()).then((rs) => {
                console.log('mediumPath', rs)
                imageList.push(rs.obj[0]);
                console.log('imageList: ', imageList);

                myApi.webusinessLogoEdit(webusinessID, imageList[0].mediumPath, (rs) => {
                    if (rs && rs.success) {
                        Toast.info("设置成功");
                        history.go(-1);
                    } else {
                        Toast.info("设置失败");
                    }
                });
            });
        } else {
            Toast.info("您还未添加图片！");
        }

    }

    render() {
        const { files } = this.state;

        return <Layout>

            <Navigation title="微商城Logo" left={true}/>
            <Card>
                <WhiteSpace/>
                <WingBlank>上传Logo</WingBlank>
                <WhiteSpace/>

                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    selectable={files.length < 1}
                    multiple={true}
                />
                <WhiteSpace/>
            </Card>
           <Submit onClick={()=>{this.webusinessShopLogoEdit()}}>
                <span >提交</span>
            </Submit>
            {/* <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
              /> */}

        </Layout>

    }
}