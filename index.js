const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const port = process.env.PORT || 3000;
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const hostname = 'localhost';
const http=require("http");

app.set("view engine", "ejs");

app.set("views", "views");
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: Date.now() + 3600000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

/*
mongoose
  .connect(process.env.MONGOURI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(db => {
    console.log("Database Connected!");
  })
  .catch(err => {
    console.log(err);
  });
*/
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_message");
  res.locals.error_messages = req.flash("error_message");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./authentication").authentication(app, passport);
app.use("/", require("./routes/routes")(passport));

/*
app.listen(port, () => {
  console.log("Server is running");
});
*/

const server = http.createServer(app);
//const url = "mongodb://localhost:27017/abc",{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true};
const connect = mongoose.connect("mongodb://localhost:27017/abc",{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});