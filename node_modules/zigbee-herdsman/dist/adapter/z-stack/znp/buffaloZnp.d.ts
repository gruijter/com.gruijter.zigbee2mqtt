import { Buffalo } from "../../../buffalo";
import ParameterType from "./parameterType";
import type { BuffaloZnpOptions } from "./tstype";
declare class BuffaloZnp extends Buffalo {
    private readListNetwork;
    write(type: ParameterType, value: any, options: BuffaloZnpOptions): void;
    read(type: ParameterType, options: BuffaloZnpOptions): any;
}
export default BuffaloZnp;
//# sourceMappingURL=buffaloZnp.d.ts.map