import { type ZiGateCommandType } from "./commandType";
import type { ZiGateCommandCode, ZiGateMessageCode, ZiGateObjectPayload } from "./constants";
import ZiGateFrame from "./frame";
type ZiGateCode = ZiGateCommandCode | ZiGateMessageCode;
declare class ZiGateObject {
    private readonly _code;
    private readonly _payload;
    private readonly _parameters;
    private readonly _frame?;
    private constructor();
    get code(): ZiGateCode;
    get frame(): ZiGateFrame | undefined;
    get payload(): ZiGateObjectPayload;
    get command(): ZiGateCommandType;
    static createRequest(commandCode: ZiGateCommandCode, payload: ZiGateObjectPayload): ZiGateObject;
    static fromZiGateFrame(frame: ZiGateFrame): ZiGateObject;
    static fromBuffer(code: number, buffer: Buffer, frame: ZiGateFrame): ZiGateObject;
    private static readParameters;
    toZiGateFrame(): ZiGateFrame;
    private createPayloadBuffer;
}
export default ZiGateObject;
//# sourceMappingURL=ziGateObject.d.ts.map