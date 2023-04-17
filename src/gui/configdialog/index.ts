import { app, BrowserWindow, Menu } from 'electron'
import path = require('path')
import { ConfigDialogConfig } from './types'
import Store from 'electron-store'

declare const CONFIG_DIALOG_PRELOAD_WEBPACK_ENTRY: string
declare const CONFIG_DIALOG_WEBPACK_ENTRY: string

export class ConfigDialog extends BrowserWindow {
    constructor(parent: BrowserWindow) {
        super({
            parent: parent,
            modal: true,
            autoHideMenuBar: true,
            minWidth: 350,
            width: 350,
            webPreferences: {
                preload: CONFIG_DIALOG_PRELOAD_WEBPACK_ENTRY,
                contextIsolation: true
            },

        })
    }
}

export default ConfigDialog;

import { InputHost } from './components/Application'

export { InputHost }
