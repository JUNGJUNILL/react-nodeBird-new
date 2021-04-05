import { Avatar, Card, Button } from 'antd';
import React,{useCallback} from 'react';
import Link from 'next/link';

import {useDispatch,useSelector} from 'react-redux'
import {logoutAction}from '../reducers/user'

import {LOG_OUT_REQUEST} from '../reducers/user'



const UserProfile = () => {

  const dispatch = useDispatch();
  const {me,isLoggingOut,isLoggedOut} = useSelector((state)=>state.user); 

const onLogOut = useCallback(()=>{
  dispatch({type:LOG_OUT_REQUEST}); 
   
},[isLoggedOut])
   
  return (
    <Card
      actions={[
        <div key="twit"><Link href={`/user/${me.id}`}><a>짹짹<br />{me ? me.Posts.length:'0'}</a></Link></div>,
        <div key="following"><Link href={`/profile`}><a>팔로잉<br />{me ? me.Followings.length:'0'}</a></Link></div>,
        <div key="follower"><Link href={`/profile`}><a>팔로워<br />{me ? me.Followers.length:'0'}</a></Link></div>,
      ]}
    >
      <Card.Meta
        avatar={<Link href={`/user/${me.id}`}><a><Avatar>{me.nickname[0]}</Avatar></a></Link>}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={isLoggingOut}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;