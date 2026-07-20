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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error(
            "Gemini API Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            error: "Failed to connect to Gemini API"
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
