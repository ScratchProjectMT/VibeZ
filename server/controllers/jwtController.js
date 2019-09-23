const jwt = require('jsonwebtoken');

const jwtController = { };

jwtController.create = (req, res, next) => {
  console.log('jwtController.create');
  const token = jwt.sign(res.locals.token, process.env.PRIVATE_KEY);
  res.locals.token = token;
  return next()
}

jwtController.verify = (req, res, next) => {
  console.log('jwtController.verify');
  if (!req.cookies.token) return next({
    log: `no jwt token present`,
    status: 400,
    message: `Not authenticated`,
  });
  const token = req.cookies.token;
  try {
    const legitToken = jwt.verify(token, process.env.PRIVATE_KEY);
    res.locals.token = legitToken;
    next();
  } catch (err) {
    return next({
      log: `error verifying jwt ${err}`,
      status: 400,
      message: 'server error'
    });
  }
}


module.exports = jwtController;