import { HYDRATE } from 'next-redux-wrapper' //리덕스 서버사이드 렌더링을 위한 것 
import { combineReducers } from 'redux'      //리듀서들을 하나토 합쳐주는 메서드

import user from './user';
import post from './post';


const initialState = {

    user : {

    }, 

    post : {
     
    }

}/*
//(이전상태, 액션) => 다음상태 
const rootReducer = combineReducers({

  // HYDRATE를 위해서 index 리덕스를 추가함 
  // (redux 서버사이드 렌더링을 위해서...)
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log('HYDRATE', action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});
*/

const rootReducer = (state, action) => {
    switch (action.type) {

      // 서버 사이드 렌더링으로 페이지 요청 후 완료되었을 때 호출되는 action
      // (redux 서버사이드 렌더링을 위해서...)
      // SSR을 적용한 페이지는 NEXT_REDUX_WRAPPER_HYDRATE 액션을 실행하여 새로운 state로 매번 갱신된다. 
      case HYDRATE:
        console.log('HYDRATE==>', action);
        return action.payload;
        
      default: {
        const combinedReducer = combineReducers({    
            user,
            post
        });
        return combinedReducer(state, action);
      }
    }
  };
  

export default rootReducer; 