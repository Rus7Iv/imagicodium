import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export class DeepseekClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        try {
            const response = await axios.post(
                DEEPSEEK_API_URL,
                {
                    model: "deepseek-coder",
                    messages: [
                        {
                            role: "user",
                            content: `Напиши код на языке ${language} для: ${prompt}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating code:', error);
            throw error;
        }
    }
}