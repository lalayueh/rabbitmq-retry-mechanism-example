module.exports = {
  work: {
    exchange: 'rabbitmq_retry_example_work_exchange',
    queue: 'rabbitmq_retry_example_work_queue',
    key: 'rabbitmq_retry_example_routing_key',
  },
  wait: {
    exchange: 'rabbitmq_retry_example_wait_exchange',
    queue: (delaySeconds) => `rabbitmq_retry_example_wait_queue@${delaySeconds}`,
    key: (delaySeconds) => `rabbitmq_retry_example_routing_key@${delaySeconds}`,
  },
};
