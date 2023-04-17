import React from "react"
import { createRoot } from 'react-dom/client'
import Application, { ConfigDialogConfig } from "./components/Application"
(async () => {
    const config = await window.api.invoke('store:get', 'config') as ConfigDialogConfig
    const app = (
        <Application config={config}></Application>
    )

    createRoot(document.getElementById('app')).render(app);
})()