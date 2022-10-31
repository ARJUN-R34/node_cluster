# Node Cluster

### This is a PoC demonstrating the scaling of nodejs applications using clusters. The master process will spawn `n` child processes to distribute the load among the child processes to scale the single threaded nodejs applications.

#### This application simply generates a random number and returns it as the API response in 10 seconds. The 10s delay is added to simulate the complexity of certain nodejs APIs and also to perform multiple concurrent requests.

<br>

#### How to use

<br>

> Clone the repository

```sh
git clone https://github.com/ARJUN-R34/node_cluster.git

cd node_cluster
```

<br>

> Install dependencies

```sh
npm ci
```

<br>

> Run the application

Update the `.env` file with your desired port to run the application and the number of child processes you want to spawn.

```sh
npm run start
```

You can see the process Ids of all the child processes in the logs.

<br>

> To load test the application

Install the loadtest cli globally in your system

```sh
npm install -g loadtest
```

In your application, run the loadtest using,

```sh
loadtest http://localhost:{PORT}/test -n 100 -c 80
```

`100` is the total number of requests to be made and `80` is the number of concurrent requests to be performed. You can change it the way you like.

You can see the process Ids each API call is assigned to in the logs.
