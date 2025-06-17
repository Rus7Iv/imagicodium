import axios, { AxiosProxyConfig } from 'axios';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export class MistralClient {
    private apiKey: string;
    private proxy?: AxiosProxyConfig;
    private context: string = '';

    constructor(apiKey: string, proxy?: AxiosProxyConfig) {
        this.apiKey = apiKey;
        this.proxy = proxy;
    }

    public setContext(contextCode: string) {
        this.context = contextCode;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        try {
            const response = await axios.post(
                MISTRAL_API_URL,
                {
                    model: 'mistral-large-latest',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a professional developer assistant. You have access to the user's code context. Use it for relevant code generation.
                                    Your task is to generate correct, concise, and readable code, strictly following the given task. Do not add any extra comments or explanations. Just output the ready code fragment.`
                        },
                        ...(this.context
                            ? [
                              {
                                  role: 'user',
                                  content: `Here is my code context:\n${this.context}
                                      Coding style: modern, using ${language}-specific best practices
                                      Do not include comments or explanations. Just the code.
                                      Generate code for the following description:
                                      ${prompt}`
                              }
                            ]
                            : []),
                        {
                            role: 'user',
                            content: `Programming language: ${language}
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
