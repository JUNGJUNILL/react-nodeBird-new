import React, { useCallback,useEffect,useMemo } from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components'

import {useDispatch, useSelector} from 'react-redux'
import {LOG_IN_REQUEST} from '../reducers/user'

//html태그에 스타일드 컴포넌트 쓰는 방법
const ButtonWrapper = styled.div`
     margin-top:10px;
`;

//컴포넌트에 스타일드 컴포넌트 쓰는 방법
const FormWrapper = styled(Form)`
    padding:10px;
`;

import useInput from '../hooks/useInput';
/*
{} === {} 
false 의 법칙에 따라서 
인라인 테그를 쓰면 리렌더링 된다. 

그래서 스타일드 컴포넌트를 쓰는 것이다
(useMemo도 마찬가지고..)
*/

//const style = useMemo(()=>({marginTop:10}),[]);

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const {isLoggingIn,loginError} = useSelector((state)=>state.user); 

  useEffect(()=>{
    if(loginError){
      alert(loginError); 
    }

  },[loginError]); 
  
  const onSubmitForm = useCallback(() => {
    console.log({
      email, password,
    });
    dispatch({type:LOG_IN_REQUEST,data:{email, password}}); 
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm} style={{ padding: '10px' }}>

      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
      </div>

      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
      </div>

      <ButtonWrapper >
        <Button type="primary" htmlType="submit" loading={isLoggingIn}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;