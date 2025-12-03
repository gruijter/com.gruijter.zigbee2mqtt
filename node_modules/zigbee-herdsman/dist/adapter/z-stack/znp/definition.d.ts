import { Subsystem } from "../unpi/constants";
import type { MtCmd } from "./tstype";
declare const Definition: {
    [Subsystem.SYS]: MtCmd[];
    [Subsystem.MAC]: MtCmd[];
    [Subsystem.AF]: MtCmd[];
    [Subsystem.ZDO]: MtCmd[];
    [Subsystem.SAPI]: MtCmd[];
    [Subsystem.UTIL]: MtCmd[];
    [Subsystem.DEBUG]: MtCmd[];
    [Subsystem.APP]: MtCmd[];
    [Subsystem.APP_CNF]: MtCmd[];
    [Subsystem.GREENPOWER]: MtCmd[];
    [Subsystem.RESERVED]: MtCmd[];
    [Subsystem.NWK]: MtCmd[];
};
export default Definition;
//# sourceMappingURL=definition.d.ts.map