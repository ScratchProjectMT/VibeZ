const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const sentimentController = { };

/** 
 * @function parseData Parse messages and return an array of objects.
 * Each object will contain four keys
 * message: the original text of the message
 * sentiment: sentiment value (neutral is 0, absolute value is sentiment intensity, positive is good, negative is bad)
 * reactionSentiment: the sentiment value for the reactionString
 * time: the time the message was posted (seconds since 1970)
 * 
 * For more information: https://www.npmjs.com/package/sentiment
 */
sentimentController.parseData = (req, res, next) => {
  console.log('sentimentController.parseData');
  const sentimentData = res.locals.messages.map(msg => ({
      message: msg.text,
      sentiment: sentiment.analyze(msg.text).comparative,
      reactionSentiment: (msg.reactionString)
        ? sentiment.analyze(msg.reactionString).comparative
        : 0,
      time: Math.floor(msg.ts),
  }));
  res.locals.sentimentData = sentimentData;
  next();
}

module.exports = sentimentController;