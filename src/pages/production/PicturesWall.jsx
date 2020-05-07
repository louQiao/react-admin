import React from "react"
import PropTypes from "prop-types"
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from "../../api/index"
import {BASE_IMG_URL} from "../../utils/const"

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs:PropTypes.array
  }

  constructor(props){
    super(props)

    let fileList = []

    if(this.props.imgs && this.props.imgs.length > 0){
      fileList = this.props.imgs.map((img,index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL+img
      }))
    }
    this.state = {
      previewVisible: false,    //预览是否显示
      previewImage: '', //大图地址
      previewTitle: '',
      fileList
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });
//预览图片
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async({ file,fileList }) => {
    //console.log(file,fileList)
    if(file.status === "done"){ //图片上传成功
      const result = file.response
      if(result.status === 0){
        message.success("图片上传成功")
        const {name,url} = result.data;
        file = fileList[fileList.length - 1]
        file.name = name;
        file.url = url;
        //console.log(fileList)
      }else{
        message.error("图片上传失败")
      }
    }else if(file.status === "removed"){
      const result = await reqDeleteImg(file.name)
      if(result.status === 0){
        message.success("删除图片成功")
      }else{
        message.error("删除图片失败")
      }
    }
    this.setState({ fileList });
  }

  getImgs = () => {
    return this.state.fileList.map(item => item.name)
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          name="image"
          accept="image/*"  /*选的时候只显示图片类型*/
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
