const amqp = require('amqplib');
const { work, key } = require('./constants.js');

amqp.connect()
  .then((connection) => connection.createChannel())
  .then((channel) => Promise.resolve()
    .then(() => channel.assertExchange(work.exchange, 'direct', { durable: true }))
    .then(() => channel.assertQueue(work.queue))
    .then(() => channel.bindQueue(work.queue, work.exchange, key))
    .then(() => channel.prefetch(1))
    .then(() => channel.consume(work.queue, (message) => {
      console.log(`receive ${message.content}`);
      channel.ack(message);
    }))
  )
  .catch((err) => {
    console.error(`Encountering the error, ${err}`);
  });
