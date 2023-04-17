import React from "react"
import { createRoot } from 'react-dom/client'
import Application from "./components/Application"

(async () => {
    let data = await window.api.invoke('mainwin:request-init-data');
    console.log('got init data in renderer')
    const app = (
        <Application data={data}></Application>
    )
    createRoot(document.getElementById('app')).render(app);
})()
