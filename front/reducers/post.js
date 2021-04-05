import shortId from 'shortid';
import produce from '../util/produce';
import faker, { fake } from 'faker'; 

export const initialState = {
//     mainPosts: [
//         {
//         id:1,
//         User:{id:1,
//               nickname:'주닐정'
//              },
//         content:'첫번째 게시글 #헤시태그 #익스프레스',
//         Images:[{id:shortId.generate(),src:'http://captainryan.gonetis.com:3095/1001/2222/pictureTest1603948175874.jpg'},
//                 {id:shortId.generate(),src:'http://captainryan.gonetis.com:3095/pictureTest1600160060865.jpg'},
//                 {id:shortId.generate(),src:'http://captainryan.gonetis.com:3095/e_sa34409002_1ad2ffd1c7c2d7210d624b296dfd1a87612a85781600242621022.jpg'},
//             ],
//         Comments:[{id:shortId.generate(), User:{id:shortId.generate(),nickname:'hello'},content:'댓글 첫번째'},
//                   {id:shortId.generate(), User:{id:shortId.generate(),nickname:'world'},content:'댓글 두번쨰'},
//                 ], 
//         createdAt:'',
//         }
// ],

    mainPosts:[], //게시글 

    addPostLoading: false,
    addPostDone: false,
    addPostError: null,

    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,

    removePostLoading: false, //게시글 삭제
    removePostDone: false,
    removePostError: null,

    hasMorePost:true,
    loadPostsLoading: false,
    loadPostsDone: false,
    loadPostsError: null,


    likePostLoading: false, //게시글 좋아요
    likePostDone: false,
    likePostError: null,

    unlikePostLoading: false, //게시글 싫어요
    unlikePostDone: false,
    unlikePostError: null,

    uploadImagesLoading: false, //이미지 업로드 
    uploadImagesDone: false,
    uploadImagesError: null,
    imagePaths:[], 


    retweetLoading: false, //리트윗
    retweetDone: false,
    retweetError: null,


    loadPostLoading: false, //게시글 한 개 가져오기
    loadPostDone: false,
    loadPostError: null,
    singlePost: null,
}

export const generateDummyPost = (number) =>  Array(number).fill().map(()=>({
        
    id:shortId.generate(),
    User:{id:shortId.generate(),
          nickname:faker.name.findName(),
         },
    content:faker.lorem.paragraph(),
    Images:[{id:shortId.generate(), src:faker.image.image(),},
            ],
    Comments:[{id:shortId.generate(), User:{id:shortId.generate(),nickname:faker.name.findName(),},content:faker.lorem.sentence(),},
            ], 

}))

// initialState.mainPosts = initialState.mainPosts.concat(
    
//     Array(20).fill().map(()=>({
        
//             id:shortId.generate(),
//             User:{id:shortId.generate(),
//                   nickname:faker.name.findName(),
//                  },
//             content:faker.lorem.paragraph(),
//             Images:[{id:shortId.generate(), src:faker.image.imageUrl(),},
//                     ],
//             Comments:[{id:shortId.generate(), User:{id:shortId.generate(),nickname:faker.name.findName(),},content:faker.lorem.sentence(),},
//                     ], 

//     }))
// );

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


