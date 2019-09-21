const fetch = require('node-fetch');

const slackController = { };

const DEFAULT_CHANNEL = 'CKA6RDALE';

/** 
 * @function getHistory fetch list of slack messages from slack API
 * The url can include token, channel id, latest, limit, and oldest.
 * For more information: https://api.slack.com/methods/conversations.history
 * 
 */
slackController.getHistory = async (req, res, next) => {
  //console.log('getHistory: ', getHistory);
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
    console.log('messages: ', messages);
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
  //console.log('getChannels: ', getChannels);
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

module.exports = slackController;
