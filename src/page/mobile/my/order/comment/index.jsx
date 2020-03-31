import React from "react";
import {ActivityIndicator, Card, Checkbox, Flex, ImagePicker, TextareaItem, Toast, WhiteSpace} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import PropTypes from "prop-types";
import commentApi from "../../../../../api/my.jsx";
import {createForm} from 'rc-form';
import {getServerIp} from "../../../../../config.jsx";
import upload from "../../../../../api/upload.jsx";


// 需传入评价者名称、订单id
// const data = [{
//     url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
//     id: '2121',
// }, {
//     url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
//     id: '2122',
// }];

var llfkey = false;
const AgreeItem = Checkbox.AgreeItem;
const filesURL = new Array();
let sendPic = 0;


class CommentOn extends React.Component {

    constructor(props) {
        super(props);

        const length = this.props.location.order.orderItems.length;
        let isLighted = new Array(length);
        let files = new Array(length);
        let anonymous = new Array(length);

        for (let i = 0; i < length; i++) {
            isLighted[i] = new Array(5);
            files[i] = new Array();
            anonymous[i] = false;

            for (let j = 0; j < 5; j++)
                isLighted[i][j] = true;
        }

        this.state = {
            order: this.props.location.order,
            isLighted: isLighted,
            files: files,
            anonymous: anonymous,
            animating: false
        };
    }

    componentWillMount() {
        let length = this.props.location.order.orderItems.length;
        for (let i = 0; i < length; i++)
            filesURL[i] = new Array();
    }

    getStarCount(index) {
        let starCount = 0;
        for (let i = 0; i < this.state.isLighted[index].length; i++) {
            if (this.state.isLighted[index][i])
                starCount++;
        }
        return starCount;
    }

    //index:被点击的星的位置
    //pos:被评价的商品的位置
    makeFormerFull(index, pos) {
        //如果点击的那颗星是空的，那么把它和它之前的星都点亮
        //否则，把它和它后面的星都置空
        if (this.state.isLighted[pos][index]) {
            for (let i = 0; i < index; i++)
                this.state.isLighted[pos][i] = true;
        } else {
            for (let i = 4; i > index; i--)
                this.state.isLighted[pos][i] = false;
        }
        this.setState({isLighted: this.state.isLighted});
    }

    getStarDescription(i) {
        const startCount = this.getStarCount(i);

        switch (startCount) {
            case 1:
                return "很差";
            case 2:
                return "较差";
            case 3:
                return "一般";
            case 4:
                return "较好";
            case 5:
                return "非常好";
        }
    }

    compressImage(file,  quality, callback) {

        // 图片小于1M不压缩
        if (file.size < Math.pow(1024, 2)) {
            return file;
        }
        //默认0.5倍压缩
        quality = 0.5;
            
        //保存文件名，后边用到
        var name = file.name; 
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var src = e.target.result;
    
            var img = new Image();
            img.src = src;
            img.onload = function (e) {
                var w = img.width;
                var h = img.height;
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
    
                //铺底色 PNG转JPEG时透明区域会变黑色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, w, h);
    
                ctx.drawImage(img, 0, 0, w, h);
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality); //图片格式jpeg或webp可以选0-1质量区间
    
                // 返回base64转blob的值
                console.log('\u539F\u56FE' + (src.length / 1024).toFixed(2) + 'kb', '\u65B0\u56FE' + (base64.length / 1024).toFixed(2) + 'kb');
                //去掉url的头，并转换为byte
                var bytes = window.atob(base64.split(',')[1]);
                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }
                //通过Blob生成新图片文件对象
                file = new Blob([ab], { type: 'image/jpeg' });
                //这里需要重新设置文件名
                file.name = name;
                console.log("daozhela",file)

