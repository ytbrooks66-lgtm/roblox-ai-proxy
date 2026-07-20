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
            return res.status(400).json({
                error: "Missing prompt"
            });
        }

        const response = await axios.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                model: "deepseek-ai/deepseek-v4-flash",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const answer = response.data.choices[0].message.content;

        res.json({
            answer: answer
        });

    } catch (error) {

        console.error(
            "NVIDIA DeepSeek API Error:",
            error.response?.data || error.message
        );

        // NVIDIA server is busy
        if (error.response?.status === 503) {
            return res.status(503).json({
                error: "AI is busy, try again in a few seconds"
            });
        }

        res.status(500).json({
            error: "Failed to connect to DeepSeek"
        });
    }
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
