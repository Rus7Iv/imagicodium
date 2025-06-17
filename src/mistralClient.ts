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
                            content: `You are a professional developer. Your task is to generate correct, concise, and readable code, strictly following the given task. Do not add any extra comments or explanations. Just output the ready code fragment.
                                Programming language: ${language}
                                Coding style: modern, using ${language}-specific best practices
                                Do not include comments or explanations. Just the code.
                                Generate code for the following description:
                                ${prompt}`
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
