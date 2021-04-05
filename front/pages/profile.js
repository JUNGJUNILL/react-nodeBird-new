import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_FOLLOWERS_REQUEST,LOAD_FOLLOWINGS_REQUEST ,LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { backUrl } from '../config/config';


const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(1);
  const [followingsLimit, setFollowingsLimit] = useState(1);

  const { data: followersData, error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher);

      // useEffect(()=>{
    //     dispatch({type:LOAD_FOLLOWERS_REQUEST})
    // },[]); 
 
    // useEffect(()=>{
    //     dispatch({type:LOAD_FOLLOWINGS_REQUEST})
    // },[]); 


  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 1);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 1);
  }, []);

  if (!me) {
    return '내 정보 로딩중...';
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }

  return (
    <div>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
      </AppLayout>
    </div>
  );
};



//이해가 안되면 서버사이드렌더링 준비하기 강의를 다시 보자.

// 01.서버 사이드 렌더링을 위한 장치 
// 02.리덕스에 데이터가 채워진 상태로 Home보다 먼저 실행된다.
// 03.서버 사이드 렌더링 후 reducer HYDRATE 실행됨 
// 04.브라우저가 아닌 프론트 서버에서 실행되는 것이다.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  //▼서버 사이드 렌더링이니? 라고 물어보는 로직
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) { //쿠키 공유 방지 
    axios.defaults.headers.Cookie = cookie;
  }
  //서버쪽으로 쿠키를 전달해 주기 위함
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  // 서버에서 saga에서 SUCCESS 되서 데이터가 완전히 다 만들어진 
  // 상태로 화면이 그려주기 위한 장치 

  // REQUEST 해서 SUCCESS 될 때까지 기다려주기 위한 장치
  // 이걸 빼면 그냥 REQUEST 요청만 완료된 상태가 되어버리기 때문에 데이터가 나오지 않을 것이다.
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Profile;