const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const sentimentController = { };

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
