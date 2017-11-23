function getRandomizedBackoffSeconds(retryCount) {
  const base = 1 << retryCount;

  return Math.floor(Math.random() * base) + 1;
}

function halfChanceToPass() {
  return Math.random() * 100 >= 50;
}

module.exports = {
  getRandomizedBackoffSeconds,
  halfChanceToPass,
};
