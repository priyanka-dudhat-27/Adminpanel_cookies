const express=require('express');
const port=8001;
const app=express();
const path=require('path');
const db=require('./config/mongoose')
const Admin=require('./models/adminModel')
const nodemailer=require('nodemailer');
const cookieParser=require('cookie-parser');
app.use(cookieParser());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded())

app.use(express.static(path.join(__dirname,'assets')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/',require('./routes'))

app.listen(port,function(err){
    (err)?console.log('something wrong'):console.log('server is running on port',port)
})