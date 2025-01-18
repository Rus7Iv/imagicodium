import * as vscode from 'vscode';
import { DeepseekClient } from './deepseekClient';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "transformerai" is now active!');

    const secretsPath = path.join(context.extensionPath, 'secrets.json');

    let deepseekApiKey: string | undefined;
    try {
        const secretsData = fs.readFileSync(secretsPath, 'utf-8');
        const secrets = JSON.parse(secretsData);
        deepseekApiKey = secrets.deepseekApiKey;
    } catch (error) {
        vscode.window.showErrorMessage('Failed to read secrets.json. Please check the file.');
        return;
    }

    if (!deepseekApiKey) {
        vscode.window.showErrorMessage('Deepseek API key is not set. Please set it in secrets.json.');
        return;
    }

    const deepseekClient = new DeepseekClient(deepseekApiKey);

    let disposable = vscode.commands.registerCommand('transformerai.generateCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const selection = editor.selection;
        const commentLine = document.lineAt(selection.start.line).text;

        const language = document.languageId;

        try {
            const generatedCode = await deepseekClient.generateCode(commentLine, language);
            editor.edit(editBuilder => {
                editBuilder.insert(selection.end, `\n${generatedCode}`);
            });
        } catch (error) {
            vscode.window.showErrorMessage('Failed to generate code. Please check the console for more details.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}