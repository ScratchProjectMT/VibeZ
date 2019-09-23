const fetch = require('node-fetch');

const slackController = { };

const API_URI = `https://slack.com/api/conversations`;

/** 
 * @function getHistory fetch list of slack messages from slack API
 * The url can include token, channel id, latest, limit, and oldest.
 * For more information: https://api.slack.com/methods/conversations.history
 */
slackController.getHistory = async (req, res, next) => {
  console.log('slackController.getHistory');
  try {
    const token = res.locals.token;
    const channel = req.query.channel;
    const latest = req.query.latest || Math.floor(Date.now() / 1000);
    const limit = req.query.limit || 100;
    const oldest = req.query.oldest || latest - 86400;
    const URI = `${API_URI}.history?token=${token}&channel=${channel}&latest=${latest}&limit=${limit}&oldest=${oldest}`;
    const rawResult = await fetch(URI);
    const { messages } = await rawResult.json();
    res.locals.messages = messages;
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
 * https://api.slack.com/methods/conversations.list
 */
slackController.getChannels = async (req, res, next) => {
  console.log('slackController.getChannels');
  const token = res.locals.token;
  const URI = `${API_URI}.list?token=${token}`;
  try {
    const rawChannels = await fetch(URI);
    const { channels } = await rawChannels.json();
    const channelsList = channels.map(channel => {
      return {
        id: channel['id'],
        name: channel['name'],
      }
    })
    res.locals.channels = channelsList
    return next();
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
  const URI = `https://slack.com/api/oauth.access?code=${req.query.code}`;
  const options = {
    headers: {
      "Authorization": `Basic ${Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')}`,
    },
  };
  try {
    const rawResult = await fetch(URI, options);
    const result = await rawResult.json();
    if (result.ok !== true) throw new Error('unsuccessful initial oauth');
    res.locals.token = result.access_token;
    return next();
  } catch (err) {
    return next({
      log: `error fetching to slack oauth ${err}`,
      status: 500,
      message: `server error`,
    });
  }
}


module.exports = slackController;
