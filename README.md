# Imagicodium

This is a VS Code extension that uses the Mistral AI API to generate code based on comments.

## Functionality
- Generate code from comments.

## Obtaining an API Key
You can obtain the API key from the website: [https://console.mistral.ai/home](https://console.mistral.ai/home)

## Usage
- Run the command `Install the API key for Mistral AI` and add the obtained API key there.
- Add a comment in the code, for example: `// Mortgage payment calculator`.
- Invoke the command `Generate a code based on a comment` through the command palette (Ctrl+Shift+P).

## Installation from Marketplace
1. Install the extension via Marketplace.
2. Add the Mistral AI API key in the settings.

## Installation from Repository
- Run the command to build the extension:
  ```bash
  vsce package
  ```
- Install the extension via Extensions -> Install from VSIX

## Future Versions
- Training the neural network based on code in the project.
- Support for multiple languages
- "Code reviewer" mode
- Training the neural network based on existing code
- Selection of language models

## License
This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for details.