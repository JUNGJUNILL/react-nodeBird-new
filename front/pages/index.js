import {useEffect} from 'react';
import AppLayout from '../components/AppLayout'; 
import PostForm from '../components/PostForm'; 
import PostCard from '../components/PostCard'; 
import {useDispatch,useSelector}from 'react-redux'; 
import user from '../reducers/user';
import post from '../reducers/post';
import Link from 'next/link';

import axios from 'axios';
import {END} from 'redux-saga'; 
import wrapper from '../store/configureStore'; 

import {LOAD_POSTS_REQUEST} from '../reducers/post';
import {LOAD_MY_INFO_REQUEST} from '../reducers/user'; 



const Home = () =>{

  const dispatch=useDispatch(); 
  const {me} = useSelector((state)=> state.user);
  const {mainPosts,hasMorePost,loadPostsLoading,retweetError}  =useSelector((state)=> state.post);

  useEffect(()=>{
      
      if(retweetError){
          return alert(retweetError); 
      }
  },[retweetError]); 



  useEffect(()=>{
    //react-virtualized 화면에 보이는 데이터만 load 

    //window.scrollY 얼마나 내렸는지
    //document.documentElement.clientHeight 현재 화면 길이 
    //document.documentElement.scrollHeight 총 화면 길이 
      function onScroll(){
      
        if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight-300){
          
          if(hasMorePost && !loadPostsLoading){
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
              type: LOAD_POSTS_REQUEST,
              data:{lastId:lastId},
            });
          }
        }
      }


      window.addEventListener('scroll',onScroll);

      //뒷정리 함수 
      return () =>{
        window.removeEventListener('scroll',onScroll); 
      }

  },[hasMorePost, loadPostsLoading, mainPosts]); 


    return (
        <AppLayout>
          {me && <PostForm />}
          {mainPosts.map((post,i)=>(<PostCard key={post.id} post={post}/>))}
        </AppLayout>
    )


}

//이해가 안되면 서버사이드렌더링 준비하기 강의를 다시 보자.

// 01.서버 사이드 렌더링을 위한 장치 
// 02.리덕스에 데이터가 채워진 상태로 Home보다 먼저 실행된다.
// 03.서버 사이드 렌더링 후 reducer HYDRATE 실행됨 
// 04.브라우저가 아닌 프론트 서버에서 실행되는 것이다.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {

                 //▼서버 사이드 렌더링이니? 라고 물어보는 로직
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) { //쿠키 공유 방지 
    axios.defaults.headers.Cookie = cookie;
  }
  //서버쪽으로 쿠키를 전달해 주기 위함

  context.store.dispatch({
    type:LOAD_MY_INFO_REQUEST
  });

  
  context.store.dispatch({
    type:LOAD_POSTS_REQUEST,
    data:{lastId:0}
  });

  // 서버에서 saga에서 SUCCESS 되서 데이터가 완전히 다 만들어진 
  // 상태로 화면이 그려주기 위한 장치 

  // REQUEST 해서 SUCCESS 될 때까지 기다려주기 위한 장치
  // 이걸 빼면 그냥 REQUEST 요청만 완료된 상태가 되어버리기 때문에 데이터가 나오지 않을 것이다.
  context.store.dispatch(END); 
  await context.store.sagaTask.toPromise(); 


}); 

export default Home; 