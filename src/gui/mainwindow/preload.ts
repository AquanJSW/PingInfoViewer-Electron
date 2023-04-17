import { contextBridge } from "electron";
import api from "../bridge";

contextBridge.exposeInMainWorld('api', api)