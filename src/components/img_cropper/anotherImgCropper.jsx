import React from 'react';
import {ImagePicker, Modal, Toast } from "antd-mobile";
import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css";
import ImgCropper from "./imgCropper.jsx";


function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

/*图片裁剪组件——不可调节裁剪框大小*/
export default class AnotherImgCropper extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.state = {
            // files: sessionStorage.hasOwnProperty(this.props.storageName) ? JSON.parse(sessionStorage.getItem(this.props.storageName)) : [],
            files: this.props.files,
            src: "",

            modal: false,
        };
    }

    //type:"add" "remove"; index表示remove时的索引
    onChange = (files, type, index) => {
        console.log("裁剪",files, type, index);
        this.showModal('modal');

        if (type === "add") {
            const curIndex = files.length - 1;
            this.setState({
                files: files,
                src: files[curIndex].url,
                modal: true
            });
        } else { //remove
            this.setState({
                files: files,
            });
        }
        console.log("裁剪4",this.state.files)
        this.props.handleFiles(files);
        // sessionStorage.setItem(this.props.storageName, JSON.stringify(files));
    };

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    };

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    };

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    };

    // judgePhone() {
    //     let ver = "android";
    //     console.log("navigator.userAgent", navigator.userAgent)
    //     if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ) {
    //         let temp = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    //         ver = parseInt(temp[1], 10);
    //         Toast.info("IOS版本: " + ver, 3)
    //     }
    //     return ver;
    // }

    //控制比例相关
    cropImage() {
        let dataUrl = "";
        if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ) {
            let temp = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            let ver = parseInt(temp[1], 10);
            Toast.info("IOS版本: " + ver, 3)
            dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL('image/jpeg', 1)
        } else {
            dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL()
        }

        if (dataUrl === 'null')
            return false;

        const curLength = this.state.files.length;
        this.state.files[curLength - 1] = {
            file: ImgCropper.dataURLtoFile(dataUrl, "newFile.jpeg"),
            orientation: 1,
            url: dataUrl,
        };

        this.setState({ files: this.state.files });
        this.props.handleFiles(this.state.files);

        this.onClose('modal')();
    }


    render () {
        const { files, src, modal } = this.state;
        const { filesLength } = this.props;
        {console.log("hahah",this.state)}
        return <div>
            <ImagePicker
                files={files}
                onChange={this.onChange}
                // onImageClick={(index, fs) => this.setState({modal: true})}
                selectable={files.length < filesLength && this.props.chakan}
                multiple={false}
                disableDelete={!this.props.chakan}
            />
            
            <Modal
                visible={modal}
                transparent
                maskClosable={false}
                onClose={this.onClose('modal')}
                footer={[
                    { text: '取消', onPress: () => { this.onClose('modal')();}},
                    { text: '确认裁剪', onPress: () => { this.cropImage();} }]}
                wrapProps={{onTouchStart: this.onWrapTouchStart}}
                className="popup_modal2"
            >
                <Cropper
                    ref='cropper'
                    src={src}
                    viewMode={2} //定义cropper的视图模式
                    zoomable={true} //是否允许放大图像
                    movable={true}
                    guides={false} //显示在裁剪框上方的虚线
                    background={false} //是否显示背景的马赛克
                    rotatable={true} //是否旋转
                    style={{height: '100%', width: '100%'}}
                    cropBoxResizable={false}
                    cropBoxMovable={true}
                    dragMode="move"
                    center={true}
                    aspectRatio={this.props.biaozhi ? 1/1 : 9/5}
                />
            </Modal>
        </div>
    }
}