import HostPingInfoModel from "./hostpinginfomodel";
import net from 'net'
import dnsPromises from 'node:dns/promises'
import { LookupAddress } from 'node:dns'
import IPPingInfoController from "../ippinginfo/ippinginfocontroller";
import IPPingInfoModel from "../ippinginfo/ippinginfomodel";
import IPPing from "../ipping";

export interface HostPingInfoControllerOptions {
    /**
     * @see dns.lookup
     */
    family?: 0 | 4 | 6,
    all?: boolean,
}

export default class HostPingInfoController {
    static options: HostPingInfoControllerOptions = {
        family: 0,
        all: false
    }

    #m_model: HostPingInfoModel
    #m_options: HostPingInfoControllerOptions
    #m_controllers: IPPingInfoController[]

    constructor(model: HostPingInfoModel, options?: HostPingInfoControllerOptions) {
        this.#m_model = model
        this.#m_options = { ...HostPingInfoController.options, ...options }
    }

    start() {
        this.#m_controllers.map(c => c.start())
    }

    pause() {
        this.#m_controllers.map(c => c.pause())
    }

    resume() {
        this.#m_controllers.map(c => c.resume())
    }

    reset() {
        this.#m_controllers.map(c => c.reset())
    }

    /**
     * 
     * @TODO Make as a util function / class, separate the nslookup options out of `HostPingInfoController` class
     */
    async nslookup() {
        let hostname = this.#m_model.hostname
        let want: LookupAddress[] = []

        if (net.isIP(hostname)) {
            want.push({ address: hostname, family: net.isIPv4(hostname) ? 4 : 6 })
        } else {
            let options = {
                family: 0,
                all: true
            }

            let result = await dnsPromises.lookup(hostname, options) as LookupAddress[]
            console.log(`records for ${hostname}:`)
            console.log(result)
            let result4 = result.filter(r => r.family == 4)
            let result6 = result.filter(r => r.family == 6)

            let family = this.#m_options.family
            let all = this.#m_options.all
            if (all) {
                switch (family) {
                    case 0:
                        want = result
                        break
                    case 4:
                        want = result4
                        break
                    case 6:
                        want = result6
                        break
                }
            } else {
                switch (family) {
                    case 0:
                        if (result.length != 0)
                            want.push(result[0])
                        break
                    case 4:
                        if (result4.length != 0)
                            want.push(result4[0])
                        break
                    case 6:
                        if (result6.length != 0)
                            want.push(result6[0])
                        break
                }
            }
        }

        if (want.length == 0) {
            throw new Error(`no wants for ${hostname}`)
        }

        // console.log(`wants for ${hostname}`)
        // console.log(want)

        this.#m_model.models = want.map(r => new IPPingInfoModel(r.address, IPPing.options.interval))
        // console.log(`created ${this.#m_model.models.length} IPPingInfoModel s for ${hostname}`)

        this.#m_controllers = this.#m_model.models.map(m => new IPPingInfoController(m))
        console.log(`created ${this.#m_controllers.length} IPPingInfoController s for ${hostname}`)
    }
}