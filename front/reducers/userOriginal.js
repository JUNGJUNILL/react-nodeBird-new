import shortId from 'shortid'


export const initialState = {
    isLoggedIn : false,
    isLoggingIn : false,
    loginError :null,

    isLoggingOut : false,
    isLoggedOut : false,
    logOutError: null, 

    me :null,
    signUpLoading: false, // 회원가입 시도중
    signUpDone: false,
    signUpError: null,

    loginData : {}, 
    Posts:[],
    Followings:[],
    Followers:[],
}

const dummyUser = (data)=>({
    ...data,
    Posts:[{id:1}],
    nickname:'JJI',
    id:1,
    Followings:[{nickname:'정준일'},{nickname:'정준이'},{nickname:'정준삼'}],
    Followers:[{nickname:'y'},{nickname:'x'},{nickname:'z'}],
})



export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME'; 

const reducer = (state = initialState,action) =>{


    switch(action.type){
//로그인
//-------------------------------------------
        case LOG_IN_REQUEST:
            return{
                    //메모리 때문에 새로 만들지 않고 기존state를 참조한다.     
                    ...state,  
                    isLoggingIn:true,
                    isLoggedIn: false,        
                    loginError:null,      
                }; 

        case LOG_IN_SUCCESS:         
            return{
                    ...state,
                    isLoggingIn: false,
                    isLoggedIn: true,
                    me:dummyUser(action.data),
                }; 

        case LOG_IN_FAILURE:
            return{
                //메모리 때문에 새로 만들지 않고 기존state를 참조한다.     
                ...state,
                isLoggingIn: false,
                loginError: action.error,
                
            }; 
//-------------------------------------------

//로그아웃
//-------------------------------------------
        case LOG_OUT_REQUEST:
            return{
                //메모리 때문에 새로 만들지 않고 기존state를 참조한다.
                ...state,
                isLoggingOut:true,
                isLoggedOut:false,
                logOutError:null,
            }; 


        case LOG_OUT_SUCCESS:
            return{
                //메모리 때문에 새로 만들지 않고 기존state를 참조한다.
                ...state,
                isLoggingOut:false,
                isLoggedOut:true,
                me:null, 
            }; 

        case LOG_OUT_REQUEST:
            return{
                //메모리 때문에 새로 만들지 않고 기존state를 참조한다.
                ...state,
                isLoggingOut:false,
                logOutError:action.error,
            }; 
//-------------------------------------------


//회원가입
//-------------------------------------------

        case SIGN_UP_REQUEST:
            return{
                ...state,

            }; 


        case SIGN_UP_SUCCESS:
            return{
                ...state,

            }; 

        case SIGN_UP_FAILURE:
            return{
                ...state,

            }; 

//-------------------------------------------


//게시글 추가 시 내가 쓴 글 카운트 증가/감소
//-------------------------------------------
        case ADD_POST_TO_ME:
            return{
                ...state,
                me:{
                    ...state.me,
                    Posts:[{id:action.data},...state.me.Posts],
                }
            }

//-------------------------------------------


//게시글 삭제 
//-------------------------------------------
        case REMOVE_POST_OF_ME:{
            
            return{
                ...state,
                me:{
                    ...state.me,
                    Posts:state.me.Posts.filter((v)=>v.id!==action.data),
                }
            }
        }
//-------------------------------------------


        default:
            return state; 
    }



}

export default reducer