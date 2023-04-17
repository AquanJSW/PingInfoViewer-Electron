import { BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain } from "electron";
import { ConfigDialog } from '../configdialog';
import { ConfigDialogConfig } from "../configdialog/types";
import Store from 'electron-store'
import MainWindow from "../mainwindow";
import { PingInfoController, PingInfoModel, PingInfo } from "@core";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

declare const CONFIG_DIALOG_WEBPACK_ENTRY: string


var store = new Store

var mainWindow: BrowserWindow
var initData: PingInfo

var configDialog: ConfigDialog
var model: PingInfoModel
var controller: PingInfoController
var timeout: NodeJS.Timeout
const UPDATE_INTERVAL = 1000;

const createWindow = (): void => {

    console.log(`loading config from ${store.path}`)

    registerMainIpc()

    // Create the browser window.
    mainWindow = new MainWindow()
    Menu.setApplicationMenu(buildMainWindowMenu())

    // and load the index.html of the app.
    openConfigDialog()

    // configDialog.on('closed', () => console.log('config dialog closed'))

};

function registerMainIpc() {
    ipcMain.handle('config-dialog:send-config', (event: Electron.IpcMainEvent, value: ConfigDialogConfig) => {
        store.set('config', value)
        console.log(`storing config:`)
        console.log(store.get('config'))
        configDialog.hide()
        mainWindow.focus()
    });
    ipcMain.handle('config-dialog:ok', async (event) => {
        configDialog.hide();
        // render mainWindow
        try {
            await initCore()
            mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        } catch (e) {
            console.error(e)
        }
    });
    ipcMain.handle('mainwin:request-init-data', (event) => {
        return initData
    });
    ipcMain.handle('store:get', (event, key) => {
        return store.get(key);
    });
    ipcMain.handle('store:set', (event, key, value) => {
        store.set(key, value)
    });
}

function startRetrievingData() {
    try {
        clearInterval(timeout)
    } catch { }
    timeout = setInterval(() => {
        mainWindow.webContents.send('mainwin:get-data', model.data)
    }, UPDATE_INTERVAL)
}

async function initCore() {
    let config = store.get('config') as ConfigDialogConfig
    model = new PingInfoModel(config.inputHosts);
    controller = new PingInfoController(model);
    try {
        await controller.init()
        console.log('start pinging...')
        initData = model.data
        startRetrievingData()
        controller.start()
    } catch (e) {
        throw e
    }
}

function openConfigDialog() {
    configDialog = new ConfigDialog(mainWindow)
    configDialog.loadURL(CONFIG_DIALOG_WEBPACK_ENTRY).then(() => {
        // console.log('ConfigDialog loaded')
        // configDialog.webContents.send('config-dialog:load-config', store.get('config'))
    })

    // build menu
    const template: MenuItemConstructorOptions[] = [
        {
            label: 'View',
            submenu: [
                { role: 'toggleDevTools' }
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(template);
    configDialog.setMenu(menu);

    // hide instead of close
    configDialog.on('close', e => {
        e.preventDefault()
        configDialog.hide()
    })
}

function buildMainWindowMenu() {
    const template: MenuItemConstructorOptions[] = [
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Config Dialog',
                    click: async () => configDialog.show(),
                    accelerator: 'Ctrl+O'
                },
                { type: "separator" },
                {
                    label: 'Pause',
                    click: async () => { controller.pause(); clearInterval(timeout); Menu.getApplicationMenu().getMenuItemById('resume').enabled = true }
                }, {
                    id: 'resume',
                    label: 'Resume',
                    click: async (menuItem, browserWindow, event) => { controller.resume(); startRetrievingData(); Menu.getApplicationMenu().getMenuItemById('resume').enabled = false },
                    enabled: false
                },
                { type: "separator" },
                { role: 'quit' }
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'toggleDevTools' },
            ]
        },
    ]
    const menu = Menu.buildFromTemplate(template)
    return menu
}

export default createWindow
