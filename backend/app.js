require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { testConnection } = require('./utils/db');
const { authenticateToken } = require('./middleware/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const articleRouter = require('./routes/article')
const { result } = require('./utils/results');
const cors = require('cors')

const app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

// 测试数据库连接
testConnection();

app.use('/api/', indexRouter);
app.use('/api/user', authenticateToken, usersRouter);
app.use('/api/article', authenticateToken, articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end(result(err.message, 500, null))
});

const port = process.env.PORT || 4399
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})

module.exports = app;
