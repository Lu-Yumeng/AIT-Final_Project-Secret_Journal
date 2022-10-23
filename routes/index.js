const express = require('express'), 
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    bcrypt = require('bcrypt');

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/login', async (req, res) => {
  if (req.user){
    console.log("already a user - login");
    await req.logout();
  }
  if (res.locals){
    console.log("here");
    res.locals.user = undefined;
  }
  res.render('login');
});

router.get('/register', async (req, res) => {
  if (req.user){
    console.log("already a user - login");
    await req.logout();
  }
  if (res.locals){
    console.log("here");
    res.locals.user = undefined;
  }
  res.render('register');
});

router.post('/register', async (req, res) => {
  const {username, password,password2} = req.body;
  try{
    const hashedpw = await bcrypt.hash(password,10);
    User.findOne({username},(err,user)=>{
      if (err) {
        throw err;
      }
      if (user !== null){
        console.log("Woops already exists!");
        res.render('register',{message:"User already exists!"});
      }
      else if (password !== password2){
        console.log("pw dnm");
        res.render('register',{message:"Your password does not match!"});
      }
      else{
        const newUser = new User({username,password:hashedpw});
        newUser.save(function(err,users,count){
              if (err){throw err;}
              console.log(newUser);
          });
          res.redirect('/login');
        }
    });    
  } catch{
    console.log("something went wrong");
    res.render('register',{message:"Woops something went wrong ..."});
}
  console.log("register step done");

  // User.register(new User({username}), req.body.password, (err, user) => {
  //   if (err) {
  //     res.render('register',{message:'Your registration information is not valid'});
  //   } else {
  //     passport.authenticate('local')(req, res, function() {
  //       res.redirect('/');
  //     });
  //   }
  // });   
});

router.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash:true,
  }
  )
);

module.exports = router;
