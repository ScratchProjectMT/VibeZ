const fetch = require('node-fetch');

const slackController = { };

const DEFAULT_CHANNEL = 'CKA6RDALE';

slackController.getHistory = async (req, res, next) => {
  console.log('slackController.getHistory');
  try {
    const channel = req.body.channel || DEFAULT_CHANNEL;
    const latest = req.body.latest || Math.floor(Date.now() / 1000);
    const oldest = req.body.oldest || latest - 86400;
    const limit = req.body.limit || 100;
    const URI = `https://slack.com/api/conversations.history?token=${process.env.API_KEY}&channel=${channel}&latest=${latest}&limit=${limit}&oldest=${oldest}`;
    const rawResult = await fetch(URI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { messages } = await rawResult.json();
    res.locals.data = messages;
    next();
  } catch (err) {
    return next({
      status: 500,
      log: 'Get History error',
      message: 'Server error while trying to get slack messages',
    })
  }
}

slackController.oAuth = async (req, res, next) => {
  console.log('slackController.oAuth');
  if (!req.query.code) {
    return next({
      log: 'No code',
      status: 400,
      message: 'Did not receive code in query',
    })
  }
  // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
  const URI = `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;
  try {
    const rawResult = await fetch(URI);
    const result = await rawResult.json();
    if (result.ok !== true) throw new Error('unsuccessful initial oauth');
    res.locals.accessToken = result.access_token;
    next();
  } catch (err) {
    next({
      log: `error fetching to slack oauth ${err}`,
      status: 500,
      message: `server error`,
    });
  }
}

slackController.getUser = async (req, res, next) => {
  console.log('slackController.getUser');
  const URI = `https://slack.com/api/users.identity?token=${res.locals.accessToken}`;
  try {
    const rawResult = await fetch(URI);
    const result = await rawResult.json();
    if (result.ok !== true) throw new Error('unsuccessful getUser from slack');
    res.locals.user = result.user;
    res.locals.team = result.team;
    next();
  } catch (err) {
    next({
      log: `error fetching to slack oauth getting user ${err}`,
      status: 500,
      message: `server error`,
    });
  }
}

module.exports = slackController;
