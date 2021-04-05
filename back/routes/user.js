const express = require('express'); 
const bcrypt = require('bcrypt'); 
const passport = require('passport'); 
const { User, Post, Image, Comment } = require('../models');
const db = require('../models');
const {isLoggedIn,isNotLoggedIn} = require('./middlewares')

const router = express.Router(); 

//로그인 정보 유지 
router.get('/', async (req,res,next)=>{
    //req.headers의 생김새 
    //서버 사이드 렌더링에서 쿠기를 넣어 주지 않았을 때(쿠키 없음)
    /*
    {
        accept: 'application/json, text/plain, ',
        'user-agent': 'axios/0.21.1',
        host: 'localhost:3999',
        connection: 'close'
    }

    //서버 사이드 렌더링에서 쿠기를 넣어 주었을 때(쿠키 있음)
    {
        accept: 'application/json, text/plain, ',
        cookie: 'connect.sid=s%3AzNRrzZr1GayhOCDcAybOh4_5JddEzoVe.CTXpdPiCXA%2BZukPDqhbHlzOWcMyOyNB37DXeuCWb6eQ',
        'user-agent': 'axios/0.21.1',
        host: 'localhost:3999',
        connection: 'close'
    }

    */
    try{
        if(req.user){

            const fullUserWithoutPassword =  await User.findOne({
                where:{id:req.user.id},
                attributes:{
                    exclude:['password'], 
                },
                include:[{
                    model:Post,
                    attributes:['id'],
                },{
                    model:User,
                    as:'Followings',
                    attributes:['id'],
                },{
                    model:User,
                    as:'Followers', 
                    attributes:['id'],
                }]
            });

            res.status(200).json(fullUserWithoutPassword); 

        }else{

            res.status(200).json(null); 

        }



    }catch(e){
        console.error(e); 
        next(e);
    }
}); 

//로그인
router.post('/login', isNotLoggedIn,(req,res,next)=>{

    //미들웨어를 확장하는 방법------------------
    passport.authenticate('local',(err,user,info)=>{
    
    
        if(err){//서버 에러
            console.error(err); 
            return next(err); 
        }
        if(info){//클라이언트 에러
            return res.status(401).send(info.reason); 
        }

        //passport login
        //          ▼ passport 설치시 제공 해 준다.
        return req.login(user,async (loginErr)=>{
            
            if(loginErr){ //passport로그인
                console.error(loginErr); 
                return next(loginErr); 
            }

           const fullUserWithoutPassword =  await User.findOne({
                where:{id:user.id},
                attributes:{
                    exclude:['password'], 
                },
                include:[{
                    model:Post,
                },{
                    model:User,
                    as:'Followings',
                },{
                    model:User,
                    as:'Followers', 
                }]
            });
            
            //사용자 정보를 프론트로 넘겨준다.(쿠키와 아이디)
            return res.json(fullUserWithoutPassword); 
            
        }); 
    
    })(req,res,next) ; 
    //-----------------------------------------

}); 

//로그아웃
router.post('/logout', isLoggedIn,async (req,res,next)=>{

    try{
        req.logout(); 
        req.session.destroy(); 
        res.send('ok'); 

    }catch(e){
        console.error(e); 
        next(e);
    }
}); 

//회원가입
router.post('/', isNotLoggedIn, async (req,res,next)=>{
    try{

        //200번 성공
        //300번 리다이렉트
        //400번대 클라이언트 오류
        //500번대 서버 오류

        const exUser = await User.findOne({
            where:{
                email:req.body.email,
            }
        });

        if(exUser){
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }
 
        const hashedPassword = await bcrypt.hash(req.body.password,10); 
        await User.create({
            email:req.body.email,
            nickname:req.body.nick,
            password:hashedPassword,
        });

        return res.status(200).send('ok'); 

    }catch(e){
            console.error(e); 
            next(e);
    }
});



//닉네임 수정
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
      
      await User.update({
        nickname: req.body.nickname,
      }, {
        where: { id: parseInt(req.user.id,10) },
      });
  
      res.status(200).json({ nickname: req.body.nickname });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

//팔로워 목록 가져오기
router.get('/followers', isLoggedIn, async (req,res,next)=>{

    try{
        const user = await User.findOne({
            where:{id:req.user.id}
        })

        if(!user){
            return res.status(403).send('존재하지 않는 회원입니다.');
        }

        const followers = await user.getFollowers({
            limit:parseInt(req.query.limit,10),
        }); 
        res.status(200).json(followers); 

    }catch(e){
        console.error(e); 
        next(e);
    }
}); 



//팔로잉 목록 가져오기
router.get('/followings', isLoggedIn, async (req,res,next)=>{

    try{
        const user = await User.findOne({
            where:{id:req.user.id}
        });

        if(!user){
            return res.status(403).send('존재하지 않는 회원입니다.');
        };

        const followings = await user.getFollowings({
            limit:parseInt(req.query.limit,10),
        });  
        res.status(200).json(followings); 

    }catch(e){
        console.error(e); 
        next(e);
    }
}); 


//팔로잉 차단
router.delete('/follower/:userId', async (req,res,next)=>{

    try{
        const user = await User.findOne({
            where:{id:req.params.userId}
        })

        if(!user){
            return res.status(403).send('존재하지 않는 회원입니다.');
        }

        await user.removeFollowings(req.user.id); 
        res.status(200).json({UserId:parseInt(req.params.userId,10)}); 


    }catch(e){
        console.error(e); 
        next(e);
    }
}); 



//팔로우 
router.patch('/:userId/follow', isLoggedIn, async (req,res,next)=>{

    try{
        const user = await User.findOne({
            where:{id:req.params.userId}
        })

        if(!user){
            return res.status(403).send('존재하지 않는 회원입니다.');
        }

        await user.addFollowers(req.user.id); 
        res.status(200).json({UserId:parseInt(req.params.userId,10)}); 

    }catch(e){
        console.error(e); 
        next(e);
    }
}); 

//언팔로우
router.delete('/:userId/follow', isLoggedIn, async (req,res,next)=>{

    try{
        const user = await User.findOne({
            where:{id:req.params.userId}
        })

        if(!user){
            return res.status(403).send('존재하지 않는 회원입니다.');
        }

        await user.removeFollowers(req.user.id); 
        res.status(200).json({UserId:parseInt(req.params.userId,10)}); 


    }catch(e){
        console.error(e); 
        next(e);
    }
}); 


//해당 아이디가 작성한 게시물 가져오기
router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts
    try {
      const where = { UserId: req.params.userId };
      if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
      } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
      const posts = await Post.findAll({
        where,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
            order: [['createdAt', 'DESC']],
          }],
        }, {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        }, {
          model: Post,
          as: 'Retweet',
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }, {
            model: Image,
          }]
        }],
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });


/*
router.post('/login', async (req,res,next)=>{

    try{

    }catch(e){
        console.error(e); 
        next(e);
    }
}); 

*/

module.exports = router; 