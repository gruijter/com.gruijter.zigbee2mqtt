import { EventEmitter } from "node:events";
import net from "node:net";
import * as Zdo from "../../../zspec/zdo";
import type { EndDeviceAnnounce, GenericZdoResponse } from "../../../zspec/zdo/definition/tstypes";
import { SerialPort } from "../../serialPort";
import type { SerialPortOptions } from "../../tstype";
import { ZiGateCommandCode, type ZiGateObjectPayload } from "./constants";
import ZiGateObject from "./ziGateObject";
type ZdoWaitressMatcher = {
    clusterId: number;
    target?: number | string;
};
interface ZiGateEventMap {
    close: [];
    zdoResponse: [Zdo.ClusterId, GenericZdoResponse];
    received: [ZiGateObject];
    LeaveIndication: [ZiGateObject];
    DeviceAnnounce: [EndDeviceAnnounce];
}
export default class ZiGate extends EventEmitter<ZiGateEventMap> {
    private path;
    private baudRate;
    private initialized;
    private parser?;
    private serialPort?;
    private socketPort?;
    private queue;
    portWrite?: SerialPort | net.Socket;
    private waitress;
    private zdoWaitress;
    constructor(path: string, serialPortOptions: SerialPortOptions);
    sendCommand(code: ZiGateCommandCode, payload?: ZiGateObjectPayload, timeout?: number, extraParameters?: object, disableResponse?: boolean): Promise<ZiGateObject>;
    requestZdo(clusterId: Zdo.ClusterId, payload: Buffer): Promise<boolean>;
    open(): Promise<void>;
    close(): Promise<void>;
    private openSerialPort;
    private openSocketPort;
    private onPortError;
    private onPortClose;
    private onSerialData;
    private waitressTimeoutFormatter;
    private waitressValidator;
    zdoWaitFor(matcher: ZdoWaitressMatcher): ReturnType<typeof this.zdoWaitress.waitFor>;
    private zdoWaitressValidator;
}
export {};
//# sourceMappingURL=zigate.d.ts.map