                callback && callback(base64);
            };
            img.onerror = function (e) {
                console.error(e)
            };
        };
        reader.onerror = function (e) {
           console.error(e)
        };
    };

    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    commentOnProduct() {
        console.log("comment");

        let picNUm = 0;
        this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {
            picNUm = picNUm + this.state.files[index].length;
        });
        console.log('picNUm picNUm', picNUm)

        this.setState({animating: !this.state.animating});
        this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {

            if (this.state.files[index].length == 0) {
                if (index == this.state.order.orderItems.length - 1) {
                    this.createCom()
                    // this.setState({ animating: !this.state.animating });
                }
            } else {
                for (let key in this.state.files[index]) {
                    let formData = new FormData();
                    let files = this.state.files[index][key].file;
                    // console.log("要传的files",this.state.files)
                    // this.compressImage(files,0.5, bl => {
                    //     console.log("asdas",bl)
                    //     var my = this.dataURLtoFile(bl,"name")
                    //     console.log("计入",my)
                    //     formData.append("files", my,"file_"+Date.parse(new Date())+".jpg"); // 文件对象
                    //     upload.uploadImg(formData, (rs)=>{
                    //         console.log("rs", rs);
    
                    //         if (rs && rs.success) {
                    //             filesURL[index].push(rs.obj[0]);
                    //             sendPic = sendPic + 1;
                    //             console.log("uppppppppppppp", sendPic, key, index)
    
                    //             if (sendPic === picNUm) {
                    //                 console.log('图片上传完毕');
                    //                 sendPic = 0;
                    //                 this.createCom()
                    //             }
                    //         } else {
                    //             this.setState({animating: false});
                    //             // console.log("Oops, error", e);
                    //             Toast.info("图片上传失败！");
                    //             return;
                    //         }
                    //     });
                    // })
                    
                    formData.append("files", files);

                    console.log("index: ", index);
                    // console.log("key: ", key);
                    // console.log("this.state.files[index][key].file: ", files);
                    // console.log('files size', files.size)
                    // console.log('formData', formData.get("files")) //ios低版本不兼容get函数


                    upload.uploadImg(formData, (rs)=>{
                        console.log("rshahahaha", rs);

                        if (rs && rs.success) {
                            filesURL[index].push(rs.obj[0]);
                            sendPic = sendPic + 1;
                            console.log("uppppppppppppp", sendPic, key, index)

                            if (sendPic === picNUm) {
                                console.log('图片上传完毕');
                                sendPic = 0;
                                this.createCom()
                            }
                        } else {
                            this.setState({animating: false});
                            // console.log("Oops, error", e);
                            Toast.info("图片上传失败！");
                            return;
                        }
                    });

                }
            }
        });
    }


    createCom() {
        console.log('filesURL', filesURL)
        const appraises = this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {
            const appraiseFormName = "count" + index;
            return {
                "orderItemId": item.id,
                "specialtyAppraise":
                    {
                        "appraiseContent": this.props.form.getFieldsValue()[appraiseFormName],
                        "appraiseTime": new Date(),
                        "contentLevel": this.getStarCount(index),
                        "isAnonymous": this.state.anonymous[index],
                        "isShow": true,
                        "images": filesURL[index],
                    },
            }
        });
        const appraisesInformation = {
            "wechat_id": localStorage.getItem("wechatId"),
            "wrapAppraises": appraises,
        };
        console.log("appraisesInformation", appraisesInformation);

        commentApi.applyAppraises(appraisesInformation, (rs) => {
            console.log("rs: ", rs);
            if (rs && rs.success)
                Toast.info('评价成功！', 1);
            else
                Toast.info('哎呀，出错了！', 1);

            this.setState({animating: !this.state.animating});
            history.go(-1)
        });

    }

    linkTo(link) {
        this.context.router.history.push(link);
    }

    onChange = (fileIndex, files, type, index) => {
        console.log('onChange', fileIndex, files, type, index);
        console.log('files', files);
        this.state.files[fileIndex] = files;
        this.setState({
            files: this.state.files,
        });
    };

    onChangeAnonymous(index, e) {
        this.state.anonymous[index] = e.target.checked;
        this.setState({
            anonymous: this.state.anonymous,
        });
    }

    getStarOfIndex(i) {
        return this.state.isLighted[i] && this.state.isLighted[i].map((item, index) => {

            return <img key={index} src={item ? "./images/icons/星.png" : "./images/icons/星-空.png"}
                        style={{marginLeft: '0.8rem'}}
                        onClick={() => {
                            this.state.isLighted[i][index] = !this.state.isLighted[i][index];
                            this.setState({isLighted: this.state.isLighted});
                            this.makeFormerFull(index, i);
                            // this.setState({isLighted: this.state.isLighted});
                        }}/>

        })
    }

    render() {
        // console.log("order", this.state.order);
        // console.log("this.state.files", this.state.files);
        // console.log("this.props.form.getFieldsValue()", this.props.form.getFieldsValue());

        const {getFieldProps} = this.props.form;

        const comments = this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {
            const files = this.state.files[index];

            return <div key={index}>
                <Card>
                    <div>
                        <Flex>
                            <Flex.Item style={{flex: '0 0 20%'}}>
                                <img src={"http://" + getServerIp() + item.iconURL.mediumPath}
                                     style={{width: '70%', padding: '1rem'}}/>
                            </Flex.Item>
                            <Flex.Item>
                                <span>描述相符</span>
                                <span>{this.getStarOfIndex(index)}</span>
                                <span style={{
                                    marginLeft: '0.8rem',
                                    color: '#999'
                                }}>{this.getStarDescription(index)}</span>
                            </Flex.Item>
                        </Flex>
                    </div>
                </Card>

                <WhiteSpace/>

                <Card>
                    <div style={{borderBottom: '1px solid #ccc'}}>
                        <TextareaItem
                            autoHeight
                            rows={5}
                            count={200}
                            // labelNumber={5}
                            placeholder="商品好吗？给其他想买的小伙伴做个参考呗"
                            {...getFieldProps('count' + [index], {
                                initialValue: '',
                            })}
                        />
                    </div>
                    <ImagePicker
                        files={files}
                        onChange={this.onChange.bind(this, index)}
                        onImageClick={(index, fs) => console.log('onImageClick', index, fs)}
                        selectable={files.length < 5}
                        multiple={true}
                    />
                    <div style={{fontSize: '0.7rem'}}>
                        <AgreeItem data-seed="logId" onChange={e => this.onChangeAnonymous(index, e)}>
                            匿名 <a onClick={(e) => {
                            e.preventDefault();
                            alert('agree it');
                        }}/>
                        </AgreeItem>
                    </div>
                </Card>
                <WhiteSpace/>
            </div>
        });

        return <Layout header={false} footer={false}>

            <Navigation title="发表评价" left={true}/>
            <WhiteSpace/>

            {comments}

            {/* <form ref="idcardFront" encType="multipart/form-data">
                <input type="file" name="files" accept="image/*">
                </input>
            </form> */}

            <Submit onClick={() => {
                this.commentOnProduct()
            }}>
                <span>提交</span>
            </Submit>

            <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
            />

        </Layout>

    }
}

CommentOn.contextTypes = {
    router: PropTypes.object.isRequired
};

const CommentOnWrapper = createForm()(CommentOn);
export default CommentOnWrapper;