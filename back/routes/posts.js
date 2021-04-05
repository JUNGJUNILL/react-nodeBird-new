const express = require('express'); 
const {isLoggedIn,isNotLoggedIn} = require('./middlewares')
const {Post, User,Image,Comment} = require('../models'); 
const router = express.Router(); 
const {Op} = require('sequelize'); 

router.get('/', async (req,res,next)=>{

    try{
        console.log('req.query.lastId=>',req.query.lastId); 
        const where = {}; 
        if (parseInt(req.query.lastId, 10) !== 0) { // 초기 로딩이 아닐 때
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        }
        

        const posts = await Post.findAll({
            where,
            limit: 10,
            order:[['createdAt','DESC'],
                   [Comment,'createdAt','DESC'],
        ],
            include:[{
                model:User, 
                attributes:['id','nickname'],
            },{
                model:Image,
            },{
                model:Comment,
                include:[{
                    model:User,
                    attributes:['id','nickname'],
                }],
            },{
                model:User, //좋아요 누른 사람
                as:'Likers',
                attributes:['id'],
              },{
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


    }catch(e){
        console.error(e); 
        next(e);
    }
}); 




module.exports = router; 