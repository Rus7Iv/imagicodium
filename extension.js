// Импортируем необходимые модули
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');

// Активация расширения
function activate(context) {
    // Регистрируем команду для обучения модели
    let disposable = vscode.commands.registerCommand('extension.trainModel', function () {
        // Получаем путь к открытому в данный момент проекту
        const workspacePath = vscode.workspace.rootPath;

        // Если проект не открыт, выводим сообщение об ошибке
        if (!workspacePath) {
            vscode.window.showErrorMessage('Пожалуйста, откройте проект перед обучением модели.');
            return;
        }

        // Получаем все файлы в проекте
        const files = getAllFiles(workspacePath);

        // Объединяем содержимое всех файлов в один текст
        const allCode = files.map(file => fs.readFileSync(file, 'utf8')).join('\n');

        // Запускаем скрипт на Python для обучения модели
        runPythonScript(allCode, workspacePath);
    });

    context.subscriptions.push(disposable);
}

// Функция для получения всех файлов в проекте
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function(file) {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
}

// Функция для запуска скрипта на Python для обучения модели
function runPythonScript(code, workspacePath) {
    const options = {
        mode: 'text',
        pythonPath: 'python', // Путь к Python-интерпретатору
        scriptPath: path.join(workspacePath, 'model_training.py'), // Путь к скрипту на Python
        args: [code]
    };

    PythonShell.run('model_training.py', options, (err, results) => {
        if (err) {
            vscode.window.showErrorMessage(`Ошибка при обучении модели: ${err}`);
        } else {
            vscode.window.showInformationMessage('Модель успешно обучена!');
        }
    });
}

// Экспортируем функцию активации расширения
exports.activate = activate;
