import axios, { AxiosProxyConfig } from 'axios';

const AI21_API_URL = 'https://api.ai21.com/studio/v1/chat/completions';

export class Ai21Client {
    private apiKey: string;
    private proxy?: AxiosProxyConfig;

    constructor(apiKey: string, proxy?: AxiosProxyConfig) {
        this.apiKey = apiKey;
        this.proxy = proxy;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await axios.post(
                AI21_API_URL,
                {
                    messages: [
                        {
                            role: "user",
                            content: `Напиши код на языке ${language} для: ${prompt}. Учти, что нужно написать только код и ничего кроме кода (без ковычек и подписей)`
                        }
                    ],
                    model: "jamba-instruct-preview",
                    temperature: 0.5,
                    max_tokens: 1024,
                    top_p: 1,
                    stream: false,
                    stop: null
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    proxy: this.proxy
                }
            );

            const rawCode = response.data.choices[0].message.content;
            const cleanedCode = rawCode.replace(/```[^\n]*\n?/g, '').trim();

            return cleanedCode;
        } catch (error) {
            console.error('Ошибка генерации кода:', error);
            throw error;
        }
    }
}