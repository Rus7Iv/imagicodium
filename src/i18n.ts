import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

type Messages = Record<string, string>;

let messages: Messages = {};

export function loadLocalization(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('imagicodium');
    let lang = vscode.env.language;

    if (!lang || (lang !== 'en' && lang !== 'ru')) {
        lang = 'en';
    }

    const localeFile = path.join(context.extensionPath, 'i18n', `${lang}.json`);
    try {
        const content = fs.readFileSync(localeFile, 'utf-8');
        messages = JSON.parse(content);
    } catch (e) {
        console.error('Failed to load locale file', localeFile, e);
        try {
            const fallbackContent = fs.readFileSync(path.join(context.extensionPath, 'i18n', 'en.json'), 'utf-8');
            messages = JSON.parse(fallbackContent);
        } catch (fallbackError) {
            console.error('Failed to load fallback locale file', fallbackError);
            messages = {};
        }
    }
}

export function t(key: string): string {
    return messages[key] || key;
}
