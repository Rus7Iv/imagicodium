import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            const response = await axios.post(
                OPENAI_API_URL,
                {
                    model: "gpt-3.5-turbo",
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