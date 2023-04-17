import PingInfo_Host from "./pinginfo_host";
import PingInfo_IP from "./pinginfo_ip";

export default interface PingInfo {
    ip_infos?: PingInfo_IP[],
    host_info?: PingInfo_Host[],
}