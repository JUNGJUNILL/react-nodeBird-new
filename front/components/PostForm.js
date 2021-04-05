import React,{useState,useCallback,useRef,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Form,Input,Button} from 'antd'; 

import {ADD_POST_REQUEST,UPLOAD_IMAGES_REQUEST,REMOVE_IMAGE} from '../reducers/post';
import { isDate } from 'moment';


const PostForm = () =>{
    const dispatch = useDispatch(); 
    const {imagePaths,addPostDone} =useSelector((state)=>state.post)
    const [text,setText] =useState(''); 


    useEffect(()=>{
        if(addPostDone){
            setText(''); 
        }
    },[addPostDone]); 


    const onChageText =useCallback((e)=>{
        setText(e.target.value); 
    },[]); 


    //게시글 등록
    const onsubmit = useCallback(()=>{

        if(!text || !text.trim()){
            return alert('게시글을 작성 해 주세요'); 
        }; 
        
        const formData = new FormData(); 
        imagePaths.forEach((p)=>{
            formData.append('image',p); 
        }); 
        formData.append('content',text); 

       return  dispatch({
             type:ADD_POST_REQUEST,
             data:formData, 
            }); 
     
    },[text,imagePaths]); 



    //이미지 업로드 누렀을 때 window 화면 뜨는거 
    const imageInput = useRef(); 
    const onClickImageUpload = useCallback(()=>{
        imageInput.current.click(); 
    },[imageInput.current]); 

    //이미지 업로드
    const onChangeImages = useCallback((e)=>{

    
        //파일을 2개 올렸을 시 e.target.files의 생김새
        //{0:File, 1:File, length:2} 유사 배열 형태

        //File의 생김새
        //name , size, type, lastModified, lastModifiedDate 속성을 가져올 수 있다.

        //typeof e.target.files  == object 
        //유사 배열이므로 [].forEach.call을 사용한다. 

        const imageFormData = new FormData(); 

        Array.prototype.forEach.call(e.target.files,(f)=>{
            imageFormData.append('image',f); 
        }); 
        dispatch({type:UPLOAD_IMAGES_REQUEST,data:imageFormData}); 


    }); 

    //이미지 제거(프론트에서만 없애기로 구현됨)
    const removeImage = useCallback((index)=>()=>{
        dispatch({
            type:REMOVE_IMAGE,
            data:index,
        });
    }); 

    return (
        <Form style={{margin:'10px 0 20px'}}  encType="multipart/form-data" onFinish={onsubmit}>
            <Input.TextArea 
                value={text}
                onChange={onChageText}
                maxLength={140}
                placeholder='hello World'    
            />
            <div>                               {/*multiple : 이미지 다중 선택 가능*/}                
                <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages}/>
                <Button onClick={onClickImageUpload} >이미지 업로드</Button>
                <Button type="primary" style={{float:'right'}} htmlType="submit" >가즈아!</Button>
            </div>
            <div>
                {imagePaths.map((v,i)=>(
                    <div key={v} style={{display:"inline-block"}}>
                     <img src={`http://localhost:3999/images/${v}`} style={{width:'200px'}}/>
                        <div>
                            <Button onClick={removeImage(i)}>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    )



}

export default PostForm; 
