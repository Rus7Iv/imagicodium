import * as vscode from 'vscode';
import { MistralClient } from './mistralClient';

export function activate(context: vscode.ExtensionContext) {
    let mistralClient: MistralClient | null = null;

    const initializeClient = () => {
        const config = vscode.workspace.getConfiguration('imagicodium');
        const apiKey = config.get<string>('apiKey');
        const proxyConfig = config.get<{ host: string; port: number; auth?: { username: string; password: string } }>('proxy');

        if (apiKey) {
            mistralClient = new MistralClient(apiKey, proxyConfig);
        } else {
            mistralClient = null;
        }
    };

    initializeClient();

    const generateCodeDisposable = vscode.commands.registerCommand('imagicodium.generateCode', async () => {
        if (!mistralClient) {
            vscode.window.showErrorMessage('The API key is not set. Please use the "Install API Key for Mistral AI" command.');
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {return;}

        const document = editor.document;
        const selection = editor.selection;
        const commentLine = document.lineAt(selection.start.line).text;
        const language = document.languageId;

        try {
            const generatedCode = await mistralClient.generateCode(commentLine, language);
            editor.edit(editBuilder => {
                editBuilder.insert(selection.end, `\n${generatedCode}`);
            });
        } catch (error) {
            vscode.window.showErrorMessage('Code generation failed. Check console for details.');
        }
    });

    const setApiKeyDisposable = vscode.commands.registerCommand('imagicodium.setApiKey', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your Mistral API key',
            placeHolder: 'sk-...',
            password: true
        });

        if (apiKey) {
            const config = vscode.workspace.getConfiguration('imagicodium');
            await config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);

            initializeClient();
            vscode.window.showInformationMessage('Mistral API key saved successfully!');
        }
    });

    const setProxyDisposable = vscode.commands.registerCommand('imagicodium.setProxy', async () => {
        const host = await vscode.window.showInputBox({ prompt: 'Enter proxy host (e.g. 127.0.0.1)' });
        const port = await vscode.window.showInputBox({ prompt: 'Enter proxy port (e.g. 8080)' });
        const username = await vscode.window.showInputBox({ prompt: 'Enter username (if required)' });
        const password = await vscode.window.showInputBox({ prompt: 'Enter password (if required)', password: true });

        if (!host || !port) {
            vscode.window.showErrorMessage('Proxy host and port are required.');
            return;
        }

        const proxy = {
            host,
            port: parseInt(port, 10),
            auth: username && password ? { username, password } : undefined
        };

        const config = vscode.workspace.getConfiguration('imagicodium');
        await config.update('proxy', proxy, vscode.ConfigurationTarget.Global);

        initializeClient();
        vscode.window.showInformationMessage('Proxy configured successfully!');
    });

    const disableProxyDisposable = vscode.commands.registerCommand('imagicodium.disableProxy', async () => {
        const config = vscode.workspace.getConfiguration('imagicodium');
        await config.update('proxy', undefined, vscode.ConfigurationTarget.Global);

        initializeClient();
        vscode.window.showInformationMessage('Proxy disabled.');
    });

    context.subscriptions.push(
        generateCodeDisposable,
        setApiKeyDisposable,
        setProxyDisposable,
        disableProxyDisposable
    );
}

export function deactivate() {}
