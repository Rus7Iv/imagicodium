import * as vscode from 'vscode';
import { Ai21Client } from './ai21Client';

export function activate(context: vscode.ExtensionContext) {
    let ai21Client: Ai21Client | null = null;

    const initializeClient = () => {
        const config = vscode.workspace.getConfiguration('transformerAI');
        const ai21ApiKey = config.get<string>('apiKey');
        const proxyConfig = config.get<{ host: string; port: number; auth?: { username: string; password: string } }>('proxy');

        if (ai21ApiKey) {
            ai21Client = new Ai21Client(ai21ApiKey, proxyConfig);
        } else {
            ai21Client = null;
        }
    };

    initializeClient();

    let generateCodeDisposable = vscode.commands.registerCommand('transformerai.generateCode', async () => {
        if (!ai21Client) {
            vscode.window.showErrorMessage('Ключ API не установлен. Пожалуйста, используйте команду "Установить ключ API для AI21 Studio"');
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const selection = editor.selection;
        const commentLine = document.lineAt(selection.start.line).text;

        const language = document.languageId;

        try {
            const generatedCode = await ai21Client.generateCode(commentLine, language);
            editor.edit(editBuilder => {
                editBuilder.insert(selection.end, `\n${generatedCode}`);
            });
        } catch (error) {
            vscode.window.showErrorMessage('Ошибка генерации кода. Пожалуйста, проверьте консоль');
        }
    });

    // Команда для установки ключа API
    let setApiKeyDisposable = vscode.commands.registerCommand('transformerai.setApiKey', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Введите ключ API для AI21 Studio',
            placeHolder: 'API Key',
            password: true
        });

        if (apiKey) {
            const config = vscode.workspace.getConfiguration('transformerAI');
            await config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);

            initializeClient();
            vscode.window.showInformationMessage('Ключ API успешно сохранён!');
        }
    });

    let setProxyDisposable = vscode.commands.registerCommand('transformerai.setProxy', async () => {
        const host = await vscode.window.showInputBox({ prompt: 'Введите адрес прокси (например, 127.0.0.1)' });
        const port = await vscode.window.showInputBox({ prompt: 'Введите порт прокси (например, 8080)' });
        const username = await vscode.window.showInputBox({ prompt: 'Введите логин (если требуется)' });
        const password = await vscode.window.showInputBox({ prompt: 'Введите пароль (если требуется)', password: true });

        if (!host || !port) {
            vscode.window.showErrorMessage('Адрес и порт прокси обязательны.');
            return;
        }

        const proxy = {
            host: host,
            port: parseInt(port, 10),
            auth: username && password ? { username, password } : undefined
        };

        const config = vscode.workspace.getConfiguration('transformerAI');
        await config.update('proxy', proxy, vscode.ConfigurationTarget.Global);

        initializeClient();
        vscode.window.showInformationMessage('Прокси успешно настроен.');
    });

    let disableProxyDisposable = vscode.commands.registerCommand('transformerai.disableProxy', async () => {
        const config = vscode.workspace.getConfiguration('transformerAI');
        await config.update('proxy', undefined, vscode.ConfigurationTarget.Global);

        initializeClient();
        vscode.window.showInformationMessage('Прокси отключен.');
    });

    context.subscriptions.push(
        generateCodeDisposable,
        setApiKeyDisposable,
        setProxyDisposable,
        disableProxyDisposable
    );
}

export function deactivate() {}