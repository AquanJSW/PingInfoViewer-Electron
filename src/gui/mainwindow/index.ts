import { BrowserWindow } from "electron";

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class MainWindow extends BrowserWindow {
    constructor() {
        super({
            height: 600,
            width: 800,
            webPreferences: {
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            },
        })
    }
}

export default MainWindow;