module.exports = function() {
  return process.env.MOZU_TEST_LIVE || process.env.USE_FIDDLER;
};
