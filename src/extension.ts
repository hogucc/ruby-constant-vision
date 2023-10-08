import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('ruby-constant-vision.helloWorld', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const word = document.getText(selection);

			vscode.window.showInformationMessage('Selected word: ' + word);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
