import HostPingInfoController from "../hostpinginfo/hostpinginfocontroller";
import HostPingInfoModel from "../hostpinginfo/hostpinginfomodel";
import PingInfoModel from "./pinginfomodel";

export default class PingInfoController {
    #m_model: PingInfoModel;
    #m_controllers: HostPingInfoController[]
    constructor(model: PingInfoModel) {
        this.#m_model = model
        this.#m_controllers = this.#m_model.models.map(m => new HostPingInfoController(m))
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

    async init() {
        let results = await Promise.allSettled(this.#m_controllers.map(c => c.nslookup()))
        
        let models: HostPingInfoModel[] = []
        let controllers: HostPingInfoController[] = []
        for (let i of Array(results.length).keys()) {
            let result = results[i];
            let model = this.#m_model.models[i];
            let controller = this.#m_controllers[i];
            if (result.status == 'fulfilled') {
                console.log(`accept ${model.hostname}`)
                models.push(model)
                controllers.push(controller)
            }
        }
        this.#m_model.models = models;
        this.#m_controllers = controllers;
        if (models.length == 0)
            throw new Error('no valid host')
    }
}