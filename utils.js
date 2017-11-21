function getRandomizedBackoffSeconds(retryCount) {
  const base = 2 << (retryCount + 1);

  return Math.floor(Math.random() * base) + 1;
}

function halfChanceToPass() {
  return Math.random() * 100 >= 50;
}

module.exports = {
  getRandomizedBackoffSeconds,
  halfChanceToPass,
};
