import React, { useEffect, useRef, useState } from 'react'
import "./Application.scss"

interface ConfigDialogConfig {
    inputHosts: InputHost[],
}

type Props = {
    config: ConfigDialogConfig
}

class InputHost {
    hostname?: string
    description?: string

    static toString(o: InputHost) {
        return o.hostname
            + (o.description == '' ? '' : (' "' + o.description + '"'))
    }
}

function processInputHosts(c: string) {
    let ret: InputHost[] = []
    for (let line of c.split('\n')) {
        let result = line.match(/\s*(\S+)(?:\s*"(.+?)")?.*/)
        if (result == null)
            continue
        let tmp = new InputHost

        tmp.hostname = result[1]
        tmp.description = result[2] == undefined ? '' : result[2]

        ret.push(tmp)
    }
    return ret
}

const PLACEHOLDER = `IP/Domain ["Description"]
Example:
8.8.8.8 "Google DNS"
google.com
2400:3200::1 "Ali DNS"`

const Application: React.FC<Props> = (props) => {
    const [hosts, setHosts] = useState(props?.config?.inputHosts.map(h => InputHost.toString(h)).join('\n'))
    const hostsRef = useRef<HTMLTextAreaElement>();

    function getConfig() {
        const config: ConfigDialogConfig = {
            inputHosts: processInputHosts(hosts),
        }
        return config
    }

    async function handleSubmitAndReset(ok: boolean) {
        const config = getConfig()
        await window.api.invoke('config-dialog:send-config', config)
        if (ok) {
            window.api.invoke('config-dialog:ok')
        }
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        handleSubmitAndReset(true)
    }

    const handleReset: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        handleSubmitAndReset(false)
    }

    return (
        <form onSubmit={handleSubmit} onReset={handleReset}>
            <label>Hosts</label>
            <textarea
                title="Hosts" placeholder={PLACEHOLDER}
                rows={10} value={hosts} ref={hostsRef}
                onChange={e => setHosts(e.target.value)}
            />
            <div id="footerButtons">
                <button type='submit'>OK</button>
                <button type='reset'>Cancel</button>
            </div>
        </form>
    )
}

export default Application

export { ConfigDialogConfig, InputHost };