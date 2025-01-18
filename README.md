# Transformer AI

Это расширение для VS Code, которое использует OpenAI API для генерации кода на основе комментариев.

## Функциональность
- Обучение нейросети на основе кода в проекте.
- Генерация кода по комментариям.

## Установка из маркета
1. Установите расширение через Marketplace.
2. Настройте API ключ OpenAI в настройках.

## Установка из репозитория
- Создайте в корне проекта `secrets.json`
- Добавьте в `secrets.json` структуру типа: 
```json
{
    "openAIApiKey": "<YOUR_API_KEY>"
}
```
- запустите команду:
```bash
vsce package
```
- Установите расширение через Extensions -> Install from VSIX

## Использование
- Добавьте комментарий в код, например: `// Калькулятор платежей по ипотеке`.
- Вызовите команду `Generate Code from Comment` через командную палитру (Ctrl+Shift+P).