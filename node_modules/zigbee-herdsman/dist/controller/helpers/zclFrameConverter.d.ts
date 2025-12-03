import * as Zcl from "../../zspec/zcl";
import type { CustomClusters } from "../../zspec/zcl/definition/tstype";
import type { ClusterOrRawWriteAttributes, TCustomCluster } from "../tstype";
declare function attributeKeyValue<Cl extends number | string, Custom extends TCustomCluster | undefined = undefined>(frame: Zcl.Frame, deviceManufacturerID: number | undefined, customClusters: CustomClusters): ClusterOrRawWriteAttributes<Cl, Custom>;
declare function attributeList(frame: Zcl.Frame, deviceManufacturerID: number | undefined, customClusters: CustomClusters): Array<string | number>;
export { attributeKeyValue, attributeList };
//# sourceMappingURL=zclFrameConverter.d.ts.map