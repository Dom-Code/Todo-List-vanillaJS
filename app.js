const createError = require('http-errors');
const express = require('express');  
const path = require('path');
const ejs = require('ejs');


// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.use('/api', apiRouter); 
// app.use('/', indexRouter);
// app.use('/users', usersRouter);



// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;





// const express = require('express');
// const path = require('path');

// const apiRouter = require('./routes/api');
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/api', apiRouter);

// module.exports = app;
  
