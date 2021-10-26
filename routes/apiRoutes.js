const express = require('express');
const redis = require("redis");
const router = express.Router();
const axios = require("axios");

const client = redis.createClient(6379);
client.on('error', (err) => {
    console.log("Error " + err)
});

console.log('connected to:' + client.address);

router.get('/users', (req, res) => {

    const userKey = 'user:list';
    return client.get(userKey, (err, users) => {
        if (users) {
            console.log('Fetching data from cache');
            return res.json({ source: 'cache', data: JSON.parse(users) })
        } else {
            console.log('fetching data from remote');
            axios.get('https://jsonplaceholder.typicode.com/todos')
                .then(response => response.data)
                .then(users => {
                    client.setex(todoRedisKey, 3600, JSON.stringify(users)) // Cache API response for an hour
                    return res.json({ source: 'api', data: users })

                })
                .catch(error => {
                    console.log(error)
                    return res.json(error.toString())
                })
        }
    });
});

module.exports = router;