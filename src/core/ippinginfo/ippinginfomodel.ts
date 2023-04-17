import { IPPingCallback, IPPingStatus } from "../ipping";
import IPPingInfo from "./ippinginfo";

export default class IPPingInfoModel {
    #m_data: IPPingInfo
    #m_interval: number

    constructor(ip: string, interval: number) {
        this.#m_data = { ip: ip }
        this.reset()
        this.#m_interval = interval
    }

    reset() {
        this.#m_data = {
            ...this.#m_data,
            ...{
                average_ping_ms: 0,
                consecutive_failed_count: 0,
                failed_count: 0,
                failed_ratio: 0,
                last_failed_on: new Date(0),
                last_ping_ms: 0,
                last_ping_status: '',
                last_succeed_on: new Date(0),
                max_consecutive_failed_count: 0,
                max_consecutive_failed_ms: 0,
                maximum_ping_ms: 0,
                minimum_ping_ms: 0,
                succeed_count: 0,
                succeed_ratio: 0,
                total_sent_count: 0
            }
        }
    }

    get #failed_ratio() {
        return this.#m_data.failed_count / this.#m_data.total_sent_count
    }

    get #succeed_ratio() {
        return 1 - this.#failed_ratio
    }

    get #max_consecutive_failed_ms() {
        return this.#m_data.max_consecutive_failed_count * this.#m_interval
    }

    get data() {
        this.#m_data.max_consecutive_failed_ms = this.#max_consecutive_failed_ms
        this.#m_data.failed_ratio = this.#failed_ratio
        this.#m_data.succeed_ratio = this.#succeed_ratio
        return structuredClone(this.#m_data)
    }

    #set_minimum_ping_ms() {
        if (this.#m_data.minimum_ping_ms > (this.#m_data.last_ping_ms as number))
            this.#m_data.minimum_ping_ms = this.#m_data.last_ping_ms
    }
    #set_maximum_ping_ms() {
        if (this.#m_data.maximum_ping_ms < (this.#m_data.last_ping_ms as number))
            this.#m_data.maximum_ping_ms = this.#m_data.last_ping_ms
    }

    #set_max_consecutive_failed_count() {
        if (this.#m_data.consecutive_failed_count > this.#m_data.max_consecutive_failed_count)
            this.#m_data.max_consecutive_failed_count = this.#m_data.consecutive_failed_count
    }

    #calc_average_ping_ms(prev_avg: number, prev_count: number, ms: number) {
        return (prev_avg * prev_count + ms) / (prev_count + 1)
    }

    #m_callback: IPPingCallback = (ip, reply_ip, seq, timestamp, latency, status) => {
        // this.#m_ipPingInfo.ip = ip
        // this.#m_ipPingInfo.reply_ip = reply_ip
        this.#m_data.total_sent_count += 1
        this.#m_data.last_ping_status = status

        if (status != 'succeed') {
            this.#m_data.failed_count += 1
            this.#m_data.consecutive_failed_count += 1
            this.#set_max_consecutive_failed_count()
            this.#m_data.last_ping_ms = 0
            this.#m_data.last_failed_on = timestamp
        } else {
            this.#m_data.consecutive_failed_count = 0
            this.#m_data.last_ping_ms = latency
            this.#m_data.average_ping_ms = this.#calc_average_ping_ms(this.#m_data.average_ping_ms, this.#m_data.succeed_count, latency)
            this.#m_data.succeed_count += 1
            this.#m_data.last_succeed_on = timestamp
            this.#set_maximum_ping_ms()
            this.#set_minimum_ping_ms()
        }
    }

    get callback() {
        return this.#m_callback
    }
}
