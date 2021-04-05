const passport = require('passport'); 
const {User} = require('../models'); 
const local = require('./local'); 

module.exports = () =>{

    passport.serializeUser((user,done)=>{

        //서버에서는 쿠키랑 유저 아이디만 들고있음.
        done(null,user.id); 
    }); 

    //로그인 성공 후 
    //그 이후부터 매번 실행된다.
    passport.deserializeUser(async(id,done)=>{

        try{

            const user = await User.findOne({where:{id}}); 
            done(null,user); //req.user 객체에 로그인 정보가 들어있다(쿠키와 아이디겠지)

        }catch(e){
            console.error(e); 
            done(e); 
        }

    }); 

    local(); 

}