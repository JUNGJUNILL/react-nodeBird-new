import React ,{useState,useCallback}from 'react';
import Link from 'next/link';
import { Menu, Input, Button, Row, Col } from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import Router from 'next/router'; 


import styled from 'styled-components'
import {useSelector} from 'react-redux'
import useInput from '../hooks/useInput';

//antd 하단 스크롤하 생기는 문제 해결 
const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  
  .ant-col:first-child {
      padding-left: 0 !important;
  }
  
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;


//컴포넌트에 스타일드컴포넌트 쓰는방법
const SearchInput = styled(Input.Search)`
  vertical-align: middle; 
`

const AppLayout = ({ children }) => {

  //const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [searchInput,onChageSearchInput] = useInput(''); 
  const me = useSelector((state)=>state.user.me); 


  const onSearch = useCallback(()=>{
    Router.push(`/hashtag/${searchInput}`); 
  },[searchInput]); 

  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item key="home">
            <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item key="profile">
            <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item key="mail">
         <SearchInput 
          enterButton
          value={searchInput}
          onChange={onChageSearchInput}
          onSearch={onSearch}
          />
        </Menu.Item>


      </Menu>
      {/*
        xs : 모바일
        sm : 테블릿
        md : 작은 데스크탑
        lg, xl : 대화면 
        24가 나누고 등분하기 좋은 숫자이다. 
        
        gutter : Col 과 Col 사이의 간격 
      */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
        {me ? <UserProfile/> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
        {children}
        </Col>
        <Col xs={24} md={6}>
        <a href="http://captainryan.cafe24.com" target="_blank" rel="noreferrer noopener">captainryan</a>
                                                                {/* 보안관련, 새창이 어디서 부터 왔는지 차단, 이정도? 
                                                                제로초도 잘 모른다고 한다.*/}
        </Col>
      </Row>


    </div>
  );
};
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout;