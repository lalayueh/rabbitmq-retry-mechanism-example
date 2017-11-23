# rabbitmq-retry-mechanism-example

## How to run the example?

### 0. Checking your node is greater than 6.0
    node -v

### 1. Using Docker to launch RabbitMQ
    docker-compose up

### 2. Starting the producer
    node producer.js

### 3. Starting the consumer
    node consumer.js

## Reference
[This link](https://medium.com/@lalayueh/%E5%A6%82%E4%BD%95%E5%84%AA%E9%9B%85%E5%9C%B0%E5%9C%A8rabbitmq%E5%AF%A6%E7%8F%BE%E5%A4%B1%E6%95%97%E9%87%8D%E8%A9%A6-c050efd72cdb)如何優雅地在rabbitmq實現失敗重試
