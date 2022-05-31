const express = require('express');
const path = require('path');
const store = require('connect-loki');
const session = require('express-session');
const morgan = require('morgan');
const config = require('./public/lib/config');

const host = config.HOST;
const port = config.PORT;

const LokiStore = store(session);

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: '/',
    secure: false,
  },
  name: 'seen-session-id',
  resave: false,
  saveUninitialized: true,
  secret: config.SECRET,
  store: new LokiStore({}),
}));

app.use('/api', apiRouter);
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.listen(
  port,
  host,
  () => console.log(`Server is running on port: ${port}`),
);

module.exports = app;
