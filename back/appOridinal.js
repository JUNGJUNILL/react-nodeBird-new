
//node app.js 로 실행시킬 수 있다.
//노드는 서버가 아니다.
//노드에서 http 모듈을 제공한다.
const http = require('http'); 
const server= http.createServer((req,res)=>{
    console.log(req.url, req.method); 
    res.write('<h1>hello</h1>');
    res.end('hello node server'); //무조건 마지막에 1번만 쓴다.
                                  //express 일 경우 res.end() 사용한다.
})

server.listen(3999,()=>{
    console.log('서버 실행중')
}); 