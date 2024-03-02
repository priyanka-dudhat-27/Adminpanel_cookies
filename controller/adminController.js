const Admin=require('../models/adminModel');
const path=require('path');
const fs=require('fs');
const nodemailer=require('nodemailer');

module.exports.logIn=async(req,res)=>{
    return res.render('logIn');
}

module.exports.signIn=async(req,res)=>{
    console.log(req.body);
    try{
        let checkEmail=await Admin.findOne({email:req.body.email});
        res.cookie('admin',checkEmail);
        if(checkEmail){
            if(checkEmail.password==req.body.password){
                console.log('login successfully')
                return res.redirect('/admin/dashboard');
            }else{
                    console.log('Invalid Password');
                return res.redirect('back')
            }
        }
        else{
            console.log('Invalid Email')
            return res.redirect('back')
    }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.dashboard=async(req,res)=>{
    console.log(req.cookies.admin);
    return res.render('dashboard',{
        adminData:req.cookies.admin
    });
}
module.exports.addAdmin=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin')
    }
    return res.render('addAdmin',{
        adminData:req.cookies.admin
    });
}

module.exports.viewAdmin=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin')
    }
    let adminData=await Admin.find({});
    return res.render('viewAdmin',{
        adminRecord:adminData,
        adminData:req.cookies.admin
    });
}

module.exports.insertAdmin=async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    try{
        console.log(req.body);
        console.log(req.file);
        var img='';
        if(req.file){
            img=Admin.iPath+'/'+req.file.filename;
        }
        req.body.name=req.body.fname+' '+req.body.lname;
        req.body.image=img;
        let adminData=await Admin.create(req.body);
        if(adminData){
            console.log('record inserted successfully')
            return res.redirect('/admin/addAdmin');
        }
        else{
            console.log('something wrong')
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
    
}
module.exports.deleteRecord=async(req,res)=>{
    try{
        let singleData=await Admin.findById(req.params.id);
        if(singleData){
            let imgPath=path.join(__dirname,'..',singleData.image);
            await fs.unlinkSync(imgPath);
        }
        let del=await Admin.findByIdAndDelete(req.params.id);
        if(del){
            console.log('record deleted successfully')
            return res.redirect('back')
        }
        else{
            console.log('record not deleted ')
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.updateRecord=async(req,res)=>{
    try{
        if(req.cookies.admin==undefined){
            return res.redirect('/admin')
        }
        let singleData=await Admin.findById(req.params.id);
        return res.render('editAdmin',{
            adminRecord:singleData,
            adminData:req.cookies.admin
        });
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}
module.exports.editAdmin=async(req,res)=>{
    try{
        if(req.file){
            let findData=await Admin.findById(req.params.id);
            if(findData){
                let imagePath=path.join(__dirname,'..',findData.image);
                await fs.unlinkSync(imagePath);
            }
            var img='';
            req.body.image=Admin.iPath+'/'+req.file.filename;
        }
        else{
            let findData=await Admin.findById(req.params.id);
            if(findData){
                req.body.image=findData.image;
                req.body.name=req.body.fname+' '+req.body.lname;
            }
        }
        await Admin.findByIdAndUpdate(req.params.id,req.body);
        return res.redirect('/admin/viewAdmin');
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.profile=async(req,res)=>{
    try{
        if(req.cookies.admin==undefined){
            return res.redirect('/admin')
        }
        return res.render('profile',{
            adminData:req.cookies.admin
        });
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}
module.exports.logout=async(req,res)=>{
    return res.render('login');
}
module.exports.forgetPass=async(req,res)=>{
    return res.render('forgetPass')
}
module.exports.checkEmailForget=async(req,res)=>{
    console.log(req.body);
    let checkEmail=await Admin.findOne({email:req.body.email});
    if(checkEmail){
        const transporter = nodemailer.createTransport({
            host: "smtp.GMAIL.COM",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: "pdudhat27@gmail.com",
              pass: "mwfmuosjsoikcgmh",
            },
          });
              var otp=Math.round(Math.random()*10000)
              res.cookie('otp',otp);
              res.cookie('email',req.body.email);
              var msg=`<h1>RnW inbstitute: <b>otp:${otp}</b></h1>`
          const info = await transporter.sendMail({
            from: '"pdudhat27@gmail.com"', // sender address
            to: "pdudhat27@gmail.com", // list of receivers
            subject: "your OTP is here", // Subject line
            text: "Hello world?", // plain text body
            html: msg, // html body
          });
          return res.redirect('/admin/checkOTP')
    }else{  
        console.log('Invalid Email');
        return res.redirect('back')
    }
}
module.exports.checkOtp=async(req,res)=>{
    return res.render('checkOtp')
}

module.exports.verifyOtp=async(req,res)=>{
    console.log(req.body)
    console.log(req.cookies.otp)
    try{
        if(req.body.otp==req.cookies.otp){
            return res.redirect('/admin/adminChangePass')
        }else{
            return res.redirect('back')
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.adminChangePass=async(req,res)=>{
    return res.render('adminChangePass')
}
module.exports.resetPass=async(req,res)=>{
    console.log(req.body.npass)
    console.log(req.body.conpass);
    if(req.body.npass==req.body.conpass){
        await Admin.findByIdAndUpdate(req.cookies.admin._id,{
            password:req.body.npass
        })
        return res.redirect('/admin')
    }else{
        return res.redirect('back')
    }
}