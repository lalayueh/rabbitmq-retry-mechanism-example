const amqp = require('amqplib');
const { work, wait } = require('./constants.js');

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
  .then(() => {
    // publish a message every 1 second
    setInterval(() => {
      const message = Buffer.from(JSON.stringify({ id: Date.now() }));

      console.log(`publish message: ${message}`);
      channel.publish(work.exchange, work.key, message);
    }, 1000);
  })
);
