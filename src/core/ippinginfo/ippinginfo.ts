import { IPPingStatus } from "../ipping";

export default interface IPPingInfo {
    ip: string,
    // #m_reply_ip: string
    succeed_count?: number,
    failed_count?: number,
    consecutive_failed_count?: number,
    max_consecutive_failed_count?: number,
    max_consecutive_failed_ms?: number,
    total_sent_count?: number,
    last_ping_status?: IPPingStatus,
    last_ping_ms?: number,
    average_ping_ms?: number,
    last_succeed_on?: Date,
    last_failed_on?: Date,
    maximum_ping_ms?: number,
    minimum_ping_ms?: number,
    // #m_last_ping_ttl?: number
    failed_ratio?: number,
    succeed_ratio?: number,
}