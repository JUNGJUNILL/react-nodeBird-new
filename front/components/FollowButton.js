import React,{useState,useCallback,useRef} from 'react';
import {Button,Card,Popover,Avatar,List,Comment} from 'antd'; 
import {useSelector,useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {UNFOLLOW_REQUEST,FOLLOW_REQUEST} from '../reducers/user'; 



const FollowButton = ({post})=>{
    const dispatch=useDispatch(); 
    const {me,followLoading,unfollowLoading} = useSelector((state)=>state.user); 
    const isFollowing = me.Followings.find((v)=>v.id===post.User.id); 
    const onClickBtn = useCallback(()=>{

        if(isFollowing){
            dispatch({type:UNFOLLOW_REQUEST,
                      data:post.User.id,
            });
        }else{
            dispatch({type:FOLLOW_REQUEST,
                      data:post.User.id,
            });
        }

    },[isFollowing]); 

    if(post.User.id === me.id){
        return null;
    }

    return(
        <Button type="primary" onClick={onClickBtn} loading={followLoading || unfollowLoading}>
            {isFollowing ? '언팔로우' : '팔로우'}
        </Button>
    )

}

FollowButton.propTypes = {
    post:PropTypes.object.isRequired,
   }
 

export default FollowButton; 