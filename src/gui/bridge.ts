import { IpcRenderer, contextBridge, ipcMain, ipcRenderer } from 'electron'

const api = {
    invoke: async (channel: string, ...args: any[]) => {
        console.log(`invoking channel ${channel}`)
        try {
            return await ipcRenderer.invoke(channel, ...args)
        } catch (e) {
            return console.log(e)
        }
    },
    handle: (channel: string, listener: Parameters<typeof ipcRenderer.on>[1]) => {
        ipcRenderer.on(channel, listener);
    },
}

export type apiType = typeof api

export default api;

declare global {
    interface Window {
        api: apiType
    }
};