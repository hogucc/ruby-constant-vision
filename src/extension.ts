import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.onDidChangeTextEditorSelection(e => {
		const editor = e.textEditor;
		const document = editor.document;
		const selection = editor.selection;
		const word = document.getText(selection);

		if (!selection.isEmpty) {
			vscode.window.showInformationMessage('Selected word: ' + word);
		}
	});
}

export function deactivate() {}
