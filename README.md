# Transformer AI

Это расширение для VS Code, которое использует AI21 Studio API для генерации кода на основе комментариев.

## Функциональность
- Обучение нейросети на основе кода в проекте.
- Генерация кода по комментариям.

## Получение Api-key
Получить ключ api можно на сайте https://studio.ai21.com/v2/account/api-key

## Установка из маркета
1. Установите расширение через Marketplace.
2. Добавьте API ключ AI21 Studio в настройках.

## Установка из репозитория
- Создайте в корне проекта `secrets.json`
- Добавьте в `secrets.json` структуру типа: 
```json
{
    "ai21ApiKey": "<YOUR_API_KEY>"
}
```
- запустите команду:
```bash
vsce package
```
- Установите расширение через Extensions -> Install from VSIX

## Использование
- Добавьте комментарий в код, например: `// Калькулятор платежей по ипотеке`.
- Вызовите команду `Сгенерировать код по комментарию` через командную палитру (Ctrl+Shift+P).