const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const sentimentController = { };

/** 
 * @function sentimentController.parseData Parse messages and return an array of objects.
 * Each object will contain two keys (time and sentiment);
 * Time is the time the message was posted;
 * Sentiment is a value from -1 to 1;
 */
sentimentController.parseData = (req, res, next) => {
  const sentimentData = [];
  res.locals.data.forEach(msg => {
    sentimentData.push({
      time: Math.floor(msg.ts),
      sentiment: sentiment.analyze(msg.text).comparative,
    });
  });
  res.locals.sentimentData = sentimentData;
  next();
}

module.exports = sentimentController;