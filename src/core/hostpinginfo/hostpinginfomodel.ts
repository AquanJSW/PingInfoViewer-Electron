import HostPingInfo from './hostpinginfo';
import IPPingInfoModel from '../ippinginfo/ippinginfomodel';
import { mean, sum } from '@utils';


export default class HostPingInfoModel {
    // As a container of output
    #m_data: HostPingInfo = {}
    // Generate the main data in `m_data`
    models: IPPingInfoModel[]
    #m_hostname: string
    #m_description: string
    constructor(hostname: string, description: string) {
        this.#m_hostname = hostname
        this.#m_description = description
    }

    // set models(data: IPPingInfoModel[]) {
    //     this.#m_models = data
    // }

    // get models() {
    //     return this.#m_models
    // }

    get data() {
        this.#m_data.hostname = this.#m_hostname
        this.#m_data.description = this.#m_description
        this.#m_data.ipPingInfos = this.models.map(m => m.data)
        this.#set_summary()
        return structuredClone(this.#m_data)
    }

    get hostname() {
        return this.#m_hostname
    }

    #set_summary() {
        const infos = this.#m_data.ipPingInfos
        let succeed_count = sum(infos.map(info => info.succeed_count))
        let failed_count = sum(infos.map(info => info.failed_count))
        let max_consecutive_failed_count = Math.max(...infos.map(info => info.max_consecutive_failed_count))
        let max_consecutive_failed_ms = Math.max(...infos.map(info => info.max_consecutive_failed_ms))
        let total_sent_count = sum(infos.map(info => info.total_sent_count))
        let average_ping_ms = mean(infos.map(info => info.average_ping_ms))
        let maximum_ping_ms = Math.max(...infos.map(info => info.maximum_ping_ms))
        let minimum_ping_ms = Math.min(...infos.map(info => info.minimum_ping_ms))
        let failed_ratio = failed_count / total_sent_count
        let succeed_ratio = 1 - failed_count

        this.#m_data.summary = {
            succeed_count: succeed_count,
            failed_count: failed_count,
            max_consecutive_failed_count: max_consecutive_failed_count,
            max_consecutive_failed_ms: max_consecutive_failed_ms,
            total_sent_count: total_sent_count,
            average_ping_ms: average_ping_ms,
            maximum_ping_ms: maximum_ping_ms,
            minimum_ping_ms: minimum_ping_ms,
            failed_ratio: failed_ratio,
            succeed_ratio: succeed_ratio
        }
    }
}