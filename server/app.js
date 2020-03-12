const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:4200',
    allowedHeaders: ['token', 'content-type']
}));

app.get('/jira/task/:key', (req, res) => {
    const key = req.params.key;
    const auth = req.header('token');

    const options = {
        url: `https://desenvolvimento.atlassian.net/rest/api/3/issue/${key}`,
        method: 'GET',
        headers: {
            'Authorization': `Basic ${auth}`
        }
    };

    request.get(options, function(err, resp, body) {
        res.status(200).send(body);
    });
});

app.get('/toggl/timeEntries/:start/:end', (req, res) => {
    const start = req.params.start;
    const end = req.params.end;
    const auth = req.header('token');

    const options = {
        url: `https://toggl.com/api/v8/time_entries?start_date=${start}&end_date=${end}`,
        method: 'GET',
        headers: {
            'Authorization': `Basic ${auth}`
        }
    };

    request.get(options, function(err, resp, body) {
        res.status(200).send(body);
    });
});

app.delete('/jira/task/:key/worklog/:id', (req, res) => {
    const key = req.params.key;
    const id = req.params.id;
    const auth = req.header('token');

    const options = {
        url: `https://desenvolvimento.atlassian.net/rest/api/3/issue/${key}/worklog/${id}`,
        method: 'DELETE',
        headers: {
            'Authorization': `Basic ${auth}`
        }
    };

    request.delete(options, function(err, resp, body) {
        res.status(200).send(body);
    });
});

app.post('/jira/task/:key/worklog', (req, res) => {
    const key = req.params.key;
    const auth = req.header('token');

    const options = {
        url: `https://desenvolvimento.atlassian.net/rest/api/3/issue/${key}/worklog`,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`
        },
        body: req.body,
        json: true
    };

    request.post(options, function(err, resp, body) {
        res.status(200).send(body);
    });
});

app.listen(PORT, () => {
    console.log(`Node server is running on the port ${PORT}...`);
});
