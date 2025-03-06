import * as vscode from 'vscode';
import { Ai21Client } from './ai21Client';

export function activate(context: vscode.ExtensionContext) {
    let ai21Client: Ai21Client | null = null;

    const initializeClient = () => {
        const config = vscode.workspace.getConfiguration('imagicodium');
        const ai21ApiKey = config.get<string>('apiKey');
        const proxyConfig = config.get<{ host: string; port: number; auth?: { username: string; password: string } }>('proxy');

        if (ai21ApiKey) {
            ai21Client = new Ai21Client(ai21ApiKey, proxyConfig);
        } else {
            ai21Client = null;
        }
    };

    initializeClient();

    let generateCodeDisposable = vscode.commands.registerCommand('imagicodium.generateCode', async () => {
        if (!ai21Client) {
            vscode.window.showErrorMessage('The API key is not installed. Please use the "Install API Key for AI21 Studio" command');
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
            vscode.window.showErrorMessage('Code generation error. Please check the console');
        }
    });

    let setApiKeyDisposable = vscode.commands.registerCommand('imagicodium.setApiKey', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter the API key for AI21 Studio',
            placeHolder: 'API Key',
            password: true
        });

        if (apiKey) {
            const config = vscode.workspace.getConfiguration('imagicodium');
            await config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);

            initializeClient();
            vscode.window.showInformationMessage('The API key has been saved successfully!');
        }
    });

    let setProxyDisposable = vscode.commands.registerCommand('imagicodium.setProxy', async () => {
        const host = await vscode.window.showInputBox({ prompt: 'Enter the proxy address (for example, 127.0.0.1)' });
        const port = await vscode.window.showInputBox({ prompt: 'Enter the proxy port (for example, 8080)' });
        const username = await vscode.window.showInputBox({ prompt: 'Enter your username (if required)' });
        const password = await vscode.window.showInputBox({ prompt: 'Enter the password (if required)', password: true });

        if (!host || !port) {
            vscode.window.showErrorMessage('The proxy address and port are required');
            return;
        }

        const proxy = {
            host: host,
            port: parseInt(port, 10),
            auth: username && password ? { username, password } : undefined
        };

        const config = vscode.workspace.getConfiguration('imagicodium');
        await config.update('proxy', proxy, vscode.ConfigurationTarget.Global);

        initializeClient();
        vscode.window.showInformationMessage('The proxy has been successfully configured!');
    });

    let disableProxyDisposable = vscode.commands.registerCommand('imagicodium.disableProxy', async () => {
        const config = vscode.workspace.getConfiguration('imagicodium');
        await config.update('proxy', undefined, vscode.ConfigurationTarget.Global);

        initializeClient();
        vscode.window.showInformationMessage('The proxy is disabled');
    });

    context.subscriptions.push(
        generateCodeDisposable,
        setApiKeyDisposable,
        setProxyDisposable,
        disableProxyDisposable
    );
}

export function deactivate() {}