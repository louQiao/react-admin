import React, { Component } from 'react';
import PropTypes from "prop-types"
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
  static propTypes = {
    detail:PropTypes.string
  }
  constructor(props) {
    super(props);
    const {detail} = this.props
    if(detail){
      const contentBlock = htmlToDraft(detail);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    }else{
      const editorState = EditorState.createEmpty()
      this.state = {
        editorState
      };
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };

  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadImageCallBack = (file) => {
    return new Promise((resolve,reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST',"/manage/img/upload")
      //xhr.setRequestHeader('Authorization','Client-ID XXXXX')
      const data = new FormData()
      data.append("image",file)
      xhr.send(data)
      xhr.addEventListener("load",() => {
        const response = JSON.parse(xhr.responseText)
        const {url} = response.data
        //console.log(url)
        resolve({data:{link:url}})
      })
      xhr.addEventListener('error',() => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="demo-section">
        <div className="demo-section-wrapper">
          <div className="demo-editor-wrapper">
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              editorStyle={{border:'1px solid black',minHeight:200,paddingLeft:10}}
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                image:{uploadCallback:this.uploadImageCallBack,alt:{present:true,mandatory:true}}
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
