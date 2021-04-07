const express = require('express'); 
const cors = require('cors');
const morgan = require('morgan'); //로그 뜨게 해주는 것
const dotenv = require('dotenv');
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session'); 
const cookieParser = require('cookie-parser');
const path = require('path'); 

const app = express(); 
const db = require('./models'); 
const postRouter =require('./routes/post'); 
const postsRouter = require('./routes/posts');
const userRouter =require('./routes/user'); 
const hashtagRouter = require('./routes/hashtag');
const hpp = require('hpp'); 
const helmet = require('helmet'); 


dotenv.config(); //process.env.COOKIE_SECRET 사용할 수 있게 해주는 역할
passportConfig();//passpord

db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공!!');
  })
  .catch(console.error);


if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined')); //로그 정보가 좀 더 상세 한다고 한다.

  //-------------------- 보안에 좀 더 좋다 라고 한다. node로 서버 돌릴 때 필수라고 생각하라고 한다.
  app.use(hpp());
  app.use(helmet());
  //--------------------
}else{
  app.use(morgan('dev'));
}


app.use(cors({
  origin: ['http://localhost:3999','backServerAPI.com','http://15.164.234.24'], //추가
  credentials: true,//백엔드에 쿠키를 같이 전달하기 위해서
}));

app.use('/images/',express.static(path.join(__dirname,'uploads'))); 
                       //운영체제의 경로 문제로 인해 path.join 해 준다.

//프론트에서 보낸 데이터를 req.body 해서 꺼내서 쓸 수 있게 해주는 역할
//----------------------------------------------------  
app.use(express.json());                      //프론트에서 json 형식으로 넘겼을 때  req.body 해서 받을 수 있다.  정확히 axios 로 넘기는 거 
app.use(express.urlencoded({extended:true})); //form 넘겼을 때 req.body 해서 받을 수 있다.                     일반 form 데이터 넘기는 거
//----------------------------------------------------

//로그인 관련
//----------------------------------------------------
app.use(cookieParser(process.env.COOKIE_SECRET)); 
app.use(session({saveUninitialized:false,resave:false,secret:process.env.COOKIE_SECRET})); 
app.use(passport.initialize()); 
app.use(passport.session());
//----------------------------------------------------


app.use('/post',postRouter); 
app.use('/user',userRouter); 
app.use('/posts',postsRouter); 
app.use('/hashtag', hashtagRouter);

app.get('/',(req,res)=>{

    res.send('hello express'); //<-> res.end node 모듈
        //express용
}); 

app.get('/api',(req,res)=>{

    res.json([{id:1,content:'hello'},{id:1,content:'hello'},{id:1,content:'hello'},])
        //express용
}); 


//에러처리 미들웨어는 내부적으로 이 위치에서 동작하지만
//커스터 마이징 가능함(에러 페이지를 따로 만들고 싶거나 할 때)
// app.use((err,req,res,next)=>{

// }); 

app.listen(80,()=>{
    console.log('서버 실행 중!!'); 
})