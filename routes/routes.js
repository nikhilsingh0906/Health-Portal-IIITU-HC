let routeFunction = passport => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const fs = require("fs");
  const path = require("path");
  const users = require("../models/users");
  const crypto = require("crypto");
  const router = express.Router();
  const resetPassword = require("../authentication/resetPassword");

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
      .route("/patientlogin")
      .get((req, res, next) => {
          res.render("patientlogin");
        })
    
  router

    .route("/login")
    .get((req, res, next) => {
      if (req.user) {
        res.redirect("dashboard");
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.render("index", {
          error: req.flash("error"),
          success: req.flash("success")
        });
      }
    })
    .post(
      passport.authenticate("local", {
        successRedirect: "index",
        failureRedirect: "patientlogin",
        failureFlash: true,
        successFlash: true
      })
    )
    .put((req, res, next) => {
      badMethod(req);
    })
    .delete((req, res, next) => {
      badMethod(req);
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
            res.render("register", {
              error: req.flash("error"),
              success: req.flash("success")
            });
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
      res.render("resetPassword", {
        success: req.flash("success"),
        error: req.flash("error")
      });
    })
    .post((req, res, next) => {
      const email = req.body.username;
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
            return res.redirect("reset_password");
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

  router.route("/dashboard").get((req, res, next) => {
    if (req.user) {
      res.render("dashboard", {
        user: req.user
      });
    } else {
      res.redirect("login");
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

  router.route("/change_password/:emailId").post((req, res, next) => {
    users
      .findOne({ email: req.params.emailId })
      .then(user => {
        if (user) {
          if (req.body.password === req.body.password2) {
            let salt = crypto.randomBytes(16).toString("hex");
            let hash = crypto
              .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
              .toString("hex");
            users
              .updateOne(
                { email: req.params.emailId },
                { $set: { salt: salt, password: hash } }
              )
              .then(info => {
                console.log(info);
                req.flash("success", "Password Changed Successfuly");
                return res.render("index", {
                  success: req.flash("success"),
                  error: req.flash("error")
                });
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            req.flash("error", "password doesn't match");
            return res.render(`newPassword`, {
              user: user,
              success: req.flash("success"),
              error: req.flash("error")
            });
          }
        } else {
          req.flash("error", "Something went wrong");
          return res.redirect(`reset_password`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  router.route("/logout").get((req, res, next) => {
    req.logOut();
    req.flash("success", "you're successfuly logged out");
    res.redirect("login");
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
