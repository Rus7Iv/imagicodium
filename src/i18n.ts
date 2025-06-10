import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

type Messages = Record<string, string>;

let messages: Messages = {};

const SUPPORTED_LANGUAGES = new Set([
    'en',
    'fr',
    'de',
    'es',
    'zh',
    'ar',
    'pt',
    'ja',
    'hi',
    'ru' 
]);

export function loadLocalization(context: vscode.ExtensionContext) {
    let lang = getPreferredLanguage();

    const localeFile = path.join(context.extensionPath, 'i18n', `${lang}.json`);
    try {
        const content = fs.readFileSync(localeFile, 'utf-8');
        messages = JSON.parse(content);
    } catch (e) {
        console.error('Failed to load locale file', localeFile, e);
        try {
            const fallbackContent = fs.readFileSync(
                path.join(context.extensionPath, 'i18n', 'en.json'),
                'utf-8'
            );
            messages = JSON.parse(fallbackContent);
        } catch (fallbackError) {
            console.error('Failed to load fallback locale file', fallbackError);
            messages = {};
        }
    }
}

function getPreferredLanguage(): string {
    const config = vscode.workspace.getConfiguration('imagicodium');
    const userPreferredLang = config.get<string>('preferredLanguage');

    if (userPreferredLang && SUPPORTED_LANGUAGES.has(userPreferredLang)) {
        return userPreferredLang;
    }

    const envLang = vscode.env.language;
    const baseLang = envLang ? envLang.split('-')[0].toLowerCase() : 'en';

    if (SUPPORTED_LANGUAGES.has(baseLang)) {
        return baseLang;
    }

    return 'en';
}

export function t(key: string): string {
    return messages[key] || key;
}
