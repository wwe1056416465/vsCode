"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const vscode = require("vscode");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const nullReporter = new class NullTelemetryReporter {
    sendTelemetryEvent() { }
    dispose() { }
};
class ExtensionReporter {
    constructor(packageInfo) {
        this._reporter = new vscode_extension_telemetry_1.default(packageInfo.name, packageInfo.version, packageInfo.aiKey);
    }
    sendTelemetryEvent(eventName, properties) {
        this._reporter.sendTelemetryEvent(eventName, properties);
    }
    dispose() {
        this._reporter.dispose();
    }
}
function loadDefaultTelemetryReporter() {
    const packageInfo = getPackageInfo();
    return packageInfo ? new ExtensionReporter(packageInfo) : nullReporter;
}
exports.loadDefaultTelemetryReporter = loadDefaultTelemetryReporter;
function getPackageInfo() {
    const extention = vscode.extensions.getExtension('Microsoft.vscode-markdown');
    if (extention && extention.packageJSON) {
        return {
            name: extention.packageJSON.name,
            version: extention.packageJSON.version,
            aiKey: extention.packageJSON.aiKey
        };
    }
    return null;
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0f080e5267e829de46638128001aeb7ca2d6d50e/extensions\markdown-language-features\out/telemetryReporter.js.map
