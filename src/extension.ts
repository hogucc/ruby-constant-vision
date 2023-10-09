import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const decorationType = vscode.window.createTextEditorDecorationType({
        after: {
            color: 'lightgrey',
        }
    });

    vscode.window.onDidChangeTextEditorSelection(e => {
        if (e.textEditor.selection.isEmpty) {
            e.textEditor.setDecorations(decorationType, []);
            return;
        }

        const selectedText = e.textEditor.document.getText(e.textEditor.selection);

        const line = e.textEditor.selection.start.line;
        const lineEnd = e.textEditor.document.lineAt(line).range.end;

        e.textEditor.setDecorations(decorationType, [{
            range: new vscode.Range(lineEnd, lineEnd),
            renderOptions: {
                after: {
                    contentText: ` Selected: ${selectedText}`
                }
            }
        }]);
    }, null, context.subscriptions);
}

export function deactivate() {}
