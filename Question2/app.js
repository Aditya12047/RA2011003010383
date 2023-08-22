const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TIMEOUT = 500; // milliseconds

app.get('/numbers', async (req, res) => {
    try {
        const urls = req.query.url;

        if (!urls || !Array.isArray(urls)) {
            return res.status(400).json({ error: 'Invalid URLs provided' });
        }

        const fetchPromises = urls.map(async url => {
            try {
                const response = await axios.get(url, { timeout: TIMEOUT });
                return response.data.numbers;
            } catch (error) {
                console.error(`Error fetching data from ${url}: ${error.message}`);
                return [];
            }
       