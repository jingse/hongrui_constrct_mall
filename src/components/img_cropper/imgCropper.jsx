import React from 'react';
import {ImagePicker, Modal, WhiteSpace} from "antd-mobile";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import "./imgCropper.less";


/*图片裁剪组件——可调节裁剪框大小*/
export default class ImgCropper extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            // files: sessionStorage.hasOwnProperty(this.props.storageName) ? JSON.parse(sessionStorage.getItem(this.props.storageName)) : [],
            files: this.props.files,
            src: "",

            crop: {
                aspect: 1,
                width: 50,
                x: 0,
                y: 0
            },
            croppedImageUrl: "",

            modal: false,
        };
    }

    onClose = key => () => {
        this.setState({ [key]: false });
    };

    //type:"add" "remove"; index表示remove时的索引
    onChange = (files, type, index) => {
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
        this.props.handleFiles(this.state.files);
        // sessionStorage.setItem(this.props.storageName, JSON.stringify(this.state.files));
    };

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent))
            return;

        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode)
            e.preventDefault();
    };

    onImageLoaded = (image) => {
        this.imageRef = image;
        this.makeClientCrop(this.state.crop);
    };

    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    };

    onCropChange = crop => {
        this.setState({crop});
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, "newFile.jpeg");
            this.setState({croppedImageUrl: croppedImageUrl});
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        return new Promise((resolve, reject) => {
            const fileUrl = canvas.toDataURL('image/jpeg');
            resolve(fileUrl);
        });
    }

    static dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bStr = atob(arr[1]),
            n = bStr.length,
            u8arr = new Uint8Array(n);

        while (n--)
            u8arr[n] = bStr.charCodeAt(n);

        return new File([u8arr], filename, { type: mime });
    }

    getFinalFile() {
        const curLength = this.state.files.length;

        this.state.files[curLength - 1] = {
            file: ImgCropper.dataURLtoFile(this.state.croppedImageUrl, "newFile.jpeg"),
            orientation: 1,
            url: this.state.croppedImageUrl,
        };

        this.setState({ files: this.state.files });
        this.props.handleFiles(this.state.files);

        this.onClose('modal')();
    }


    render() {
        const {crop, croppedImageUrl, src, files, modal} = this.state;
        const {filesLength} = this.props;

        return <div>
            <ImagePicker
                files={files}
                onChange={this.onChange}
                onImageClick={(index, fs) => this.setState({modal: true})}
                selectable={files.length < filesLength}
                multiple={false}
            />

            <Modal
                visible={modal}
                transparent
                maskClosable={false}
                onClose={this.onClose('modal')}
                footer={[{ text: '取消', onPress: () => { this.onClose('modal')(); }},
                         { text: '确认裁剪', onPress: () => this.getFinalFile()}]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                className="popup_modal2"
            >

                {src && (
                    <ReactCrop
                        src={src}
                        crop={crop}
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                )}

                <WhiteSpace size="xs"/>

                <div>
                    {croppedImageUrl && (
                        <img id="croppedImg" alt="Crop" style={{maxWidth: "100%"}} src={croppedImageUrl}/>
                    )}
                </div>

            </Modal>
        </div>
    }
};