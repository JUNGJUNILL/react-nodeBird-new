import React,{useState,useCallback,useRef} from 'react';
import PropTypes from 'prop-types';
import {PlusOutlined} from '@ant-design/icons'

//폴더를 import 하면 index.js를 자동으로 불러온다.
import ImagesZoom from './ImagesZoom'; 

const PostImages =({images})=>{

    const [showImagesZoom,setShowImagesZoom] = useState(false); 
    const onZoom = useCallback(()=>{
        setShowImagesZoom(true); 

    },[]); 

    const onClose = useCallback(()=>{
        setShowImagesZoom(false); 
        
    },[]); 

    

    if(images.length === 1){

        return (
            <div>
                <img role="presentation" src={`http://localhost:3999/images/${images[0].src}`} alt={images[0].src} onClick={onZoom}/>
                {showImagesZoom && <ImagesZoom image={images} onClose={onClose} />}
            </div>
        )

    }

    if(images.length === 2){

        return (
            <div>
                <img role="presentation" style={{width:"50%" ,display:"inline-block"}}  src={`http://localhost:3999/images/${images[0].src}`} alt={images[0].src} onClick={onZoom}/>
                <img role="presentation" style={{width:"50%" ,display:"inline-block"}}  src={`http://localhost:3999/images/${images[1].src}`} alt={images[1].src} onClick={onZoom}/>
                {showImagesZoom && <ImagesZoom image={images} onClose={onClose} />}
            </div>
        )
    }
        //이미지가 3개 이상일 경우 
        return(
            <>
            <div>
                <img role="presentation" style={{width:"50%"}} src={`http://localhost:3999/images/${images[0].src}`} alt={images[0].src} onClick={onZoom}/>
                <div
                    role="presentation"
                    style={{display:"inline-block",width:"50%",textAlign:"center",verticalAlign:"middle"}}
                    onClick={onZoom}
                    >
                    <PlusOutlined />
                    <br />
                    {images.length -1 }
                    개의 사진 더 보기
                </div>
                {showImagesZoom && <ImagesZoom image={images} onClose={onClose} />}

            </div>
            </>
        )
}

PostImages.propTypes = {

    images : PropTypes.arrayOf(PropTypes.object), 
    
   }

export default PostImages; 