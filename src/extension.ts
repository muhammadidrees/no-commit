// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

let hook = `#!/bin/sh

PATTERN="^\\+.*(NOCOMIT).*"

if git diff --cached | grep -Eq "^\\+.*(NOCOMIT).*"; then
	echo "Commit rejected kindly remove 'NOCOMIT' before commiting"
	exit 1
fi
`;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "no-commit" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('no-commit.initialize', () => {

		let path = vscode.workspace.workspaceFolders![0].uri.path.substring(1);
		
		console.log(path);

		// checks if git is initialized
		if (fs.existsSync(path + "/.git")) {


			fs.appendFile(path +'/.git/hooks/pre-commit', hook, function (err) {
				if (err) {
					vscode.window.showWarningMessage(err.message);
				} else {
					vscode.window.showInformationMessage('No commit initialized Successfully!');
				}
			});
		  } else {
			  vscode.window.showWarningMessage('Git not initialized!');
		  }
		  
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
