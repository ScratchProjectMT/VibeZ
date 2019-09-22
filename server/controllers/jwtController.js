const jwt = require('jsonwebtoken');

const jwtController = { };

jwtController.create = async (req, res, next) => {
  console.log('jwtController.create: ', jwtController.create);
  try {
    const token = await jwt.sign(res.locals.token, process.env.PRIVATE_KEY);
    res.locals.token = token;
    return next()
  } catch (err) {
    return next({
      log: `error creating a jwt ${err}`,
      status: 500,
      message: 'server error'
    });
  }
}

jwtController.verify = async (req, res, next) => {
  console.log('jwtController.verify: ', jwtController.verify);
  try {
    if (!req.cookies.token) return next();
    const token = req.cookies.token;
    const legitToken = await jwt.verify(token, process.env.PRIVATE_KEY);
    res.locals.token = legitToken;
    next();
  } catch (err) {
    return next({
      log: `error verifying jwt ${err}`,
      status: 500,
      message: 'server error'
    });
  }
}


module.exports = jwtController;