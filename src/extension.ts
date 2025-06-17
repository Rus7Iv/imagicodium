import * as vscode from 'vscode';
import { MistralClient } from './mistralClient';
import { loadLocalization, t } from './i18n';

export function activate(context: vscode.ExtensionContext) {
    loadLocalization(context);

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
            vscode.window.showErrorMessage(t('apiKeyNotSet'));
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
            vscode.window.showErrorMessage(t('codeGenerationFailed'));
        }
    });

    const setApiKeyDisposable = vscode.commands.registerCommand('imagicodium.setApiKey', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: t('enterApiKeyPrompt'),
            placeHolder: 'sk-...',
            password: true
        });

        if (apiKey) {
            const config = vscode.workspace.getConfiguration('imagicodium');
            await config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);

            initializeClient();
            vscode.window.showInformationMessage(t('apiKeySaved'));
        }
    });

    const setProxyDisposable = vscode.commands.registerCommand('imagicodium.setProxy', async () => {
        const host = await vscode.window.showInputBox({ prompt: t('proxyHostPrompt') });
        const port = await vscode.window.showInputBox({ prompt: t('proxyPortPrompt') });
        const username = await vscode.window.showInputBox({ prompt: t('proxyUserPrompt') });
        const password = await vscode.window.showInputBox({ prompt: t('proxyPassPrompt'), password: true });

        if (!host || !port) {
            vscode.window.showErrorMessage(t('proxyHostPortRequired'));
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
        vscode.window.showInformationMessage(t('proxyConfigured'));
    });

    const disableProxyDisposable = vscode.commands.registerCommand('imagicodium.disableProxy', async () => {
        const config = vscode.workspace.getConfiguration('imagicodium');
        await config.update('proxy', undefined, vscode.ConfigurationTarget.Global);

        initializeClient();
        vscode.window.showInformationMessage(t('proxyDisabled'));
    });

    const contextualizedDisposable = vscode.commands.registerCommand('imagicodium.contextualized', async () => {
        const files = await vscode.window.showOpenDialog({
            canSelectMany: true,
            openLabel: t('selectContextFiles'),
            filters: {
                'Popular Code Files': ['ts', 'js', 'py', 'java', 'cpp', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt'],
                'Configuration Files': ['json', 'yaml', 'yml', 'xml', 'toml', 'env'],
                'Web Files': ['html', 'css', 'scss', 'less', 'vue', 'jsx', 'tsx'],
                'Documentation': ['md', 'txt', 'rst'],
                'All Files': ['*']
            }
        });

        if (!files || files.length === 0) {
            vscode.window.showInformationMessage(t('noFilesSelected'));
            return;
        }

        try {
            const fileContents = await Promise.all(
                files.map(uri => vscode.workspace.fs.readFile(uri).then(buffer => buffer.toString()))
            );

            const contextCode = fileContents.join('\n\n// -------- Next File --------\n\n');

            if (mistralClient) {
                mistralClient.setContext(contextCode);
                vscode.window.showInformationMessage(t('contextLoaded'));
            } else {
                vscode.window.showErrorMessage(t('apiKeyNotSet'));
            }
        } catch (error) {
            vscode.window.showErrorMessage(t('contextLoadFailed'));
            console.error('Ошибка загрузки контекста:', error);
        }
    });

    context.subscriptions.push(
        generateCodeDisposable,
        setApiKeyDisposable,
        setProxyDisposable,
        disableProxyDisposable,
        contextualizedDisposable
    );
}

export function deactivate() {}
