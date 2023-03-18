const express = require('express');
const client = require('prom-client');
const axios = require('axios');

const app = express();
const port = 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'ms_exporter_' });

const customCounter = new client.Counter({
    name: 'ms_exporter_custom_counter',
    help: 'Custom counter for demonstration purposes',
});

app.get('/increment', (req, res) => {
    customCounter.inc();
    res.send('Incremented custom counter');
});

app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        const metrics = await client.register.metrics();
        res.end(metrics);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.get('/query', async (req, res) => {
    const query = req.query.query;
    const response = await axios.get(`http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`);
    res.send(response.data);
});

app.listen(port, () => {
    console.log(`Node.js Prometheus integration listening at http://localhost:${port}`);
});
