const express = require('express');
var session = require('express-session');
var MysqlStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');

var options = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webdb2024'
};
var sessionStore = new MysqlStore(options);
const app = express();

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : false}));

var rootRouter = require('./router/rootRouter'); 
var authRouter = require('./router/authRouter'); 
var codeRouter = require('./router/codeRouter'); 
var productRouter = require('./router/productRouter'); 
var personRouter = require('./router/personRouter');   
var boardRouter = require('./router/boardRouter');    
var purchaseRouter = require('./router/purchaseRouter'); // 라우터 추가

app.use(express.static('public'));

app.use('/', rootRouter);
app.use('/auth', authRouter);
app.use('/code', codeRouter); 
app.use('/product', productRouter); 
app.use('/person', personRouter);   
app.use('/board', boardRouter);     
app.use('/purchase', purchaseRouter); // 경로 추가

app.get('/favicon.ico', (req, res) => res.writeHead(404));
app.listen(3000, () => console.log('GC Shop Project'));