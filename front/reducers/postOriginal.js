import shortId from 'shortid'

export const initialState = {
    mainPosts: [
        {
        id:1,
        User:{id:1,
              nickname:'주닐정'
             },
        content:'첫번째 게시글 #헤시태그 #익스프레스',
        Images:[{id:shortId.generate(),src:'http://captainryan.gonetis.com:3095/1001/2222/pictureTest1603948175874.jpg'},
                {id:shortId.generate(),src:'http://captainryan.gonetis.com:3095/pictureTest1600160060865.jpg'},
                {id:shortId.generate(),src:'http://captainryan.gonetis.com:3095/e_sa34409002_1ad2ffd1c7c2d7210d624b296dfd1a87612a85781600242621022.jpg'},
            ],
        Comments:[{id:shortId.generate(), User:{id:shortId.generate(),nickname:'hello'},content:'댓글 첫번째'},
                  {id:shortId.generate(), User:{id:shortId.generate(),nickname:'world'},content:'댓글 두번쨰'},
                ], 
        createdAt:'',
        }
],

    imagePaths:[], 

    addPostLoading: false,
    addPostDone: false,
    addPostError: null,

    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,

    removePostLoading: false,
    removePostDone: false,
    removePostError: null,
}


const ADD_POST = 'ADD_POST'; 
export const addPost = {
    type:ADD_POST,
}
const dummyPost = (data)=> ({

    id:data.id,
    content:data.content,    
    User:{
        id:1,
        nickname:'주닐정',
    },
    Images:[],
    Comments:[],
    

});

const dummyComment =(data)=>({

    id:shortId.generate(),
    content:data,    
    User:{
        id:1,
        nickname:'주닐정',
    },
}); 

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';


const reducer = (state = initialState,action) =>{


    switch(action.type){


//게시글 추가
//-------------------------------------------------        
        case ADD_POST_REQUEST:
        return{
            ...state,
 
            addPostLoading:true,
            addPostDone:false,
            addPostError:null,
        }
        case ADD_POST_SUCCESS:
        return{
            ...state,
            mainPosts: [dummyPost(action.data), ...state.mainPosts],  //게시글 위로 추가 
            //mainPosts: [...state.mainPosts,dummyPost],   //게시글 밑으로 추가 
            addPostLoading:false,
            addPostDone:true,


        }
        case ADD_POST_FAILURE:
        return{
            ...state,
            addPostLoading:false,
            addPostError:action.error,

        }
//-------------------------------------------------


//댓글 추가 
//-------------------------------------------------
        case ADD_COMMENT_REQUEST:
        return{
            ...state,
            addCommentLoading:true,
            addCommentDone:false,

        }
        case ADD_COMMENT_SUCCESS:{
            const postIndex = state.mainPosts.findIndex((v)=>v.id===action.data.postId); 
            const post =state.mainPosts[postIndex]; 
            const Comments = [dummyComment(action.data.content),...post.Comments]; 
            const mainPosts =[...state.mainPosts]; 
            mainPosts[postIndex] = {...post,Comments}; 

        return{
            ...state,
            mainPosts,
            addCommentLoading:false, 
            addCommentDone: true, 
        
            }
        }
        case ADD_COMMENT_FAILURE:
        return{
            ...state,

        }

//-------------------------------------------------


//게시글 삭제 
//-------------------------------------------------
        case REMOVE_POST_REQUEST:{
        return{
            ...state,
            removePostLoading:true,
            removePostDone:false,
            removePostError:null
          }
        }

        case REMOVE_POST_SUCCESS:{
        return{
            ...state,
            mainPosts:state.mainPosts.filter((v)=>v.id!==action.data),
            removePostLoading:false,
            removePostDone:true,
            removePostError:null 
            }
        }

        case REMOVE_POST_FAILURE:{
        return{
            ...state,
            removePostLoading:false,
            removePostError:action.error,
            }
        }

//-------------------------------------------------

        default:
            return state; 
    }



}

export default reducer