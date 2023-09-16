import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
	// Register the server for plain text documents
	documentSelector: [{ scheme: 'file', language: 'yaml' }],
	synchronize: {
	    // Notify the server about file changes to '.clientrc files contained in the workspace
	    fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
	}
    };

    // Create the language client and start the client.
    client = new LanguageClient(
	'cfn-lsp-extra',
	'cfn-lsp-extra Language Server',
	{ command: "cfn-lsp-extra", args: ["-vv"] },
	clientOptions
    );

    // Start the client. This will also launch the server
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
	return undefined;
    }
    return client.stop();
}

function isCloudFormationTemplate(yamlContent: string): boolean {
    const cfPattern = /AWSTemplateFormatVersion|/;
    return cfPattern.test(yamlContent);
}
