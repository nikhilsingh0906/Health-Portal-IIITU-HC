let routeFunction = passport => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const fs = require("fs");
  const path = require("path");
  const users = require("../models/users");
  const appointment = require("../models/appointment");
  const admins = require("../models/admin");
  const doctors = require("../models/doctor");
  const medicines = require("../models/medicine");
  const assigndoctors = require("../models/assignDoctor");
  const contactUs = require("../models/contactUs");
  const crypto = require("crypto");
  let adminFlag=0;

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
      router
      .route("/dashboard")
      .get((req, res, next) => {
        let appointmentCount = 0,
        assignDocCount = 0,
        doctorCount = 0
        let emailArray=[];
        let nameArray=[];
        let rollnumberArray=[];
      //   appointment.distinct(
      //     "email",
      //     {}, // query object
      //     (function(err, email){
      //          if(err){
      //              return console.log(err);
      //          }
      //          if(email){  
      //              console.log(email);
      //          }
      //     })
      //  );
       appointment.distinct(
        "email",
        {},  (err, emailArray) => {
        if (!err) {
          emailArray = emailArray;
          console.log('Email Array from db:\t' + emailArray);
    
          appointment.distinct(
            "name",
            {},  (err, nameArray) => {
            if (!err) {
              nameArray = nameArray;
              console.log('Name Array  from db:\t' + nameArray);
    
              appointment.distinct(
                "rollnumber",
                {},  (err, rollnumberArray) => {
                if (!err) {
                  rollnumberArray = rollnumberArray;
                  console.log('Roll Number Array  from db:\t' + rollnumberArray);

                  appointment.count({}, (err, count) => {
                    if (!err) {
                      appointmentCount = count;
                      console.log('appointmentCount from db:\t' + count);
                
                      assigndoctors.count({}, (err, count) => {
                        if (!err) {
                          assignDocCount = count;
                          console.log('assignDocCount from db:\t' + count);
                
                          doctors.count({}, (err, count) => {
                            if (!err) {
                              doctorCount = count;
                              console.log('doctorCount from db:\t' + count);
    
                
    
                      res.render('dashboard', {
                        appointmentCount: appointmentCount,
                        assignDocCount: assignDocCount,
                        doctorCount: doctorCount,
                        emailArray:emailArray,
                        nameArray:nameArray,
                        rollnumberArray:rollnumberArray
                      });
                    } else {
                      console.error('Error' + err);
                    }
                  });
                } else {
                  console.error('Error' + err);
                }
              });
            } else {
              console.error('Error' + err);
            }
          });
                    } else {
                      console.error('Error ' + err);
                    }
                  });
                } else {
                  console.error('Error' + err);
                }
              });
            } else {
              console.error('Error' + err);
            }
          });
       
  
    // appointment.count({}, (err, count) => {
    //   if (!err) {
    //     appointmentCount = count;
    //     console.log('Cat count from db:\t' + count);
  
    //     assigndoctors.count({}, (err, count) => {
    //       if (!err) {
    //         assignDocCount = count;
    //         console.log('Prod count from db:\t' + count);
  
    //         doctors.count({}, (err, count) => {
    //           if (!err) {
    //             doctorCount = count;
    //             console.log('User count from db:\t' + count);
  
              
  
    //                 res.render('dashboard', {
    //                   appointmentCount: appointmentCount,
    //                   assignDocCount: assignDocCount,
    //                   doctorCount: doctorCount,
                     
    //                 });
    //               } else {
    //                 console.error('Error Fetching Orders Count:\t' + err);
    //               }
    //             });
    //           } else {
    //             console.error('Error Fetching Users Count:\t' + err);
    //           }
    //         });
    //       } else {
    //         console.error('Error Fetching Products Count:\t' + err);
    //       }
    //     });
     
  
  });
    
    router
    .route("/medicines")
   
      .get((req, res, next) => {
        if (adminFlag==1) {
          console.log(adminFlag);

         
      medicines.find({},function(err,medicines){
        res.render("medicines",{medicines:medicines})
      })


        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          res.render("adminLogin", {
            error: req.flash("error"),
            success: req.flash("success")
          });
        }
    
      })
      router
      .route("/contactUS")
      .get((req, res, next) => {
        if (adminFlag==1) {
          console.log(adminFlag);
     contactUs.find({},function(err,contactus){
      res.render("contactUS",{
        contactus:contactus
      })
     })
         


        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          res.render("adminLogin", {
            error: req.flash("error"),
            success: req.flash("success")
          });
        }
       
        })
      
        .post((req, res, next) => {
          contactUs
                    .create({
                      name: req.body.name,
                      email: req.body.email,
                      subject:req.body.subject,
                      description:req.body.message,
                    
                      
                    })
                    .then(user => {
                      console.log("Contact Us Saved");
                     
                      res.statusCode = 201;
                      res.render("index", {
                        error: req.flash("error"),
                        success: req.flash("success"),
                       
                      });
                    })
                    .catch(err => {
                      console.log(err);
                    });
                  });
    
      
      router
        .route("/viewAppointment")
        .get((req, res, next) => {
          if (adminFlag==1) {
            console.log(adminFlag);
  
            res.redirect("viewAppointment")
  
  
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.render("adminLogin", {
              error: req.flash("error"),
              success: req.flash("success")
            });
          }
          
          })
      router
      .route("/addmedicine")
      .get((req, res, next) => {
        if (adminFlag==1) {
          console.log(adminFlag);

          res.render("addMedicine")


        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          res.render("adminLogin", {
            error: req.flash("error"),
            success: req.flash("success")
          });
        }
       
        })
        
        .post((req, res, next) => {
          medicines
                    .create({
                      name: req.body.mName,
                      manufactureDate: req.body.mDate,
                      expiryDate:req.body.eDate,
                      avalaible:req.body.mAva,
                      total:req.body.mTotal,
                      price:req.body.mPrice,
                      
                    })
                    .then(user => {
                      console.log("Medicine Saved");
                     
                      res.statusCode = 201;
                      res.render("addMedicine", {
                        error: req.flash("error"),
                        success: req.flash("success")
                      });
                    })
                    .catch(err => {
                      console.log(err);
                    });
                  });
                 
        router
        .route("/doctors")
        .get((req, res, next) => {
          if (adminFlag==1) {
            console.log(adminFlag);
  
            doctors.find({}, function(err, doctors){
              res.render("doctors", {doctors: doctors});
            });
  
  
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.render("adminLogin", {
              error: req.flash("error"),
              success: req.flash("success")
            });
          }
         
          })
          router
          .route("/assignDoctor")
          .get((req, res, next) => {
            if (adminFlag==1) {
              console.log(adminFlag);
    
              appointment.find({}, function(err, appointment){
                res.render("assignDoctor", {appointment: appointment});
              });
    
    
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.render("adminLogin", {
                error: req.flash("error"),
                success: req.flash("success")
              });
            }
           
            })
            .post((req, res, next) => {
              assigndoctors
                        .create({
                          name: req.body.patientName,
                          email: req.body.patientEmail,
                          branch:req.body.patientBranch,
                          description:req.body.appointmentDesc,
                          symptoms:req.body.symptoms,
                          allergies:req.body.pastIllness,
                          year:req.body.patientYear,
                          mobile:req.body.patientMobile,
                          date:req.body.appointmentDate,
                          rollnumber:req.body.patientRollNumber,
                          assignDoctor:req.body.assignDoc
                          
                        })
                        .then(user => {
                          console.log("Doctor Assigned");
                         
                          res.statusCode = 201;
                          // res.render("assignDoctor", {
                          //   error: req.flash("error"),
                          //   success: req.flash("success"),
                            
                          // });
                          res.redirect("/appointments")
                        })
                        .catch(err => {
                          console.log(err);
                        });
                      });
        
          router
          .route("/insertDoctor")
          .get((req, res, next) => {
            if (adminFlag==1) {
              console.log(adminFlag);
    
              res.render("editDoctor")
    
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.render("adminLogin", {
                error: req.flash("error"),
                success: req.flash("success")
              });
            }
          
            })
            .post((req, res, next) => {
              doctors
                        .create({
                          name: req.body.docName,
                          specialist: req.body.docSpl,
                          mobile:req.body.docMobile,
                          Timings:req.body.docTimings,
                        
                          
                        })
                        .then(user => {
                          console.log("Doctor Saved");
                         
                          res.statusCode = 201;
                          res.render("editDoctor", {
                            error: req.flash("error"),
                            success: req.flash("success")
                          });
                        })
                        .catch(err => {
                          console.log(err);
                        });
                      });
                      router
                      .route("/deletedoctor/:doctorId")
                      .get((req, res, next) => {
                        const requestedDoctorId = req.params.doctorId;

                      doctors.findOne({_id: requestedDoctorId}, function(err, doctor){
                        console.log(doctor);
                        
                        doctors.deleteOne(doctor, function(err, result) { 
                          console.log(result);
                          
                          res.redirect("/doctors")
                      });
                     });
                        })
                        router
                        .route("/deletemedicines/:medicineId")
                        .get((req, res, next) => {
                          const requestedMedicineId = req.params.medicineId;
  
                       
                        medicines.findByIdAndDelete(requestedMedicineId, function (err) {
                          if(err) console.log(err);
                          res.redirect("/medicines")
                        });
                            
                           
                        });
                     router
                     .route("/editmedicines/:medicineId")
                     .get((req,res,next)=>{
                      const requestedMedicineId = req.params.medicineId;
                      medicines.findOne({_id: requestedMedicineId},function(err,medicine){
                        res.render("editMedicine",{medicine:medicine})
                      })
                      
                     })
                     .post((req,res,next)=>{
                      const requestedMedicineId = req.params.medicineId;
                      
                      medicines.updateOne({_id: requestedMedicineId}, {
                        name: req.body.mName,
                        manufactureDate: req.body.mDate,
                        expiryDate:req.body.eDate,
                        avalaible:req.body.mAva,
                        total:req.body.mTotal,
                        price:req.body.mPrice,
                    }, function(err, affected, resp) {
                     
                        res.redirect("/medicines")
                      })
                 
                    
                      
                     
                     })
                     router
                     .route("/editMedicine")
                     .get((req,res,next)=>{
                      if (adminFlag==1) {
                        console.log(adminFlag);
              
                        res.render("editMedicine")
              
                      } else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        res.render("adminLogin", {
                          error: req.flash("error"),
                          success: req.flash("success")
                        });
                      }
                      
                     })
                     router
                     .route("/viewappointment/:appointmentId")
                     .get((req,res,next)=>{
                      const requestedapointmentId = req.params.appointmentId;
                      
                      appointment.findOne({_id: requestedapointmentId},function(err,apointment){
                        console.log(apointment);
                        
                        res.render("viewAppointment",{apointment:apointment})
                      })
                      
                      
                     })
                     router
                     .route("/closeappointment/:appointmentId")
                     .get((req,res,next)=>{
                      const requestedapointmentId = req.params.appointmentId;
                      
                      appointment.findByIdAndDelete(requestedapointmentId, function (err) {
                        if(err) console.log(err);
                        res.redirect("/assignDoctor")
                      });
                      
                      
                     })
                     router
                        .route("/deleteapointment/:appointmentId")
                        .get((req, res, next) => {
                          const requestedApointmentId = req.params.appointmentId;
  
                       
                        assigndoctors.findByIdAndDelete(requestedApointmentId, function (err) {
                          if(err) console.log(err);
                          res.redirect("/appointments")
                        });
                            
                           
                        });
                        router
                        .route("/deletecontact/:contactId")
                        .get((req, res, next) => {
                          const requestedcontactId = req.params.contactId;
  
                       
                        contactUs.findByIdAndDelete(requestedcontactId, function (err) {
                          if(err) console.log(err);
                          res.redirect("/contactUS")
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
              rollnumber:appointmentD.rollnumber,
              date:appointmentD.date,
              mobile:appointmentD.mobile
              
            });
            
          });
        
        });

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
                  date:req.body.date,
                  rollnumber:req.body.patientRollNumber
                  
                })
                .then(user => {
                  console.log("Appointment Saved");
                 
                  res.statusCode = 201;
                  res.render("appointment", {
                    error: req.flash("error"),
                    success: req.flash("success"),
                    user:req.user
                  });
                })
                .catch(err => {
                  console.log(err);
                });
              });

        router
        .route("/patientChangePass")
       
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
        .route("/changePass")
       
          .get((req, res, next) => {
          res.render("changePass")
          })
         
          
         
          router
          .route("/patientlogin")
          .get((req, res, next) => {
            if (req.user) {
              console.log(req.user);
              res.render("appointment",{
                user:req.user
              });
              // res.redirect("appointment");
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
          router
          .route("/adminLogin")
          .get((req, res, next) => {
            if (adminFlag==1) {
              console.log(adminFlag);
              
              res.redirect("/dashboard")
     
  
 
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.render("adminLogin", {
                error: req.flash("error"),
                success: req.flash("success")
              });
            }
           
          })
          .post((req,res)=>{
           
           const password = req.body.password;
           admins.findOne({email:req.body.email},function(err,foundAdmin){
           
             if(err){
             console.log(err);
             }
             else{
            
               
               if(foundAdmin){
               
                 
                 if(foundAdmin.password===password){
                   adminFlag=1;
                   res.redirect("/dashboard")
                 }
                 else{
                   res.render("adminLogin")
                 }
               }
             }

             
           })

          })
           router.get("/appointments", function(req, res){
    assigndoctors.find({}, function(err, assigndoctor){
      res.render("appointments", {assigndoctor: assigndoctor});
    });
  });

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
  router.route("/appointments").get((req, res, next) => {
    if (req.user) {
      res.render("appointments", {
        user: req.user
      });
    } else {
      res.redirect("adminLogin");
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
  
  // router.route("/changeadminpassword").post((req, res, next) => {
  //   admins
  //     .findOne({ email: req.body.email })
  //     .then(admin => {
  //       if (admin) {
         
  //           admins
  //             .updateOne(
  //               { email: req.body.email },
  //               { $set: { password:req.body.aPassword} }
  //             )
  //             .then(info => {
  //               console.log(info);
  //               console.log("Password Updated Successfully");
                
  //               req.flash("success", "Password Changed Successfuly");
  //               return res.render("changePass", {
                 
  //                 success: req.flash("success"),
  //                 error: req.flash("error")
  //               });
  //             })
  //             .catch(err => {
  //               console.log(err);
  //             });
  //         // } else {
  //         //   req.flash("error", "password doesn't match");
  //         //   return res.render(`patientlogin`, {
  //         //     user: user,
  //         //     success: req.flash("success"),
  //         //     error: req.flash("error")
  //         //   });
  //         // }
  //       } else {
  //         req.flash("error", "Something went wrong");
  //         return res.redirect(`patientChangePass`);
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // });
  router
  .route("/changeadminpassword")
  .post((req,res,next)=>{
     const email=req.body.email;
    
    admins.updateOne({email: email}, {
      password: req.body.aPassword,
     
  }, function(err, affected, resp) {
   
      res.redirect("/changePass")
    })
  })


  router.route("/logout").get((req, res, next) => {
    req.logOut();
    req.flash("success", "you're successfuly logged out");
    res.redirect("patientlogin");
  });
  router.route("/adminlogout").get((req, res, next) => {
    req.logOut();
    req.flash("success", "you're successfuly logged out");
    adminFlag=0;
    res.redirect("/adminLogin");
  });
 
 
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
