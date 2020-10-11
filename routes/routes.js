let routeFunction = passport => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const fs = require("fs");
  const path = require("path");
  const users = require("../models/users");
  const appointment = require("../models/appointment");
  const crypto = require("crypto");
  const router = express.Router();
  const resetPassword = require("../authentication/resetPassword");
  
let globalemail;
  router.use(bodyParser.urlencoded({ extended: false }));
  // index page
  router.route("/").all((req, res, next) => {
    res.redirect("/index");
  });

  router
    .route("/index")
    .get((req, res, next) => {
        res.render("index");
      })
     
  // router
  //     .route("/patientlogin")
  //     .get((req, res, next) => {
  //       if (req.user) {
  //         res.redirect("appointment");
  //       } else {
  //         res.statusCode = 200;
  //         res.setHeader("Content-Type", "text/html");
  //         res.render("patientlogin", {
  //           error: req.flash("error"),
  //           success: req.flash("success")
  //         });
  //       }
  //     })
        router
    .route("/appointment")
    // .get((req, res, next) => {
    //     res.render("appointment");
    //   })
      .post((req, res, next) => {
      appointment
                .create({
                  name: req.body.name,
                  email: req.body.email,
                  branch:req.body.branch,
                  description:req.body.description,
                  symptoms:req.body.symptoms,
                  allergies:req.body.allergies,
                  year:req.body.year,
                  mobile:req.body.mobile,
                  date:req.body.date
                  
                })
                .then(user => {
                  console.log("Appointment Saved");
                 
                  res.statusCode = 201;
                  res.render("appointment", {
                    error: req.flash("error"),
                    success:req.flash("success"),
                    user:req.user
                  });
                  
                })
                .catch(err => {
                  console.log(err);
                });
              });
              

     router
      .route("/appointmentPrint/:patientEmail")

      .get((req, res)=>{

        const requestedStudentId = req.params.patientEmail;
        //db.collection.findOne({"$query":{},"$orderby":{ "_id": -1 }})
        //let student=appointment.find({}).sort({'timestamps':-1}).limit(1);
          appointment.findOne({email:requestedStudentId}).sort({'_id':-1}).limit(1).exec(function(err, appointmentD){
          //if(student){  
          console.log(appointmentD);
            res.render("appointmentPrint",{
              name: appointmentD.name,
              branch: appointmentD.branch,
              email:appointmentD.email,
              description:appointmentD.description,
              allergies:appointmentD.allergies,
              symptoms:appointmentD.symptoms,
              year:appointmentD.year,
              date:appointmentD.date
            });
            
          });
        
        });
        
      
        router
        .route("/patientChangePass")
        // .get((req, res, next) => {
        //     res.render("patientChangePass");
        //   });
          .get((req, res, next) => {
            if (req.user) {
              console.log(req.user);
             
              res.render("patientChangePass",{
                user:req.user
              });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.render("patientlogin", {
                error: req.flash("error"),
                success: req.flash("success")
              });
            }
          })
          
         
          router
          .route("/patientlogin")
          .get((req, res, next) => {
            if (req.user) {
              console.log(req.user);
             
              res.render("appointment",{
                user:req.user
              });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.render("patientlogin", {
                error: req.flash("error"),
                success: req.flash("success")
              });
            }
          })
          .post(
            passport.authenticate("local", {
              successRedirect: "appointment",
              failureRedirect: "patientlogin",
              failureFlash: true,
              successFlash: true
            })
          )
  // router

  //   .route("/patientlogin")
    
  //   .post(
  //     passport.authenticate("local", {
  //       successRedirect: "appointment",
  //       failureRedirect: "patientlogin",
  //       failureFlash: true,
  //       successFlash: true
  //     })
  //   )
  // router.post('/patientlogin', passport.authenticate('local'), (req, res) => {

  //   var token = authenticate.getToken({_id: req.user._id});
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'application/json');
  //   res.json({success: true, token: token, status: 'You are successfully logged in!'});
  //   res.render("appointment")
  // });
    // .put((req, res, next) => {
    //   badMethod(req);
    // })
    // .delete((req, res, next) => {
    //   badMethod(req);
    // });

  // User registration page

  router
    .route("/register")
    .get((req, res, next) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.render("register", {
        error: req.flash("error"),
        success: req.flash("success")
      });
    })
    .post((req, res, next) => {
      users
        .findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            //if (req.body.password !== req.body.rPassword) {
             // res.statusCode = 400;
              //req.flash("error", "Password doesn't match");
              //res.render("register", {
                //error: req.flash("error"),
                //success: req.flash("success")
              //});
            //} else {
              let salt = crypto.randomBytes(16).toString("hex");
              let hash = crypto
                .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
                .toString("hex");
              users
                .create({
                  name: req.body.name,
                  email: req.body.email,
                  password: hash,
                  salt: salt
                })
                .then(user => {
                  console.log("User Created");
                  req.flash("success", "You are registered");
                  res.statusCode = 201;
                  res.render("patientlogin", {
                    error: req.flash("error"),
                    success: req.flash("success")
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            
          } else {
            req.flash("error", "Email already exist");
            res.statusCode = 400;
            res.render("register")
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .put((req, res, next) => {
      badMethod(req);
    })
    .delete((req, res, next) => {
      badMethod(req);
    });

  router
    .route("/reset_password")
    .get((req, res, next) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.render("patientChangePass", {
        success: req.flash("success"),
        error: req.flash("error")
      });
    })
    .post((req, res, next) => {
      const email = req.body.email;
      users
        .findOne({ email: email })
        .then(user => {
          if (user) {
            resetPassword(user, req)
              .then(info => {
                if (info) {
                  console.log(info);
                  return res.render("token", {
                    success: req.flash("success"),
                    error: req.flash("error"),
                    user: user
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            req.flash("error", "User not found");
            return res.redirect("patientChangePass");
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .put((req, res, next) => {
      badMethod(req);
    })
    .delete((req, res, next) => {
      badMethod(req);
    });

  router.route("/appointment").get((req, res, next) => {
    if (req.user) {
      res.render("appointment", {
        user: req.user
      });
    } else {
      res.redirect("patientlogin");
    }
  });

  router.route("/reset_password/:emailId").post((req, res, next) => {
    let accessToken = crypto
      .pbkdf2Sync(req.body.token, "", 1000, 64, "sha512")
      .toString("hex");
    users
      .findOne({ email: req.params.emailId })
      .then(user => {
        if (user) {
          if (accessToken === user.passwordResetToken) {
            if (Date.now() < user.tokenExpiry) {
              return res.render("newPassword", {
                success: req.flash("success"),
                error: req.flash("error"),
                user: user
              });
            } else {
              req.flash("error", "Token Expired");
              return res.render("resetPassword", {
                success: req.flash("success"),
                error: req.flash("error")
              });
            }
          } else {
            req.flash("error", "Token doesn't match");
            return res.render("resetPassword", {
              success: req.flash("success"),
              error: req.flash("error")
            });
          }
        } else {
          req.flash("error", "Something went wrong");
          return res.render("resetPassword", {
            success: req.flash("success"),
            error: req.flash("error")
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.route("/change_password").post((req, res, next) => {
    users
      .findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          // if (req.body.password === req.body.password2) {
            let salt = crypto.randomBytes(16).toString("hex");
            let hash = crypto
              .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
              .toString("hex");
            users
              .updateOne(
                { email: req.body.email },
                { $set: { salt: salt, password: hash } }
              )
              .then(info => {
                console.log(info);
                console.log("Password Updated Successfully");
                
                req.flash("success", "Password Changed Successfuly");
                return res.render("patientChangePass", {
                  user:req.user,
                  success: req.flash("success"),
                  error: req.flash("error")
                });
              })
              .catch(err => {
                console.log(err);
              });
          // } else {
          //   req.flash("error", "password doesn't match");
          //   return res.render(`patientlogin`, {
          //     user: user,
          //     success: req.flash("success"),
          //     error: req.flash("error")
          //   });
          // }
        } else {
          req.flash("error", "Something went wrong");
          return res.redirect(`patientChangePass`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.route("/logout").get((req, res, next) => {
    req.logOut();
    req.flash("success", "you're successfuly logged out");
    res.redirect("patientlogin");
  });
 
  // router
  //   .route("/forgot")
  //   .get((req, res, next) => {
  //       res.render("forgot");
  //     })
  // router.route('/forgot')
  // .post((req, res, next)=> {
  //   // async.waterfall([
  //   //   function(done) {
  //       crypto.randomBytes(20, function(err, buf) {
  //         var token = buf.toString('hex');
  //         done(err, token);
  //       });
  //     },
  //     function(token, done) {
  //       User.findOne({ email: req.body.email }, function(err, user) {
  //         if (!user) {
  //           req.flash('error', 'No account with that email address exists.');
  //           return res.redirect('/forgot');
  //         }
  
  //         user.resetPasswordToken = token;
  //         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
  //         user.save(function(err) {
  //           done(err, token, user);
  //         });
  //       });
  //     },
  //     function(token, user, done) {
  //       var smtpTransport = nodemailer.createTransport('SMTP', {
  //         service: 'SendGrid',
  //         auth: {
  //           user: '!!! YOUR SENDGRID USERNAME !!!',
  //           pass: '!!! YOUR SENDGRID PASSWORD !!!'
  //         }
  //       });
  //       var mailOptions = {
  //         to: user.email,
  //         from: 'passwordreset@demo.com',
  //         subject: 'Node.js Password Reset',
  //         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
  //           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
  //           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
  //           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  //       };
  //       smtpTransport.sendMail(mailOptions, function(err) {
  //         req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
  //         done(err, 'done');
  //       });
  //     // }
  //   // ], function(err) {
  //   //   if (err) return next(err);
  //   //   res.redirect('/patientlogin');
  //   // });
  // });
  let badMethod = req => {
    var file = path.resolve(__dirname, "../views/error.html");
    fs.access(file, fs.F_OK, err => {
      if (!err) {
        res.statusCode = 405;
        res.setHeader("Content-Type", "text/html");
        fs.createReadStream(file).pipe(res);
      } else {
        res.statusCode = 500;
        res.send("<p>Sorry Something Went Wrong</p>");
      }
    });
  };

  return router;
};

module.exports = routeFunction;
