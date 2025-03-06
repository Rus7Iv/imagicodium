# Imagicodium

This is a VS Code extension that uses the AI21 Studio API to generate code based on comments.

## Functionality
- Generate code from comments.

## Obtaining an API Key
You can obtain the API key from the website: [https://studio.ai21.com/v2/account/api-key](https://studio.ai21.com/v2/account/api-key)

## Usage
- Run the command `Set API Key for AI21 Studio` and add the obtained API key there.
- Add a comment in the code, for example: `// Mortgage payment calculator`.
- Invoke the command `Generate a code based on a comment` through the command palette (Ctrl+Shift+P).

## Installation from Marketplace
1. Install the extension via Marketplace.
2. Add the AI21 Studio API key in the settings.

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