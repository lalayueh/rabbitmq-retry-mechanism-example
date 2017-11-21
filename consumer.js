const amqp = require('amqplib');
const _ = require('lodash');
const { work, wait } = require('./constants.js');
const { halfChanceToPass, getRandomizedBackoffSeconds } = require('./utils.js');

function handleMessage({ channel, message }) {
  return Promise.resolve()
  // handle message
  .then(() => {
    console.log(`receive message: ${message.content}`);
    if (halfChanceToPass()) {
      channel.ack(message);
      // throw new Error('Do something error');
    } else {
      // channel.ack(message);
      throw new Error('Do something error');
    }
  })
  // error handling
  .catch(() => {
    const retryCount = _.at(message, 'properties.headers["x-retry-count"]')[0] || 0;
    const delaySeconds = getRandomizedBackoffSeconds(retryCount);
    const waitQueue = wait.queue(delaySeconds);
    const waitKey = wait.key(delaySeconds);
    const id = JSON.parse(message.content).id;

    console.error(`Encountering the error, id: ${id}, retry: ${retryCount}`);
    // create delay retry queue
    return channel.assertQueue(waitQueue, {
      deadLetterExchange: work.exchange,
      arguments: {
        'x-dead-letter-exchange': work.exchange,
        'x-dead-letter-routing-key': work.key,
        'x-message-ttl': delaySeconds * 1000,
        'x-expires': delaySeconds * 1000 * 2,
      },
    })
    // bind delay retry queue
    .then(() => channel.bindQueue(waitQueue, wait.exchange, waitKey))
    // ack the original meesage
    .then(() => channel.ack(message))
    // push the message to the wait exchange
    .then(() => channel.publish(wait.exchange, waitKey, message.content, {
      headers: {
        'x-retry-count': retryCount + 1,
      },
    }))
  });
}

// defaults for elided parts are as given in 'amqp://guest:guest@localhost:5672'
amqp.connect()
// create channel
.then((connection) => connection.createChannel())
// setup rabbitmq ralted exchanges and queue
.then((channel) => Promise.resolve()
  .then(() => Promise.all([
    channel.assertExchange(work.exchange, 'direct', { durable: true }),
    channel.assertExchange(wait.exchange, 'direct', { durable: true }),
  ]))
  .then(() => channel.assertQueue(work.queue))
  .then(() => channel.bindQueue(work.queue, work.exchange, work.key))
  .then(() => channel.prefetch(1))
  .then(() => channel.consume(work.queue, (message) => handleMessage({ channel, message })))
)
// error handling
.catch((err) => {
  console.error(`Encountering the error, ${err}`);
});
