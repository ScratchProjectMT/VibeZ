const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const sentimentController = { };

/** 
 * @function sentimentController.parseData Parse messages and return an array of objects.
 * Each object will contain two keys (time and sentiment);
 * Time is the time the message was posted (seconds since 1970);
 * Sentiment is a value from -1 to 1;
 */
sentimentController.parseData = (req, res, next) => {
  console.log('sentimentController.parseData');
  const sentimentData = res.locals.messages.map(msg => ({
      message: msg.text,
      sentiment: sentiment.analyze(msg.text).comparative,
      time: Math.floor(msg.ts),
  }));
  res.locals.sentimentData = sentimentData;
  next();
}

module.exports = sentimentController;