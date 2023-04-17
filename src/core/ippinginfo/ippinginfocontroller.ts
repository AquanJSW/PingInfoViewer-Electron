import IPPing, { IPPingCallback } from "../ipping";
import IPPingInfoModel from "./ippinginfomodel";

export default class IPPingInfoController {
    #m_model: IPPingInfoModel
    #m_ping: IPPing
    constructor(model: IPPingInfoModel) {
        this.#m_model = model
        this.#m_ping = new IPPing(model.data.ip, model.callback)
    }

    isRunning() {
        return this.#m_ping.isRunning
    }

    start() {
        this.#m_model.reset()
        this.#m_ping.start()
    }

    pause() {
        this.#m_ping.pause()
    }

    resume() {
        this.#m_ping.resume()
    }

    reset() {
        let status = this.isRunning
        this.pause()
        this.#m_model.reset()
        this.#m_ping.reset()
        if (status)
            this.resume()
    }
}