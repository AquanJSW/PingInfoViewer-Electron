import HostPingInfo from "../hostpinginfo/hostpinginfo";
import IPPingInfo from "../ippinginfo/ippinginfo";

export default interface PingInfo_IP {
    /**@see HostPingInfo */
    hostname?: string,
    description?: string,

    /**@see IPPingInfo */
    ip?: string,
    failed_ratio?: number,
    total_sent_count?: number,
    failed_count?: number,
    average_ping_ms?: number,
    maximum_ping_ms?: number,
    minimum_ping_ms?: number,
    last_ping_ms?: number,
    max_consecutive_failed_count?: number,
    max_consecutive_failed_ms?: number,
    consecutive_failed_count?: number,
    last_failed_on?: Date,
    last_ping_status?: string,
    last_succeed_on?: Date,
    succeed_ratio?: number,
    succeed_count?: number,
}