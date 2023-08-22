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
        });

        const fetchedData = await Promise.all(fetchPromises);
        const mergedNumbers = Array.from(new Set(fetchedData.flat())).sort((a, b) => a - b);

        res.json({ numbers: mergedNumbers });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
