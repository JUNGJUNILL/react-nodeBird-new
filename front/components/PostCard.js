import React,{useState,useCallback,useRef,useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector,useDispatch} from 'react-redux';
import {Button,Card,Popover,Avatar,List,Comment} from 'antd'; 
import {RetweetOutlined,HeartOutlined,HeartTwoTone,MessageOutlined,EllipsisOutlined } from '@ant-design/icons'

import PostImages  from './PostImages'; 
import FollowButton from './FollowButton'; 
import CommentForm from './CommentForm'; 
import PostCardContent from './PostCardContent'; 

import {REMOVE_POST_REQUEST,
        LIKE_POST_REQUEST,
        UNLIKE_POST_REQUEST,
        RETWEET_REQUEST,
    } from '../reducers/post'; 

import addPost from '../reducers/user'; 
import Link from 'next/link';

import moment from 'moment'; //날짜 관련 라이브러리 , 공식 홈페이지 https://momentjs.com/

moment.locale('ko'); //한국 날짜형으로 바꿔주기 

const PostCard = ({key,post})=>{

    const dispatch = useDispatch(); 
    const {me} = useSelector((state) => state.user);
    const {removePostLoading,retweetError} = useSelector((state) => state.post);
               //옵셔널 체이닝 연산자. 

    const [commentFormOpened,setCommentFormOpened] =useState(false); 



    const onLike = useCallback(()=>{

        dispatch({type:LIKE_POST_REQUEST,
                  data:post.id 
        })
        

    },[]); 

    const onUnlike = useCallback(()=>{

        if(!me){
            return alert('로그인이 필요한 서비스 입니다.'); 
        }

        return dispatch({type:UNLIKE_POST_REQUEST,
            data:post.id 
  })

    },[me]); 


    const liked = post.Likers.find((v)=>v.id === me.id); 

    const onToggleComment = useCallback(()=>{
        setCommentFormOpened((prev)=>!prev); 
    },[]); 

    const onRemovePost = useCallback(()=>{
        dispatch({type:REMOVE_POST_REQUEST,
                  data:post.id,
        });
    },[]); 


    const onRetweet =useCallback(()=>{

        if(!me){
            return alert('로그인이 필요한 서비스 입니다.'); 
        }

        return dispatch({
            type:RETWEET_REQUEST,
            data:post.id, 
        })

    },[me]); 

    return(
        <div style={{marginBottom:'20px'}}>
        <Card 
            cover={post.Images[0] && <PostImages images={post.Images}/> }
            actions={[
                <RetweetOutlined key='retweet' onClick={onRetweet}/>,
                liked
                    ?<HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike}/>
                    : <HeartOutlined key='heart' onClick={onLike}/>,
               
                <MessageOutlined key='comment' onClick={onToggleComment}/>,
                <Popover key="more" content={(
                    <Button.Group>
                    {me && post.User.id == me.id 
                       ?(   
                        <div>    
                        <Button>수정</Button>
                        <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                        </div>
                        )
                        :
                        <Button>신고</Button>     
                        }
               
                    </Button.Group>
                )}>
                    <EllipsisOutlined />
                </Popover>,
            ]}
            title={post.RetweetId ? `${post.User.nickname}님이 리트윗하였습니다.`:null}
            extra={me && <FollowButton post={post} />}
        >


        {post.RetweetId && post.Retweet ?
            
        //리트윗 게시글 일 경우   
        (
        <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />} >
            <div style={{float:'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
            avatar={<Link href={`/user/${post.Retweet.User.id}`}>
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>}
            title={post.Retweet.User.nickname}
            description={<PostCardContent  postData={post.Retweet.content} />}
            />
        </Card>
        )
        :
         //일반 게시글인 경우
        (
        <div>
        <div style={{float:'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
        <Card.Meta
        avatar={<Link href={`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
        title={post.User.nickname}
        description={<PostCardContent  postData={post.content} />}
        />
        </div>
        )}
        </Card>
        {commentFormOpened && (
            <div>
                <CommentForm post={post} />
                <List
                header={`${post.Comments.length}개의 댓글`}
                itemLayout="horizontal"
                dataSource={post.Comments}
                renderItem={(item) => (
                    <li>
                        <Comment
                          author={item.User.nickname}
                          avatar={<Link href={`/user/${item.User.id}`}>
                                    <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                                  </Link>}
                          content={item.content}
                        />
                    </li>
                )}
                />
            </div>
        )}
        
        </div>
    )


}

PostCard.propTypes = {
   post : PropTypes.shape({
       id:PropTypes.number,
       User:PropTypes.object,
       content:PropTypes.string,
       createdAt:PropTypes.string,
       Comments:PropTypes.arrayOf(PropTypes.object),
       Images:PropTypes.arrayOf(PropTypes.object),
       Likers:PropTypes.arrayOf(PropTypes.object), 
       RetweetId:PropTypes.number,
       Retweet:PropTypes.objectOf(), 
   })
  }

export default PostCard
