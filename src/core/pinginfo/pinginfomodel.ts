import HostPingInfoModel from "../hostpinginfo/hostpinginfomodel";
import PingInfo from "./pinginfo";
import PingInfo_Host from "./pinginfo_host";
import PingInfo_IP from "./pinginfo_ip";
import { InputHost } from "@configdialog";

export default class PingInfoModel {
    #m_data: PingInfo
    #m_models: HostPingInfoModel[]
    #m_inputHosts: InputHost[]
    constructor(inputHosts: InputHost[]) {
        this.#m_inputHosts = inputHosts
        this.#m_models = this.#m_inputHosts.map(inputHost => new HostPingInfoModel(inputHost.hostname, inputHost.description))
    }

    set models(data: HostPingInfoModel[]) {
        this.#m_models = data
    }

    get models() {
        return this.#m_models
    }

    get data() {
        let hostpinginfos = this.#m_models.map(m => m.data)
        let ip_infos: PingInfo_IP[] = []
        let host_info: PingInfo_Host[] = []
        for (let { hostname, description, ipPingInfos, summary } of hostpinginfos) {
            for (let ipinfo of ipPingInfos) {
                ip_infos.push({ ...{ hostname, description }, ...ipinfo })
            }
            host_info.push({ hostname, ...summary })
        }
        this.#m_data = { ip_infos, host_info }
        return structuredClone(this.#m_data)
    }

    // get hostnames() {
    //     return this.#m_hostnames
    // }
}