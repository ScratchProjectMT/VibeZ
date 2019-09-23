const fetch = require('node-fetch');

const slackController = { };

const API_URI = `https://slack.com/api`;

/** 
 * @function getHistory fetch list of slack messages from slack API
 * The url has the query params token, channel id, latest, limit, and oldest.
 * Token (Required): the user's access token.
 * Channel ID (Required): the channel to get the chat history for.
 * Latest: The latest time (i.e. end). Defaults to the current time.
 * Limit: Maximum number of messages. Defaults to 100.
 * Oldest: The oldest time (i.e. start). Defaults to 24 hours before Latest.
 * The data is stored in res.locals.messages
 * 
 * For more information: https://api.slack.com/methods/conversations.history
 */
slackController.getHistory = async (req, res, next) => {
  console.log('slackController.getHistory');
  const token = res.locals.token;
  const channel = req.query.channel;
  const latest = req.query.latest || Math.floor(Date.now() / 1000);
  const limit = req.query.limit || 100;
  const oldest = req.query.oldest || latest - 86400;
  const URI = `${API_URI}/conversations.history?token=${token}&channel=${channel}&latest=${latest}&limit=${limit}&oldest=${oldest}`;
  try {
    const rawResult = await fetch(URI);
    const { messages } = await rawResult.json();
    // This step parses the reactions (i.e. emoji responses) into a string. String will be empty if there are no reactions.
    const parsedMessages = messages.map(msg => ({
      text: msg.text,
      reactionString: (msg.reactions)
        ? msg.reactions
          .reduce((reactionString, reaction) => reactionString.concat(`${reaction.name} `.repeat(reaction.count)), '')
          .slice(0, -1)
        : '',
      ts: msg.ts,
    }));
    res.locals.messages = parsedMessages;
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
 * The url has a single query param: the user's access token
 * Parses return data into an array of objects. Each object has two keys (id and name)
 * Data is stored in res.locals.channels
 * 
 * For more information: https://api.slack.com/methods/conversations.list
 */
slackController.getChannels = async (req, res, next) => {
  console.log('slackController.getChannels');
  const token = res.locals.token;
  const URI = `${API_URI}/conversations.list?token=${token}`;
  try {
    const rawChannels = await fetch(URI);
    const { channels } = await rawChannels.json();
    const channelsList = channels.map(channel => ({
      id: channel['id'],
      name: channel['name'],
    }));
    res.locals.channels = channelsList;
    return next();
  } catch (err) {
    return next({
      status: 500,
      log: `Get Channel error: ${err}`,
      message: 'Server error while trying to get channels list',
    })
  } 
}

/**
 * @function oAuth runs steps 3-4 of oAuth process
 * This is where the user will be redirected after approving our app
 * The request should have the query 'code' which grants us permission for our requested scopes
 * We then request an access token from Slack by sending this code as a query param
 * This fetch sends our client ID and client secret in the authorization header
 * If successful, we save the unencrypted token in res.locals.token
 * 
 * For more information: https://api.slack.com/docs/oauth
 */
slackController.oAuth = async (req, res, next) => {
  console.log('slackController.oAuth');
  if (!req.query.code) {
    return next({
      log: 'No code',
      status: 400,
      message: 'Did not receive code in query',
    })
  }
  const URI = `${API_URI}/oauth.access?code=${req.query.code}`;
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
