const fetch = require('node-fetch');

const slackController = { };

const DEFAULT_CHANNEL = 'CKA6RDALE';

slackController.getHistory = async (req, res, next) => {
  console.log('slackController.getHistory');
  try {
    console.dir(process.env)
    const channel = req.body.channel || DEFAULT_CHANNEL;
    const latest = req.body.latest || Math.floor(Date.now() / 1000);
    const oldest = req.body.oldest || latest - 86400;
    const limit = req.body.limit || 100;
    const URI = `https://slack.com/api/conversations.history?token=${process.env.API_KEY}&channel=${channel}&latest=${latest}&limit=${limit}&oldest=${oldest}`;
    console.log(URI);
    const rawResult = await fetch(URI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { messages } = await rawResult.json();
    console.log(messages)
    res.locals.data = messages;
    next();
  } catch (err) {
    return next({
      status: 500,
      log: 'Get History error',
      err: 'Server error while trying to get slack messages',
    })
  }
}

module.exports = slackController;
