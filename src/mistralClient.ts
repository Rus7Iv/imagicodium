import axios, { AxiosProxyConfig } from 'axios';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export class MistralClient {
    private apiKey: string;
    private proxy?: AxiosProxyConfig;

    constructor(apiKey: string, proxy?: AxiosProxyConfig) {
        this.apiKey = apiKey;
        this.proxy = proxy;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        try {
            const response = await axios.post(
                MISTRAL_API_URL,
                {
                    model: 'mistral-large-latest',
                    messages: [
                        {
                            role: 'user',
                            content: `Write code in ${language} for the following description. Do not include comments or explanations. Just the code:\n${prompt}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    proxy: this.proxy,
                }
            );

            const rawCode = response.data.choices[0].message.content;
            const cleanedCode = rawCode.replace(/```[^\n]*\n?/g, '').trim();

            return cleanedCode;
        } catch (error) {
            console.error('Ошибка генерации кода через Mistral:', error);
            throw error;
        }
    }
}
