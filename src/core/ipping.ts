import ping from "net-ping";
import net from 'net'

export type IPPingStatus = string

/**
 * @member reply_ip Always the same as `ip`.
 */
export type IPPingCallback = (
    ip: string,
    reply_ip: string,
    seq: number,
    timestamp: Date,
    latency: number,
    status: IPPingStatus
) => void

export interface IPPingOptions {
    interval?: number,
    timeout?: number
}

export default class IPPing {
    /**
     * This setting applies to all instances.
     */
    static options: IPPingOptions = { interval: 1000, timeout: 2000 }

    #m_ip: string
    #m_interval: number
    #m_sessionOptions
    #m_session
    #m_timeout?: NodeJS.Timeout;
    #m_callback: IPPingCallback;
    #m_seq: number;
    #m_isRunning?: boolean

    /**
     * 
     * @param ip IPv4/IPv6
     * @param interval 
     * @param timeout 
     * @param failHandler 
     * @param callback To be called asynchronously every `interval` time, 
     * so be care of the following situation:
     * 
     * *The next callback is calling while the former one hadn't done yet.*
     * 
     * I don't know if this situation is possible when `interval` is small enough,
     * what I could do is giving the `interval` a lower bound.
     * 
     */
    constructor(
        ip: string,
        callback: IPPingCallback,
        _options?: IPPingOptions
    ) {
        let options = { ...IPPing.options, ..._options }
        this.#m_ip = ip
        this.#m_interval = options.interval
        this.#m_sessionOptions = {
            networkProtocol: net.isIPv4(ip) ? ping.NetworkProtocol.IPv4 : ping.NetworkProtocol.IPv6,
            timeout: options.interval
        }
        this.#m_session = ping.createSession(this.#m_sessionOptions)
        this.#m_session.addListener('error', this.#handleSessionError.bind(this))
        this.#m_callback = callback
        this.#m_seq = 1
        this.#m_timeout = null
    }

    #handleSessionError(e: Error) {
        console.log(`session error for ${this.#m_ip}`)
        this.#m_session = ping.createSession(this.#m_sessionOptions)
        this.#m_session.addListener('error', this.#handleSessionError.bind(this))
        clearInterval(this.#m_timeout)
        this.resume()
    }

    /**
     * With reset
     */
    start() {
        this.pause()
        this.reset()
        this.resume()
    }

    /**
     * Can be invoked multi-times.
     */
    pause() {
        clearInterval(this.#m_timeout)
        this.#m_isRunning = false
    }

    resume() {
        this.#m_timeout = setInterval(() => {
            let seq = this.#m_seq++
            // console.log(`${this.#m_ip}: seq ${seq}`)
            try {
                this.#m_session.pingHost(this.#m_ip, (error: Error, target: string, sent: any, recv: any) => {
                    let ms = recv - sent
                    let status: any
                    if (error) {
                        status = error.message
                    } else if (ms > this.#m_session.timeout) {
                        status = 'timeout'
                    } else {
                        status = 'succeed'
                    }
                    this.#m_callback(this.#m_ip, target, seq, recv, ms, status);
                })
            } catch (e) {
                console.log(e)
            }
        }, this.#m_interval)
        this.#m_isRunning = true
    }

    /**
     * Don't stop, only reset seq number.
     */
    reset() {
        let status = this.isRunning
        this.pause()
        this.#m_seq = 1
        if (status)
            this.resume()
    }

    get ip() {
        return this.#m_ip
    }

    get isRunning() {
        return this.#m_isRunning
    }
}