//이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성은 지키면서)
const reducer = (state = initialState,action) =>{

    return produce(state,(draft)=>{

    switch(action.type){


//게시글 가져오기 
//-------------------------------------------------   
        case LOAD_USER_POSTS_REQUEST:
        case LOAD_HASHTAG_POSTS_REQUEST:     
        case LOAD_POSTS_REQUEST:
            draft.loadPostsLoading=true;
            draft.loadPostsDone=false;
            draft.loadPostsError=null;
            break;
        
        case LOAD_USER_POSTS_SUCCESS:
        case LOAD_HASHTAG_POSTS_SUCCESS:
        case LOAD_POSTS_SUCCESS:
            draft.loadPostsLoading=false;
            draft.loadPostsDone=true;
            draft.mainPosts=draft.mainPosts.concat(action.data); 
            draft.hasMorePost = draft.mainPosts.length===10; //마지막 페이지 그룹 확인
            break;

        case LOAD_USER_POSTS_FAILURE:
        case LOAD_HASHTAG_POSTS_FAILURE:
        case LOAD_POSTS_FAILURE:
            draft.loadPostsLoading=false;
            draft.loadPostsDone=false;
            draft.loadPostsError=action.error;
            break;
//-------------------------------------------------        



//게시글 추가
//-------------------------------------------------        
        case ADD_POST_REQUEST:
            draft.addPostLoading=true;
            draft.addPostDone=false;
            draft.addPostError=null;
            break;
        case ADD_POST_SUCCESS:
            draft.addPostLoading=false;
            draft.addPostDone=true;
            draft.mainPosts.unshift(action.data); 
            draft.imagePaths=[]; 
            break;
 
        case ADD_POST_FAILURE:
            draft.addPostLoading=false;
            draft.addPostError=action.error;
            break;
       
//-------------------------------------------------


//댓글 추가 
//-------------------------------------------------
        case ADD_COMMENT_REQUEST:
            draft.addCommentLoading=true;
            draft.addCommentDone=false;
            draft.addCommentError=null;
            break;
   
        case ADD_COMMENT_SUCCESS:{
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Comments.unshift(action.data);
            draft.addCommentLoading = false;
            draft.addCommentDone = true;
            break; 
        }
        case ADD_COMMENT_FAILURE:
            draft.addCommentLoading=false;
            draft.addCommentError=action.error;
            break;

//-------------------------------------------------


//게시글 삭제 
//-------------------------------------------------
        case REMOVE_POST_REQUEST:{
            draft.removePostLoading=true,
            draft.removePostDone=false,
            draft.removePostError=null
            break;
        }

        case REMOVE_POST_SUCCESS:{
            console.log('REMOVE_POST_SUCCESS==>', action.data)
            draft.removePostLoading=false,
            draft.removePostDone=true,
            draft.removePostError=null,
            draft.mainPosts=draft.mainPosts.filter((v)=>v.id!==action.data.PostId);
            break;
        }

        case REMOVE_POST_FAILURE:{
            draft.removePostLoading=false;
            draft.removePostError=action.error;
            break;
        }

//-------------------------------------------------


//게시글 좋아요
//-------------------------------------------------
        case LIKE_POST_REQUEST:
            draft.likePostLoading = true;
            draft.likePostDone = false;
            draft.likePostError = null;
            break;
        case LIKE_POST_SUCCESS: {
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Likers.push({ id: action.data.UserId });
            draft.likePostLoading = false;
            draft.likePostDone = true;
            break;
        }
        case LIKE_POST_FAILURE:
            draft.likePostLoading = false;
            draft.likePostError = action.error;
            break;
//-------------------------------------------------

//게시글 싫어요
//-------------------------------------------------
        case UNLIKE_POST_REQUEST:
            draft.unlikePostLoading = true;
            draft.unlikePostDone = false;
            draft.unlikePostError = null;
            break;
        case UNLIKE_POST_SUCCESS: {
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
            draft.unlikePostLoading = false;
            draft.unlikePostDone = true;
            break;
        }
        case UNLIKE_POST_FAILURE:
            draft.unlikePostLoading = false;
            draft.unlikePostError = action.error;
            break;
//-------------------------------------------------


//게시글 삭제 
//-------------------------------------------------
        case REMOVE_POST_REQUEST:
            draft.removePostLoading = true;
            draft.removePostDone = false;
            draft.removePostError = null;
            break;
        case REMOVE_POST_SUCCESS:
            draft.removePostLoading = false;
            draft.removePostDone = true;
            draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
            break;
        case REMOVE_POST_FAILURE:
            draft.removePostLoading = false;
            draft.removePostError = action.error;
            break;

        default:
            break;
//-------------------------------------------------


//이미지 업로드
//-------------------------------------------------
        case UPLOAD_IMAGES_REQUEST:
            draft.uploadImagesLoading = true;
            draft.uploadImagesDone = false;
            draft.uploadImagesError = null;
            break;
        case UPLOAD_IMAGES_SUCCESS: {
            draft.imagePaths = draft.imagePaths.concat(action.data);
            draft.uploadImagesLoading = false;
            draft.uploadImagesDone = true;
            break;
        }
        case UPLOAD_IMAGES_FAILURE:
            draft.uploadImagesLoading = false;
            draft.uploadImagesError = action.error;
            break;
//-------------------------------------------------


 //이미지 업로드 한거 지우기 
 //-------------------------------------------------
        case REMOVE_IMAGE:
            draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
            break;
//-------------------------------------------------    


 //리트윗 
 //-------------------------------------------------
        case RETWEET_REQUEST:
            draft.retweetLoading = true;
            draft.retweetDone = false;
            draft.retweetError = null;
            break;
        case RETWEET_SUCCESS: {
            draft.retweetLoading = false;
            draft.retweetDone = true;
            draft.mainPosts.unshift(action.data);
            break;
        }
        case RETWEET_FAILURE:
            draft.retweetLoading = false;
            draft.retweetError = action.error;
            break;
//-------------------------------------------------

//게시글 하나씩 가져오기
//-------------------------------------------------
        case LOAD_POST_REQUEST:
            draft.loadPostLoading = true;
            draft.loadPostDone = false;
            draft.loadPostError = null;
            break;
        case LOAD_POST_SUCCESS:
            draft.loadPostLoading = false;
            draft.loadPostDone = true;
            draft.singlePost = action.data;
            break;
        case LOAD_POST_FAILURE:
            draft.loadPostLoading = false;
            draft.loadPostError = action.error;
            break;
//-------------------------------------------------


    }
}); 

}

export default reducer