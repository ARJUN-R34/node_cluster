/* eslint-disable no-console */
const cluster = require('cluster');
const { cpus } = require('os');
const process = require('process');
const express = require('express');

require('dotenv').config();

const numCPUs = cpus().length;

let server;

if (cluster.isMaster) {

    // log the number of cpus in the machine
    console.log(`Number of CPUs is #${numCPUs}`);

    // log the primary process id
    console.log(`Primary prpcess #${process.pid} is running`);

    // spawn child processes equal to the number of cpus available
    for (let i = 0; i < process.env.CHILD_PROCESSES; i += 1) {
        cluster.fork();
    }

    // log an error if a child process exits and spawn a new one
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker #${worker.process.pid} died`);

        console.log('Spawning a new worker');

        cluster.fork();
    });

} else {
    server = express();

    const app = server.listen(process.env.PORT);

    try {
        server.enable('trust proxy');

        server.use(express.urlencoded({
            extended: true,
        }));

        server.use(express.json());

        server.use((req, res, next) => {
            req.pid = process.pid;
            next();
        });

        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        server.use('/test', async function(req, res) {
            console.log(`Request serving on process #${req.pid}`);

            const random = Math.random();

            // sleep for 10s to simulate long api calls.
            await sleep(10000);

            return res.json({ number: random, pid: req.pid });
        });
    } catch (e) {
        app.close();
    }

    console.log(`Worker #${process.pid} started`);
}
