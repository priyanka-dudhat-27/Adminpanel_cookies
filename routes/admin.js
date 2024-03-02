const express=require('express');
const routs=express.Router();
const adminContoller=require('../controller/adminController')
const Admin=require('../models/adminModel')

routs.get('/',adminContoller.logIn)
routs.post('/signIn',adminContoller.signIn)
routs.get('/dashboard',adminContoller.dashboard)
routs.get('/addAdmin',adminContoller.addAdmin)
routs.get('/viewAdmin',adminContoller.viewAdmin)
routs.post('/insertAdmin',Admin.uploadImage,adminContoller.insertAdmin)
routs.get('/viewAdmin',adminContoller.viewAdmin)
routs.get('/deleteRecord/:id',adminContoller.deleteRecord)
routs.get('/updateRecord/:id',adminContoller.updateRecord)
routs.post('/editAdmin/:id',Admin.uploadImage,adminContoller.editAdmin)
routs.get('/profile',adminContoller.profile)
routs.get('/logout',adminContoller.logout)
routs.get('/forgetPass',adminContoller.forgetPass)
routs.post('/checkEmailForget',adminContoller.checkEmailForget)
routs.get('/checkOtp',adminContoller.checkOtp)
routs.post('/verifyOtp',adminContoller.verifyOtp)
routs.get('/adminChangePass',adminContoller.adminChangePass)
routs.post('/resetPass',adminContoller.resetPass)


module.exports=routs;