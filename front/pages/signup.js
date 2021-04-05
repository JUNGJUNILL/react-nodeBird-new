import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import PropTypes from 'prop-types';
import Router from 'next/router';

import axios from 'axios';
import {END} from 'redux-saga'; 
import wrapper from '../store/configureStore'; 


import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';

import {useDispatch,useSelector} from 'react-redux'

import {SIGN_UP_REQUEST,LOAD_MY_INFO_REQUEST} from '../reducers/user'
import {LOAD_POSTS_REQUEST} from '../reducers/post'

const TextInput = ({ value }) => {
  return (
    <div>{value}</div>
  )
};

TextInput.propTypes = {
  value: PropTypes.string,
};



const Signup = () =>{

    const dispatch=useDispatch(); 
    const {signUpLoading,signUpDone,signUpError,me}=useSelector((state)=>state.user);
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);
  
    const [email, onChangeEmail] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');


    //근데 이거 때문에 회원가입 페이지가 안들어가진다.
    //회원가입 페이지에서 로그인 했을 경우 회원가입 페이지 갔던거 사라짐
    useEffect(()=>{
      if(me && me.id){
          Router.replace('/');
                //뒤로 가기 시 그 페이지가 나오지 않게 하기 위함
                
      }
    },[ me && me.id]); 

    useEffect(() => {
        if (signUpDone) {
          Router.replace('/');
        }
      }, [signUpDone]);

      useEffect(() => {
        if (signUpError) {
          alert(signUpError);
        }
      }, [signUpError]);


    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) {
          return setPasswordError(true);
        }
        if (!term) {
          return setTermError(true);
        }
        dispatch({
          type:SIGN_UP_REQUEST,
          data:{email,password,nick}
        })
      }, [email,password, passwordCheck, term]);
    
      const onChangePasswordCheck = useCallback((e) => {
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
      }, [password]);
    
      const onChangeTerm = useCallback((e) => {
        setTermError(false);
        setTerm(e.target.checked);
      }, []);

    return(
        <div>
        <AppLayout>
        <Form onFinish={onSubmit} style={{ padding: 10 }}>
          <TextInput value="135135" />
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
          </div>
          <div>
            <label htmlFor="user-nick">닉네임</label>
            <br />
            <Input name="user-nick" value={nick} required onChange={onChangeNick} />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호체크</label>
            <br />
            <Input
              name="user-password-check"
              type="password"
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
            />
            {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
            {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
          </div>
        </Form>
      </AppLayout>
       </div>
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
  axios.defaults.headers.Cookie = ''; //쿠키 공유 방지 
  if (context.req && cookie) { 
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


export default Signup

