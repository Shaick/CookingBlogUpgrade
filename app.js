const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 80;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('BlogSecure'));
app.use(session({
  cookie:{
    secure: true,
    maxAge:60000
  },
  store: '',
  secret: uuidv4(),
  saveUninitialized: true,
  resave: false
  }));

  //Connect flash
app.use(flash());

//FileUpload
app.use(fileUpload());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('sucess_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.set('layout', './layouts/main');
app.set('views', './server/views');
app.set('view engine', 'ejs');

const routes = require('./server/routes/blogRoutes.js');
app.use('/', routes);

app.listen(port, () => console.log(`Listening to port ${port}`));
