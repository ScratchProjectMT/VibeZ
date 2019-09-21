const fetch = require('node-fetch');

const slackController = { };

slackController.getGeneralHistory = async (req, res, next) => {
  console.log('slackController.getGeneralHistory');
  const channel = 'CKA6RDALE';
  const latest = Math.floor(Date.now() / 1000);
  const oldest = latest - 86400;
  const URI = `https://slack.com/api/conversations.history?token=${process.env.API_KEY}&channel=${channel}&latest=${latest}&oldest=${oldest}`;
  const rawResult = await fetch(URI, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const parsedResult = await rawResult.json();
  console.log(parsedResult);
  res.locals.data = parsedResult;
  next();
};

module.exports = slackController;
