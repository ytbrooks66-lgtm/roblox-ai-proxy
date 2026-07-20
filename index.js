const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Missing prompt" });
        }

        const response = await axios.post(
            'https://api.x.ai/v1/chat/completions',
            {
                model: "grok-3-mini",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error(
            "Grok API Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: "Failed to connect to Grok API"
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
