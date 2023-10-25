import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const decorationType = vscode.window.createTextEditorDecorationType({
        after: {
            color: 'lightgrey',
        }
    });

    vscode.window.onDidChangeTextEditorSelection(async e => {
				const editor = vscode.window.activeTextEditor;
				if (!editor) {
						return;
				}

        if (e.textEditor.selection.isEmpty || editor.document.languageId !== 'ruby') {
            e.textEditor.setDecorations(decorationType, []);
            return;
        }

				const document = editor.document;
				const selection = editor.selection;
				const constantName = document.getText(selection);
				const codeBeforeSelection = document.getText(new vscode.Range(new vscode.Position(0, 0), selection.start));
				const context = parseContext(codeBeforeSelection);

				const line = e.textEditor.selection.start.line;
				const lineEnd = e.textEditor.document.lineAt(line).range.end;

				try {
					const origin = await findOriginOfConstant(constantName, context);
					const candidates = await findConstant(constantName);

					e.textEditor.setDecorations(decorationType, [{
							range: new vscode.Range(lineEnd, lineEnd),
							renderOptions: {
									after: {
										contentText: ` origin: ${origin}, candidates: ${candidates}`
									}
							}
					}]);
				} catch (error) {
						console.error(`Error finding constant: ${error}`);
				}
		}, null, context.subscriptions);
}

export function deactivate() {}

function parseContext(codeBeforeSelection: string): string {
	const moduleClassRegex = /(module|class)\s+([A-Z]\w*)(?:(?:::)([A-Z]\w*))*/g;
	const endRegex = /\bend\b/g;
	const moduleClassMatches = [...codeBeforeSelection.matchAll(moduleClassRegex)];
	const endMatches = [...codeBeforeSelection.matchAll(endRegex)];
	
	const nestingLevel = moduleClassMatches.length - endMatches.length;
	if (nestingLevel <= 0) {
		return "";
	}
	
	const relevantContexts = moduleClassMatches.slice(-nestingLevel);
	const contextNames = relevantContexts.map(match => {
		return match[0].replace(/module|class/g, '').trim();
	});

	return contextNames.join('::');
}

function findOriginOfConstant(constantName: string, context: string): Promise<string> {
	const currentDirectory = process.cwd();
	// アクティブなワークスペースのルートディレクトリを取得
	const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;

	if (!workspaceFolder) {
		return Promise.reject('No active workspace found.');
	}

	process.chdir(workspaceFolder);

	return new Promise((resolve, reject) => {
			const isRailsApp = fs.existsSync('config/environment.rb');
			const command = isRailsApp
					? `bundle exec rails runner "require 'constant_vision'; puts ConstantVision.find_origin_of_constant('${constantName}', '${context}')"` 
					: `ruby -e "require 'constant_vision'; puts ConstantVision.find_origin_of_constant('${constantName}', '${context}')"`;

			exec(command, (error, stdout, stderr) => {
					if (error) {
							console.error(`exec error: ${error}`);
							reject(error);
							return;
					}
					const result = stdout.trim();
					resolve(result);
			});
	});
}

function findConstant(constantName: string): Promise<string> {
	const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;

	if (!workspaceFolder) {
		return Promise.reject('No active workspace found.');
	}

	const isRailsApp = fs.existsSync('config/environment.rb');
	const command = isRailsApp
			? `bundle exec rails runner "require 'constant_vision'; puts ConstantVision.find_constant('${constantName}')"` 
			: `ruby -e "require 'constant_vision'; puts ConstantVision.find_constant('${constantName}')"`;

	return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
					if (error) {
							console.error(`exec error: ${error}`);
							reject(error);
							return;
					}
					const result = stdout.trim();
					resolve(result);
			});
	});
}
