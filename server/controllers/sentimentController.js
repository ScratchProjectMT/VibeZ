const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const sentimentController = { };

sentimentController.parseData = (req, res, next) => {
  const sentimentData = [];
  res.locals.data.forEach(msg => {
    sentimentData.push([
      sentiment.analyze(msg.text).comparative,
      Math.floor(msg.ts),
    ]);
  });
  res.locals.sentimentData = sentimentData;
  next();
}

module.exports = sentimentController;
