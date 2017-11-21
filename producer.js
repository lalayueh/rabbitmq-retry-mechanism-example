const amqp = require('amqplib');
const { work, key } = require('./constants.js');

amqp.connect()
  .then((connection) => connection.createChannel())
  .then((channel) => Promise.resolve()
    .then(() => channel.assertExchange(work.exchange, 'direct', { durable: true }))
    .then(() => channel.assertQueue(work.queue))
    .then(() => channel.bindQueue(work.queue, work.exchange, key))
    .then(() => {
      let count = 0;

      // publish a message every 1 second
      setInterval(() => {
        count += 1;
        const message = new Buffer(JSON.stringify({ count }));

        console.log(`publish ${message}`);
        channel.publish(work.exchange, key, message);
      }, 1000);
    })
  );
