export default interface PingInfo_Host {
    hostname?: string,
    succeed_count?: number,
    failed_count?: number,
    max_consecutive_failed_count?: number,
    max_consecutive_failed_ms?: number,
    total_sent_count?: number,
    average_ping_ms?: number,
    maximum_ping_ms?: number,
    minimum_ping_ms?: number,
    failed_ratio?: number,
    succeed_ratio?: number,
}