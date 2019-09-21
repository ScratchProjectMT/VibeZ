const fetch = require('node-fetch');

const slackController = { };

const DEFAULT_CHANNEL = 'CKA6RDALE';

/** 
 * @function getHistory fetch list of slack messages from slack API
 */
slackController.getHistory = async (req, res, next) => {
  console.log('getHistory: ', getHistory);
  try {
    const channel = req.query.channel || DEFAULT_CHANNEL;
    const latest = req.query.latest || Math.floor(Date.now() / 1000);
    const oldest = req.query.oldest || latest - 86400;
    const limit = req.query.limit || 100;
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
      log: `Get History error: ${err}`,
      message: 'Server error while trying to get slack messages',
    })
  }
}


/** 
 * @function getChannels fetch list of all channels
 * @returns an array of objects. Each object has two keys (id and name)
 */
slackController.getChannels = async (req, res, next) => {
  console.log('getChannels: ', getChannels);
  try {
    const URI = `https://slack.com/api/conversations.list?token=${process.env.API_KEY}&pretty=1`
    const rawChannels = await fetch(URI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    const { channels } = await rawChannels.json();
    const channelsList = channels.map(channel => {
      return {
        id: channel['id'],
        name: channel['name'],
      }
    })
    res.locals.channels = channelsList
    next();
  } catch (err) {
    return next({
      status: 500,
      log: `Get Channel error: ${err}`,
      message: 'Server error while trying to get channels list'
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
