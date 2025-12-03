import EventEmitter from "node:events";
import type { Eui64, ExtendedPanId, NodeId, PanId } from "../../../zspec/tstypes";
import * as Zdo from "../../../zspec/zdo";
import type { SerialPortOptions } from "../../tstype";
import { EmberCounterType, EmberDeviceUpdate, type EmberDutyCycleState, type EmberEntropySource, type EmberEventUnits, type EmberExtendedSecurityBitmask, EmberGPStatus, EmberGpKeyType, EmberGpSecurityLevel, EmberIncomingMessageType, EmberJoinDecision, EmberKeyStatus, EmberLeaveNetworkOption, type EmberLibraryId, type EmberLibraryStatus, type EmberMacPassthroughType, type EmberMultiPhyNwkConfig, type EmberNetworkStatus, type EmberNodeType, EmberOutgoingMessageType, type EmberSourceRouteDiscoveryMode, EmberStackError, type EmberTransmitPriority, type EmberTXPowerMode, type EzspNetworkScanType, EzspStatus, type EzspZllNetworkOperation, type IEEE802154CcaMode, SecManFlag, SLStatus } from "../enums";
import type { Ember802154RadioPriorities, EmberAesMmoHashContext, EmberApsFrame, EmberBeaconClassificationParams, EmberBeaconData, EmberBindingTableEntry, EmberCertificate283k1Data, EmberCertificateData, EmberChildData, EmberCurrentSecurityState, EmberDutyCycleLimits, EmberEndpointDescription, EmberGpAddress, EmberGpProxyTableEntry, EmberGpSinkTableEntry, EmberInitialSecurityState, EmberKeyData, EmberMessageDigest, EmberMulticastTableEntry, EmberMultiPhyRadioParameters, EmberMultiprotocolPriorities, EmberNeighborTableEntry, EmberNetworkInitStruct, EmberNetworkParameters, EmberPerDeviceDutyCycle, EmberPrivateKeyData, EmberPublicKey283k1Data, EmberPublicKeyData, EmberRouteTableEntry, EmberRxPacketInfo, EmberSignature283k1Data, EmberSignatureData, EmberSmacData, EmberTokenData, EmberTokenInfo, EmberTokTypeStackZllData, EmberTokTypeStackZllSecurity, EmberVersion, EmberZigbeeNetwork, EmberZllAddressAssignment, EmberZllDeviceInfoRecord, EmberZllInitialSecurityState, EmberZllNetwork, SecManAPSKeyMetadata, SecManContext, SecManKey, SecManNetworkKeyInfo } from "../types";
import { UartAsh } from "../uart/ash";
import { EzspBuffalo } from "./buffalo";
import { type EmberLeaveReason, type EmberRejoinReason, type EzspConfigId, type EzspEndpointFlag, EzspExtendedValueId, type EzspMemoryUsageData, EzspMfgTokenId, type EzspPolicyId, EzspValueId } from "./enums";
export interface EmberEzspEventMap {
    /** An error was detected that requires resetting the NCP. */
    ncpNeedsResetAndInit: [status: EzspStatus];
    /** @see Ezsp.ezspIncomingMessageHandler */
    zdoResponse: [apsFrame: EmberApsFrame, sender: NodeId, messageContents: Buffer];
    /** ezspIncomingMessageHandler */
    incomingMessage: [type: EmberIncomingMessageType, apsFrame: EmberApsFrame, lastHopLqi: number, sender: NodeId, messageContents: Buffer];
    /** @see Ezsp.ezspMacFilterMatchMessageHandler */
    touchlinkMessage: [sourcePanId: PanId, sourceAddress: Eui64, groupId: number, lastHopLqi: number, messageContents: Buffer];
    /** @see Ezsp.ezspStackStatusHandler */
    stackStatus: [status: SLStatus];
    /** @see Ezsp.ezspTrustCenterJoinHandler */
    trustCenterJoin: [
        newNodeId: NodeId,
        newNodeEui64: Eui64,
        status: EmberDeviceUpdate,
        policyDecision: EmberJoinDecision,
        parentOfNewNodeId: NodeId
    ];
    /** @see Ezsp.ezspMessageSentHandler */
    messageSent: [status: SLStatus, type: EmberOutgoingMessageType, indexOrDestination: number, apsFrame: EmberApsFrame, messageTag: number];
}
/**
 * Host EZSP layer.
 *
 * Provides functions that allow the Host application to send every EZSP command to the NCP.
 *
 * Commands to send to the serial>ASH layers all are named `ezsp${CommandName}`.
 * They do nothing but build the command, send it and return the value(s).
 * Callers are expected to handle errors appropriately.
 *   - They will throw `EzspStatus` if `sendCommand` fails or the returned value(s) by NCP are invalid (wrong length, etc).
 *   - Most will return `EmberStatus` given by NCP (some `EzspStatus`, some `SLStatus`...).
 */
export declare class Ezsp extends EventEmitter<EmberEzspEventMap> {
    private version;
    readonly ash: UartAsh;
    private readonly buffalo;
    /** The contents of the current EZSP frame. CAREFUL using this guy, it's pre-allocated. */
    private readonly frameContents;
    /** The total Length of the incoming frame */
    private frameLength;
    private readonly callbackBuffalo;
    /** The contents of the current EZSP frame. CAREFUL using this guy, it's pre-allocated. */
    private readonly callbackFrameContents;
    /** The total Length of the incoming frame */
    private callbackFrameLength;
    private initialVersionSent;
    /** EZSP frame sequence number. Used in EZSP_SEQUENCE_INDEX byte. */
    private frameSequence;
    /** Sequence used for EZSP send() tagging. static uint8_t */
    private sendSequence;
    private readonly queue;
    /** Awaiting response resolve/timer struct. undefined if not waiting for response. */
    private responseWaiter?;
    /** Counter for Queue Full errors */
    counterErrQueueFull: number;
    constructor(options: SerialPortOptions);
    /**
     * Returns the number of EZSP responses that have been received by the serial
     * protocol and are ready to be collected by the EZSP layer via
     * responseReceived().
     */
    get pendingResponseCount(): number;
    /**
     * Create a string representation of the last received frame in storage.
     */
    get frameToString(): string;
    /**
     * Create a string representation of the last received callback frame in storage.
     */
    get callbackFrameToString(): string;
    start(): Promise<EzspStatus>;
    /**
     * Cleanly close down the serial protocol (UART).
     * After this function has been called, init() must be called to resume communication with the NCP.
     */
    stop(): Promise<void>;
    /**
     * Must be called immediately after `ezspVersion` to sync the Host protocol version.
     * @param version Version for the Host to use.
     */
    setProtocolVersion(version: number): void;
    /**
     * Check if connected.
     * If not, attempt to restore the connection.
     *
     * @returns
     */
    checkConnection(): boolean;
    /**
     * Triggered by @see 'FATAL_ERROR'
     */
    private onAshFatalError;
    /**
     * Triggered by @see 'FRAME'
     */
    private onAshFrame;
    /**
     * Event from the EZSP layer indicating that the transaction with the NCP could not be completed due to a
     * serial protocol error or that the response received from the NCP reported an error.
     * The status parameter provides more information about the error.
     *
     * @param status
     */
    ezspErrorHandler(status: EzspStatus): void;
    private nextFrameSequence;
    private startCommand;
    /**
     * Sends the current EZSP command frame. Returns EZSP_SUCCESS if the command was sent successfully.
     * Any other return value means that an error has been detected by the serial protocol layer.
     *
     * if ezsp.sendCommand fails early, this will be:
     *   - EzspStatus.ERROR_INVALID_CALL
     *   - EzspStatus.NOT_CONNECTED
     *   - EzspStatus.ERROR_COMMAND_TOO_LONG
     *
     * if ezsp.sendCommand fails, this will be whatever ash.send returns:
     *   - EzspStatus.SUCCESS
     *   - EzspStatus.NO_TX_SPACE
     *   - EzspStatus.DATA_FRAME_TOO_SHORT
     *   - EzspStatus.DATA_FRAME_TOO_LONG
     *   - EzspStatus.NOT_CONNECTED
     *
     * if ezsp.sendCommand times out, this will be EzspStatus.ASH_ERROR_TIMEOUTS
     *
     * if ezsp.sendCommand resolves, this will be whatever ezsp.responseReceived returns:
     *   - EzspStatus.NO_RX_DATA (should not happen if command was sent (since we subscribe to frame event to trigger function))
     *   - status from EzspFrameID.INVALID_COMMAND status byte
     *   - EzspStatus.ERROR_UNSUPPORTED_CONTROL
     *   - EzspStatus.ERROR_WRONG_DIRECTION
     *   - EzspStatus.ERROR_TRUNCATED
     *   - EzspStatus.SUCCESS
     */
    private sendCommand;
    /**
     * Sets the stage for parsing if valid (indexes buffalo to params index).
     * @returns
     */
    validateReceivedFrame(buffalo: EzspBuffalo): EzspStatus;
    /**
     * Dispatches callback frames handlers.
     */
    callbackDispatch(): void;
    /**
     *
     * @returns uint8_t
     */
    private nextSendSequence;
    /**
     * Calls ezspSend${x} based on type and takes care of tagging message.
     *
     * Alias types expect `alias` & `sequence` params, along with `apsFrame.radius`.
     *
     * @param type Specifies the outgoing message type.
     * @param indexOrDestination uint16_t Depending on the type of addressing used, this is either the NodeId of the destination,
     *     an index into the address table, or an index into the binding table.
     *     Unused for multicast types.
     *     This must be one of the three Zigbee broadcast addresses for broadcast.
     * @param apsFrame [IN/OUT] EmberApsFrame * The APS frame which is to be added to the message.
     *        Sequence set in OUT as returned by ezspSend${x} command
     * @param message uint8_t * Content of the message.
     * @param alias The alias source address
     * @param sequence uint8_t The alias sequence number
     * @returns Result of the ezspSend${x} call or EmberStatus.INVALID_PARAMETER if type not supported.
     * @returns messageTag Tag used for ezspSend${x} command
     */
    send(type: EmberOutgoingMessageType, indexOrDestination: number, apsFrame: EmberApsFrame, message: Buffer, alias: NodeId, sequence: number): Promise<[SLStatus, messageTag: number]>;
    /**
     * Retrieving the new version info.
     * Wrapper for `ezspGetValue`.
     * @returns Send status
     * @returns EmberVersion*, null if status not SUCCESS.
     */
    ezspGetVersionStruct(): Promise<[SLStatus, version: EmberVersion]>;
    /**
     * Function for manipulating the endpoints flags on the NCP.
     * Wrapper for `ezspGetExtendedValue`
     * @param endpoint uint8_t
     * @param flags EzspEndpointFlags
     * @returns EzspStatus
     */
    ezspSetEndpointFlags(endpoint: number, flags: EzspEndpointFlag): Promise<SLStatus>;
    /**
     * Function for manipulating the endpoints flags on the NCP.
     * Wrapper for `ezspGetExtendedValue`.
     * @param endpoint uint8_t
     * @returns SLStatus
     * @returns flags
     */
    ezspGetEndpointFlags(endpoint: number): Promise<[SLStatus, flags: EzspEndpointFlag]>;
    /**
     * Wrapper for `ezspGetExtendedValue`.
     * @param NodeId
     * @param destination
     * @returns SLStatus
     * @returns overhead uint8_t
     */
    ezspGetSourceRouteOverhead(destination: NodeId): Promise<[SLStatus, overhead: number]>;
    /**
     * Wrapper for `ezspGetExtendedValue`.
     * @returns SLStatus
     * @returns reason
     * @returns nodeId NodeId*
     */
    ezspGetLastLeaveReason(): Promise<[SLStatus, reason: EmberLeaveReason, nodeId: NodeId]>;
    /**
     * Gets memory usage data from sl_memory_manager APIs.
     * Wrapper for `ezspGetExtendedValue`.
     * @param type Type of memory usage data to be acquired
     * @returns SLStatus
     * @returns Data (in bytes) reflecting current or "boot" memory usage
     */
    ezspGetMemoryUsageData(type: EzspMemoryUsageData): Promise<[SLStatus, memoryUsageValue: number]>;
    /**
     * Wrapper for `ezspGetValue`.
     * @returns EzspStatus
     * @returns reason
     */
    ezspGetLastRejoinReason(): Promise<[SLStatus, reason: EmberRejoinReason]>;
    /**
     * Wrapper for `ezspSetValue`.
     * @param mask
     * @returns
     */
    ezspSetExtendedSecurityBitmask(mask: EmberExtendedSecurityBitmask): Promise<SLStatus>;
    /**
     * Wrapper for `ezspGetValue`.
     * @returns
     */
    ezspGetExtendedSecurityBitmask(): Promise<[SLStatus, mask: EmberExtendedSecurityBitmask]>;
    /**
     * Wrapper for `ezspSetValue`.
     * @returns
     */
    ezspStartWritingStackTokens(): Promise<SLStatus>;
    /**
     * Wrapper for `ezspSetValue`.
     * @returns
     */
    ezspStopWritingStackTokens(): Promise<SLStatus>;
    /**
     * Wrapper for `ezspSetValue`.
     *
     * Set NWK layer outgoing frame counter (intended for device restoration purposes).
     * Caveats:
     *   - Can only be called before NetworkInit / FormNetwork / JoinNetwork, when sl_zigbee_network_state()==SL_ZIGBEE_NO_NETWORK.
     *   - This function should be called before ::sl_zigbee_set_initial_security_state, and the SL_ZIGBEE_NO_FRAME_COUNTER_RESET
     *     bitmask should be added to the initial security bitmask when ::emberSetInitialSecurityState is called.
     *   - If used in multi-network context, be sure to call ::sl_zigbee_set_current_network() prior to calling this function.
     *
     * @param desiredValue The desired outgoing NWK frame counter value.
     *        This should needs to be less than MAX_INT32U_VALUE to ensure that rollover does not occur on the next encrypted transmission.
     * @returns
     * - SL_STATUS_OK if calling context is valid (sl_zigbee_network_state() == SL_ZIGBEE_NO_NETWORK) and desiredValue < MAX_INT32U_VALUE.
     * - SL_STATUS_INVALID_STATE.
     */
    ezspSetNWKFrameCounter(frameCounter: number): Promise<SLStatus>;
    /**
     * Wrapper for `ezspSetValue`.
     *
     * Function to set APS layer outgoing frame counter for Trust Center Link Key (intended for device restoration purposes).
     * Caveats:
     *    - Can only be called before NetworkInit / FormNetwork / JoinNetwork, when sl_zigbee_network_state()==SL_ZIGBEE_NO_NETWORK.
     *    - This function should be called before ::sl_zigbee_set_initial_security_state, and the SL_ZIGBEE_NO_FRAME_COUNTER_RESET
     *      bitmask should be added to the initial security bitmask when ::emberSetInitialSecurityState is called.
     *    - If used in multi-network context, be sure to call ::sl_zigbee_set_current_network() prior to calling this function.
     *
     * @param desiredValue The desired outgoing APS frame counter value.
     *        This should needs to be less than MAX_INT32U_VALUE to ensure that rollover does not occur on the next encrypted transmission.
     * @returns
     * - SL_STATUS_OK if calling context is valid (sl_zigbee_network_state() == SL_ZIGBEE_NO_NETWORK) and desiredValue < MAX_INT32U_VALUE.
     * - SL_STATUS_INVALID_STATE.
     */
    ezspSetAPSFrameCounter(frameCounter: number): Promise<SLStatus>;
    /**
     * The command allows the Host to specify the desired EZSP version and must be
     * sent before any other command. The response provides information about the
     * firmware running on the NCP.
     *
     * @param desiredProtocolVersion uint8_t The EZSP version the Host wishes to use.
     *        To successfully set the version and allow other commands, this must be same as EZSP_PROTOCOL_VERSION.
     * @returns uint8_t The EZSP version the NCP is using.
     * @returns uint8_t * The type of stack running on the NCP (2).
     * @returns uint16_t * The version number of the stack.
     */
    ezspVersion(desiredProtocolVersion: number): Promise<[protocolVersion: number, stackType: number, stackVersion: number]>;
    /**
     * Reads a configuration value from the NCP.
     *
     * @param configId Identifies which configuration value to read.
     * @returns
     * - SLStatus.OK if the value was read successfully,
     * - SLStatus.ZIGBEE_EZSP_ERROR (for SL_ZIGBEE_EZSP_ERROR_INVALID_ID) if the NCP does not recognize configId.
     * @returns uint16_t * The configuration value.
     */
    ezspGetConfigurationValue(configId: EzspConfigId): Promise<[SLStatus, value: number]>;
    /**
     * Writes a configuration value to the NCP. Configuration values can be modified
     * by the Host after the NCP has reset. Once the status of the stack changes to
     * EMBER_NETWORK_UP, configuration values can no longer be modified and this
     * command will respond with EzspStatus.ERROR_INVALID_CALL.
     *
     * @param configId Identifies which configuration value to change.
     * @param value uint16_t The new configuration value.
     * @returns EzspStatus
     * - SLStatus.OK if the configuration value was changed,
     * - SLStatus.ZIGBEE_EZSP_ERROR if the new value exceeded the available memory,
     *                               if the new value was out of bounds,
     *                               if the NCP does not recognize configId,
     *                               if configuration values can no longer be modified.
     */
    ezspSetConfigurationValue(configId: EzspConfigId, value: number): Promise<SLStatus>;
    /**
     * Read attribute data on NCP endpoints.
     * @param endpoint uint8_t Endpoint
     * @param cluster uint16_t Cluster.
     * @param attributeId uint16_t Attribute ID.
     * @param mask uint8_t Mask.
     * @param manufacturerCode uint16_t Manufacturer code.
     * @returns An sl_zigbee_af_status_t value indicating success or the reason for failure, handled by the EZSP layer as a uint8_t.
     * @returns uint8_t * Attribute data type.
     * @returns uint8_t * Length of attribute data.
     * @returns uint8_t * Attribute data.
     */
    ezspReadAttribute(endpoint: number, cluster: number, attributeId: number, mask: number, manufacturerCode: number, readLength: number): Promise<[SLStatus, dataType: number, outReadLength: number, data: number[]]>;
    /**
     * Write attribute data on NCP endpoints.
     * @param endpoint uint8_t Endpoint
     * @param cluster uint16_t Cluster.
     * @param attributeId uint16_t Attribute ID.
     * @param mask uint8_t Mask.
     * @param manufacturerCode uint16_t Manufacturer code.
     * @param overrideReadOnlyAndDataType Override read only and data type.
     * @param justTest Override read only and data type.
     * @param dataType uint8_t Attribute data type.
     * @param data uint8_t * Attribute data.
     * @returns An sl_zigbee_af_status_t value indicating success or the reason for failure.
     */
    ezspWriteAttribute(endpoint: number, cluster: number, attributeId: number, mask: number, manufacturerCode: number, overrideReadOnlyAndDataType: boolean, justTest: boolean, dataType: number, data: Buffer): Promise<SLStatus>;
    /**
     * Configures endpoint information on the NCP. The NCP does not remember these
     * settings after a reset. Endpoints can be added by the Host after the NCP has
     * reset. Once the status of the stack changes to EMBER_NETWORK_UP, endpoints
     * can no longer be added and this command will respond with EzspStatus.ERROR_INVALID_CALL.
     * @param endpoint uint8_t The application endpoint to be added.
     * @param profileId uint16_t The endpoint's application profile.
     * @param deviceId uint16_t The endpoint's device ID within the application profile.
     * @param deviceVersion uint8_t The endpoint's device version.
     * @param inputClusterList uint16_t * Input cluster IDs the endpoint will accept.
     * @param outputClusterList uint16_t * Output cluster IDs the endpoint may send.
     * @returns
     * - SLStatus.OK if the endpoint was added,
     * - SLStatus.ZIGBEE_EZSP_ERROR if there is not enough memory available to add the endpoint,
     *                               if the endpoint already exists,
     *                               if endpoints can no longer be added.
     */
    ezspAddEndpoint(endpoint: number, profileId: number, deviceId: number, deviceVersion: number, inputClusterList: number[], outputClusterList: number[]): Promise<SLStatus>;
    /**
     * Allows the Host to change the policies used by the NCP to make fast
     * decisions.
     * @param policyId Identifies which policy to modify.
     * @param decisionId The new decision for the specified policy.
     * @returns
     * - SLStatus.OK if the policy was changed,
     * - SLStatus.ZIGBEE_EZSP_ERROR if the NCP does not recognize policyId.
     */
    ezspSetPolicy(policyId: EzspPolicyId, decisionId: number): Promise<SLStatus>;
    /**
     * Allows the Host to read the policies used by the NCP to make fast decisions.
     * @param policyId Identifies which policy to read.
     * @returns
     * - SLStatus.OK if the policy was read successfully,
     * - SLStatus.ZIGBEE_EZSP_ERROR if the NCP does not recognize policyId.
     * @returns EzspDecisionId * The current decision for the specified policy.
     */
    ezspGetPolicy(policyId: EzspPolicyId): Promise<[SLStatus, number]>;
    /**
     * Triggers a pan id update message.
     * @param The new Pan Id
     * @returns true if the request was successfully handed to the stack, false otherwise
     */
    ezspSendPanIdUpdate(newPan: PanId): Promise<boolean>;
    /**
     * Reads a value from the NCP.
     * @param valueId Identifies which value to read.
     * @returns
     * - SLStatus.OK if the value was read successfully,
     * - SLStatus.ZIGBEE_EZSP_ERROR if the NCP does not recognize valueId,
     *                               if the length of the returned value exceeds the size of local storage allocated to receive it.
     * @returns uint8_t * Both a command and response parameter.
     *   On command, the maximum in bytes of local storage allocated to receive the returned value.
     *   On response, the actual length in bytes of the returned value.
     * @returns uint8_t * The value.
     */
    ezspGetValue(valueId: EzspValueId, valueLength: number): Promise<[SLStatus, outValueLength: number, outValue: number[]]>;
    /**
     * Reads a value from the NCP but passes an extra argument specific to the value
     * being retrieved.
     * @param valueId Identifies which extended value ID to read.
     * @param characteristics uint32_t Identifies which characteristics of the extended value ID to read. These are specific to the value being read.
     * @returns
     * - SLStatus.OK if the value was read successfully,
     * - SLStatus.ZIGBEE_EZSP_ERROR if the NCP does not recognize valueId,
     *                               if the length of the returned value exceeds the size of local storage allocated to receive it.
     * @returns uint8_t * Both a command and response parameter.
     *   On command, the maximum in bytes of local storage allocated to receive the returned value.
     *   On response, the actual length in bytes of the returned value.
     * @returns uint8_t * The value.
     */
    ezspGetExtendedValue(valueId: EzspExtendedValueId, characteristics: number, valueLength: number): Promise<[SLStatus, outValueLength: number, outValue: number[]]>;
    /**
     * Writes a value to the NCP.
     * @param valueId Identifies which value to change.
     * @param valueLength uint8_t The length of the value parameter in bytes.
     * @param value uint8_t * The new value.
     * @returns
     * - SLStatus.OK if the value was changed,
     * - SLStatus.ZIGBEE_EZSP_ERROR if the new value was out of bounds,
     *                               if the NCP does not recognize valueId,
     *                               if the value could not be modified.
     */
    ezspSetValue(valueId: EzspValueId, valueLength: number, value: number[]): Promise<SLStatus>;
    /**
     * Allows the Host to control the broadcast behaviour of a routing device used by the NCP.
     * @param config uint8_t Passive ack config enum.
     * @param minAcksNeeded uint8_t The minimum number of acknowledgments (re-broadcasts) to wait for until
     *        deeming the broadcast transmission complete.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetPassiveAckConfig(config: number, minAcksNeeded: number): Promise<SLStatus>;
    /**
     * Set the PAN ID to be accepted by the device in a NLME Network Update command.
     * If this is set to a different value than its default 0xFFFF, NLME network update messages will be ignored if they do not match this PAN ID.
     * @param panId uint16_t PAN ID to be accepted in a network update.
     */
    ezspSetPendingNetworkUpdatePanId(panId: PanId): Promise<void>;
    /**
     * Retrieve the endpoint number located at the specified index.
     * @param index uint8_t Index to retrieve the endpoint number for.
     * @returns uint8_t Endpoint number at the index.
     */
    ezspGetEndpoint(index: number): Promise<number>;
    /**
     * Get the number of configured endpoints.
     * @returns uint8_t Number of configured endpoints.
     */
    ezspGetEndpointCount(): Promise<number>;
    /**
     * Retrieve the endpoint description for the given endpoint number.
     * @param endpoint Endpoint number to get the description of.
     * @returns Description of this endpoint.
     */
    ezspGetEndpointDescription(endpoint: number): Promise<EmberEndpointDescription>;
    /**
     * Retrieve one of the cluster IDs associated with the given endpoint.
     * @param endpoint Endpoint number to get a cluster ID for.
     * @param listId Which list to get the cluster ID from.  (0 for input, 1 for output).
     * @param listIndex Index from requested list to look at the cluster ID of.
     * @returns ID of the requested cluster.
     */
    ezspGetEndpointCluster(endpoint: number, listId: number, listIndex: number): Promise<number>;
    /**
     * A command which does nothing. The Host can use this to set the sleep mode or to check the status of the NCP.
     */
    ezspNop(): Promise<void>;
    /**
     * Variable length data from the Host is echoed back by the NCP.
     * This command has no other effects and is designed for testing the link between the Host and NCP.
     * @param data uint8_t * The data to be echoed back.
     * @returns uint8_t * The echo of the data.
     */
    ezspEcho(data: Buffer): Promise<Buffer>;
    /**
     * Allows the NCP to respond with a pending callback.
     */
    ezspCallback(): Promise<void>;
    /**
     * Callback
     * Indicates that there are currently no pending callbacks.
     */
    ezspNoCallbacks(): void;
    /**
     * Sets a token (8 bytes of non-volatile storage) in the Simulated EEPROM of the NCP.
     * @param tokenId uint8_t Which token to set
     * @param tokenData uint8_t * The data to write to the token.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetToken(tokenId: number, tokenData: number[]): Promise<SLStatus>;
    /**
     * Retrieves a token (8 bytes of non-volatile storage) from the Simulated EEPROM of the NCP.
     * @param tokenId uint8_t Which token to read
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns uint8_t * The contents of the token.
     */
    ezspGetToken(tokenId: number): Promise<[SLStatus, tokenData: number[]]>;
    /**
     * Retrieves a manufacturing token from the Flash Information Area of the NCP
     * (except for EZSP_STACK_CAL_DATA which is managed by the stack).
     * @param tokenId Which manufacturing token to read.
     * @returns uint8_t The length of the tokenData parameter in bytes.
     * @returns uint8_t * The manufacturing token data.
     */
    ezspGetMfgToken(tokenId: EzspMfgTokenId): Promise<[number, tokenData: number[]]>;
    /**
     * Sets a manufacturing token in the Customer Information Block (CIB) area of
     * the NCP if that token currently unset (fully erased). Cannot be used with
     * EZSP_STACK_CAL_DATA, EZSP_STACK_CAL_FILTER, EZSP_MFG_ASH_CONFIG, or
     * EZSP_MFG_CBKE_DATA token.
     * @param tokenId Which manufacturing token to set.
     * @param tokenData uint8_t * The manufacturing token data.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetMfgToken(tokenId: EzspMfgTokenId, tokenData: Buffer): Promise<SLStatus>;
    /**
     * Callback
     * A callback invoked to inform the application that a stack token has changed.
     * @param tokenAddress uint16_t The address of the stack token that has changed.
     */
    ezspStackTokenChangedHandler(tokenAddress: number): void;
    /**
     * Returns a pseudorandom number.
     * @returns Always returns SLStatus.OK.
     * @returns uint16_t * A pseudorandom number.
     */
    ezspGetRandomNumber(): Promise<[SLStatus, value: number]>;
    /**
     * Sets a timer on the NCP. There are 2 independent timers available for use by the Host.
     * A timer can be cancelled by setting time to 0 or units to EMBER_EVENT_INACTIVE.
     * @param timerId uint8_t Which timer to set (0 or 1).
     * @param time uint16_t The delay before the timerHandler callback will be generated.
     *        Note that the timer clock is free running and is not synchronized with this command.
     *        This means that the actual delay will be between time and (time - 1). The maximum delay is 32767.
     * @param units The units for time.
     * @param repeat If true, a timerHandler callback will be generated repeatedly. If false, only a single timerHandler callback will be generated.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetTimer(timerId: number, time: number, units: EmberEventUnits, repeat: boolean): Promise<SLStatus>;
    /**
     * Gets information about a timer. The Host can use this command to find out how
     * much longer it will be before a previously set timer will generate a
     * callback.
     * @param timerId uint8_t Which timer to get information about (0 or 1).
     * @returns uint16_t The delay before the timerHandler callback will be generated.
     * @returns EmberEventUnits * The units for time.
     * @returns bool * True if a timerHandler callback will be generated repeatedly. False if only a single timerHandler callback will be generated.
     */
    ezspGetTimer(timerId: number): Promise<[number, units: EmberEventUnits, repeat: boolean]>;
    /**
     * Callback
     * A callback from the timer.
     * @param timerId uint8_t Which timer generated the callback (0 or 1).
     */
    ezspTimerHandler(timerId: number): void;
    /**
     * Sends a debug message from the Host to the Network Analyzer utility via the NCP.
     * @param binaryMessage true if the message should be interpreted as binary data, false if the message should be interpreted as ASCII text.
     * @param messageContents uint8_t * The binary message.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspDebugWrite(binaryMessage: boolean, messageContents: Buffer): Promise<SLStatus>;
    /**
     * Retrieves and clears Ember counters. See the EmberCounterType enumeration for the counter types.
     * @returns uint16_t * A list of all counter values ordered according to the EmberCounterType enumeration.
     */
    ezspReadAndClearCounters(): Promise<number[]>;
    /**
     * Retrieves Ember counters. See the EmberCounterType enumeration for the counter types.
     * @returns uint16_t * A list of all counter values ordered according to the EmberCounterType enumeration.
     */
    ezspReadCounters(): Promise<number[]>;
    /**
     * Callback
     * This call is fired when a counter exceeds its threshold
     * @param type Type of Counter
     */
    ezspCounterRolloverHandler(type: EmberCounterType): void;
    /**
     * Callback
     * This call is fired when mux detects an invalid rx case, which would be different rx channels for different protocol contexts, when fast channel switching is not enabled
     * @param newRxChannel uint8_t
     * @param oldRxChannel uint8_t
     */
    ezspMuxInvalidRxHandler(newRxChannel: number, oldRxChannel: number): void;
    /**
     * Used to test that UART flow control is working correctly.
     * @param delay uint16_t Data will not be read from the host for this many milliseconds.
     */
    ezspDelayTest(delay: number): Promise<void>;
    /**
     * This retrieves the status of the passed library ID to determine if it is compiled into the stack.
     * @param libraryId The ID of the library being queried.
     * @returns The status of the library being queried.
     */
    ezspGetLibraryStatus(libraryId: EmberLibraryId): Promise<EmberLibraryStatus>;
    /**
     * Allows the HOST to know whether the NCP is running the XNCP library. If so,
     * the response contains also the manufacturer ID and the version number of the
     * XNCP application that is running on the NCP.
     * @returns
     * - SLStatus.OK if the NCP is running the XNCP library.
     * - SLStatus.INVALID_STATE otherwise.
     * @returns manufacturerId uint16_t * The manufactured ID the user has defined in the XNCP application.
     * @returns versionNumber uint16_t * The version number of the XNCP application.
     */
    ezspGetXncpInfo(): Promise<[SLStatus, manufacturerId: number, versionNumber: number]>;
    /**
     * Provides the customer a custom EZSP frame. On the NCP, these frames are only
     * handled if the XNCP library is included. On the NCP side these frames are
     * handled in the emberXNcpIncomingCustomEzspMessageCallback() callback
     * function.
     * @param uint8_t * The payload of the custom frame (maximum 119 bytes).
     * @param uint8_t The expected length of the response.
     * @returns The status returned by the custom command.
     * @returns uint8_t *The response.
     */
    ezspCustomFrame(payload: Buffer, replyLength: number): Promise<[SLStatus, outReply: Buffer]>;
    /**
     * Callback
     * A callback indicating a custom EZSP message has been received.
     * @param payload uint8_t * The payload of the custom frame.
     */
    ezspCustomFrameHandler(payload: Buffer): void;
    /**
     * Returns the EUI64 ID of the local node.
     * @returns The 64-bit ID.
     */
    ezspGetEui64(): Promise<Eui64>;
    /**
     * Returns the 16-bit node ID of the local node.
     * @returns The 16-bit ID.
     */
    ezspGetNodeId(): Promise<NodeId>;
    /**
     * Returns number of phy interfaces present.
     * @returns uint8_t Value indicate how many phy interfaces present.
     */
    ezspGetPhyInterfaceCount(): Promise<number>;
    /**
     * Returns the entropy source used for true random number generation.
     * @returns Value indicates the used entropy source.
     */
    ezspGetTrueRandomEntropySource(): Promise<EmberEntropySource>;
    /**
     * Extend a joiner's timeout to wait for the network key on the joiner default key timeout is 3 sec,
     * and only values greater equal to 3 sec are accepted.
     * @param networkKeyTimeoutS Network key timeout
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetupDelayedJoin(networkKeyTimeoutS: number): Promise<SLStatus>;
    /**
     * Get the current scheduler priorities for multiprotocol apps.
     * @returns The current priorities.
     */
    ezspRadioGetSchedulerPriorities(): Promise<Ember802154RadioPriorities | EmberMultiprotocolPriorities>;
    /**
     * Set the current scheduler priorities for multiprotocol apps.
     * @param priorities The current priorities.
     */
    ezspRadioSetSchedulerPriorities(priorities: Ember802154RadioPriorities | EmberMultiprotocolPriorities): Promise<void>;
    /**
     * Get the current multiprotocol sliptime
     * @returns Value of the current slip time.
     */
    ezspRadioGetSchedulerSliptime(): Promise<number>;
    /**
     * Set the current multiprotocol sliptime
     * @param slipTime Value of the current slip time.
     */
    ezspRadioSetSchedulerSliptime(slipTime: number): Promise<void>;
    /**
     * Check if a particular counter is one that could report from either a 2.4GHz or sub-GHz interface.
     * @param counter The counter to be checked.
     * @returns Whether this counter requires a PHY index when operating on a dual-PHY system.
     */
    ezspCounterRequiresPhyIndex(counter: EmberCounterType): Promise<boolean>;
    /**
     * Check if a particular counter can report on the destination node ID they have been triggered from.
     * @param counter The counter to be checked.
     * @returns Whether this counter requires the destination node ID.
     */
    ezspCounterRequiresDestinationNodeId(counter: EmberCounterType): Promise<boolean>;
    /**
     * Sets the manufacturer code to the specified value.
     * The manufacturer code is one of the fields of the node descriptor.
     * @param code uint16_t The manufacturer code for the local node.
     */
    ezspSetManufacturerCode(code: number): Promise<void>;
    /**
     * Gets the manufacturer code to the specified value.
     * The manufacturer code is one of the fields of the node descriptor.
     * @returns The manufacturer code for the local node.
     */
    ezspGetManufacturerCode(): Promise<number>;
    /**
     * Sets the power descriptor to the specified value. The power descriptor is a
     * dynamic value. Therefore, you should call this function whenever the value
     * changes.
     * @param descriptor uint16_t The new power descriptor for the local node.
     * @returns An SLStatus value indicating success or the reason for failure. Always `OK` in v13-.
     */
    ezspSetPowerDescriptor(descriptor: number): Promise<SLStatus>;
    /**
     * Resume network operation after a reboot. The node retains its original type.
     * This should be called on startup whether or not the node was previously part
     * of a network. EMBER_NOT_JOINED is returned if the node is not part of a
     * network. This command accepts options to control the network initialization.
     * @param networkInitStruct EmberNetworkInitStruct * An EmberNetworkInitStruct containing the options for initialization.
     * @returns
     * - SLStatus.OK if successful initialization,
     * - SLStatus.NOT_JOINED if the node is not part of a network
     * - or the reason for failure.
     */
    ezspNetworkInit(networkInitStruct: EmberNetworkInitStruct): Promise<SLStatus>;
    /**
     * Returns a value indicating whether the node is joining, joined to, or leaving a network.
     * @returns Command send status.
     * @returns An EmberNetworkStatus value indicating the current join status.
     */
    ezspNetworkState(): Promise<EmberNetworkStatus>;
    /**
     * Callback
     * A callback invoked when the status of the stack changes. If the status
     * parameter equals EMBER_NETWORK_UP, then the getNetworkParameters command can
     * be called to obtain the new network parameters. If any of the parameters are
     * being stored in nonvolatile memory by the Host, the stored values should be
     * updated.
     * @param status Stack status
     */
    ezspStackStatusHandler(status: SLStatus): void;
    /**
     * This function will start a scan.
     * @param scanType Indicates the type of scan to be performed. Possible values are: EZSP_ENERGY_SCAN and EZSP_ACTIVE_SCAN.
     *        For each type, the respective callback for reporting results is: energyScanResultHandler and networkFoundHandler.
     *        The energy scan and active scan report errors and completion via the scanCompleteHandler.
     * @param channelMask uint32_t Bits set as 1 indicate that this particular channel should be scanned.
     *        Bits set to 0 indicate that this particular channel should not be scanned. For example, a channelMask value of 0x00000001
     *        would indicate that only channel 0 should be scanned. Valid channels range from 11 to 26 inclusive.
     *        This translates to a channel mask value of 0x07FFF800.
     *        As a convenience, a value of 0 is reinterpreted as the mask for the current channel.
     * @param duration uint8_t Sets the exponent of the number of scan periods, where a scan period is 960 symbols.
     *        The scan will occur for ((2^duration) + 1) scan periods.
     * @returns
     * - SLStatus.OK signals that the scan successfully started. Possible error responses and their meanings:
     * - SLStatus.MAC_SCANNING, we are already scanning;
     * - SLStatus.BAD_SCAN_DURATION, we have set a duration value that is not 0..14 inclusive;
     * - SLStatus.MAC_INCORRECT_SCAN_TYPE, we have requested an undefined scanning type;
     * - SLStatus.INVALID_CHANNEL_MASK, our channel mask did not specify any valid channels.
     */
    ezspStartScan(scanType: EzspNetworkScanType, channelMask: number, duration: number): Promise<SLStatus>;
    /**
     * Callback
     * Reports the result of an energy scan for a single channel. The scan is not
     * complete until the scanCompleteHandler callback is called.
     * @param channel uint8_t The 802.15.4 channel number that was scanned.
     * @param maxRssiValue int8_t The maximum RSSI value found on the channel.
     */
    ezspEnergyScanResultHandler(channel: number, maxRssiValue: number): void;
    /**
     * Callback
     * Reports that a network was found as a result of a prior call to startScan.
     * Gives the network parameters useful for deciding which network to join.
     * @param networkFound EmberZigbeeNetwork * The parameters associated with the network found.
     * @param lastHopLqi uint8_t The link quality from the node that generated this beacon.
     * @param lastHopRssi int8_t The energy level (in units of dBm) observed during the reception.
     */
    ezspNetworkFoundHandler(networkFound: EmberZigbeeNetwork, lastHopLqi: number, lastHopRssi: number): void;
    /**
     * Callback
     * @param channel uint8_t The channel on which the current error occurred. Undefined for the case of EMBER_SUCCESS.
     * @param status The error condition that occurred on the current channel. Value will be SLStatus.OK when the scan has completed.
     *               Other error conditions signify a failure to scan on the channel specified.
     */
    ezspScanCompleteHandler(channel: number, status: SLStatus): void;
    /**
     * Callback
     * This function returns an unused panID and channel pair found via the find
     * unused panId scan procedure.
     * @param panId The unused panID which has been found.
     * @param channel uint8_t The channel that the unused panID was found on.
     */
    ezspUnusedPanIdFoundHandler(panId: PanId, channel: number): void;
    /**
     * This function starts a series of scans which will return an available panId.
     * @param channelMask uint32_t The channels that will be scanned for available panIds.
     * @param duration uint8_t The duration of the procedure.
     * @returns The error condition that occurred during the scan. Value will be SLStatus.OK if there are no errors.
     */
    ezspFindUnusedPanId(channelMask: number, duration: number): Promise<SLStatus>;
    /**
     * Terminates a scan in progress.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspStopScan(): Promise<SLStatus>;
    /**
     * Forms a new network by becoming the coordinator.
     * @param parameters EmberNetworkParameters * Specification of the new network.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspFormNetwork(parameters: EmberNetworkParameters): Promise<SLStatus>;
    /**
     * Causes the stack to associate with the network using the specified network
     * parameters. It can take several seconds for the stack to associate with the
     * local network. Do not send messages until the stackStatusHandler callback
     * informs you that the stack is up.
     * @param nodeType Specification of the role that this node will have in the network.
     *        This role must not be EMBER_COORDINATOR. To be a coordinator, use the formNetwork command.
     * @param parameters EmberNetworkParameters * Specification of the network with which the node should associate.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspJoinNetwork(nodeType: EmberNodeType, parameters: EmberNetworkParameters): Promise<SLStatus>;
    /**
     * Causes the stack to associate with the network using the specified network
     * parameters in the beacon parameter. It can take several seconds for the stack
     * to associate with the local network. Do not send messages until the
     * stackStatusHandler callback informs you that the stack is up. Unlike
     * ::emberJoinNetwork(), this function does not issue an active scan before
     * joining. Instead, it will cause the local node to issue a MAC Association
     * Request directly to the specified target node. It is assumed that the beacon
     * parameter is an artifact after issuing an active scan. (For more information,
     * see emberGetBestBeacon and emberGetNextBeacon.)
     * @param localNodeType Specifies the role that this node will have in the network. This role must not be EMBER_COORDINATOR.
     *        To be a coordinator, use the formNetwork command.
     * @param beacon EmberBeaconData * Specifies the network with which the node should associate.
     * @param radioTxPower int8_t The radio transmit power to use, specified in dBm.
     * @param clearBeaconsAfterNetworkUp If true, clear beacons in cache upon join success. If join fail, do nothing.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspJoinNetworkDirectly(localNodeType: EmberNodeType, beacon: EmberBeaconData, radioTxPower: number, clearBeaconsAfterNetworkUp: boolean): Promise<SLStatus>;
    /**
     * Causes the stack to leave the current network. This generates a
     * stackStatusHandler callback to indicate that the network is down. The radio
     * will not be used until after sending a formNetwork or joinNetwork command.
     * @param options This parameter gives options when leave network
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspLeaveNetwork(options?: EmberLeaveNetworkOption): Promise<SLStatus>;
    /**
     * The application may call this function when contact with the network has been
     * lost. The most common usage case is when an end device can no longer
     * communicate with its parent and wishes to find a new one. Another case is
     * when a device has missed a Network Key update and no longer has the current
     * Network Key.  The stack will call ezspStackStatusHandler to indicate that the
     * network is down, then try to re-establish contact with the network by
     * performing an active scan, choosing a network with matching extended pan id,
     * and sending a Zigbee network rejoin request. A second call to the
     * ezspStackStatusHandler callback indicates either the success or the failure
     * of the attempt. The process takes approximately 150 milliseconds per channel
     * to complete.
     * @param haveCurrentNetworkKey This parameter tells the stack whether to try to use the current network key.
     *        If it has the current network key it will perform a secure rejoin (encrypted). If this fails the device should try an unsecure rejoin.
     *        If the Trust Center allows the rejoin then the current Network Key will be sent encrypted using the device's Link Key.
     * @param channelMask uint32_t A mask indicating the channels to be scanned. See emberStartScan for format details.
     *        A value of 0 is reinterpreted as the mask for the current channel.
     * @param reason uint8_t A sl_zigbee_rejoin_reason_t variable which could be passed in if there is actually a reason for rejoin,
     *        or could be left at 0xFF
     * @param nodeType uint8_t The rejoin could be triggered with a different nodeType.
     *        This value could be set to 0 or SL_ZIGBEE_DEVICE_TYPE_UNCHANGED if not needed.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspFindAndRejoinNetwork(haveCurrentNetworkKey: boolean, channelMask: number, reason?: number, nodeType?: number): Promise<SLStatus>;
    /**
     * Tells the stack to allow other nodes to join the network with this node as
     * their parent. Joining is initially disabled by default.
     * @param duration uint8_t A value of 0x00 disables joining. A value of 0xFF enables joining.
     *        Any other value enables joining for that number of seconds.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspPermitJoining(duration: number): Promise<SLStatus>;
    /**
     * Callback
     * Indicates that a child has joined or left.
     * @param index uint8_t The index of the child of interest.
     * @param joining True if the child is joining. False the child is leaving.
     * @param childId The node ID of the child.
     * @param childEui64 The EUI64 of the child.
     * @param childType The node type of the child.
     */
    ezspChildJoinHandler(index: number, joining: boolean, childId: NodeId, childEui64: Eui64, childType: EmberNodeType): void;
    /**
     * Sends a ZDO energy scan request. This request may only be sent by the current
     * network manager and must be unicast, not broadcast. See ezsp-utils.h for
     * related macros emberSetNetworkManagerRequest() and
     * emberChangeChannelRequest().
     * @param target The network address of the node to perform the scan.
     * @param scanChannels uint32_t A mask of the channels to be scanned
     * @param scanDuration uint8_t How long to scan on each channel.
     *        Allowed values are 0..5, with the scan times as specified by 802.15.4 (0 = 31ms, 1 = 46ms, 2 = 77ms, 3 = 138ms, 4 = 261ms, 5 = 507ms).
     * @param scanCount uint16_t The number of scans to be performed on each channel (1..8).
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspEnergyScanRequest(target: NodeId, scanChannels: number, scanDuration: number, scanCount: number): Promise<SLStatus>;
    /**
     * Returns the current network parameters.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberNodeType * An EmberNodeType value indicating the current node type.
     * @returns EmberNetworkParameters * The current network parameters.
     */
    ezspGetNetworkParameters(): Promise<[SLStatus, nodeType: EmberNodeType, parameters: EmberNetworkParameters]>;
    /**
     * Returns the current radio parameters based on phy index.
     * @param phyIndex uint8_t Desired index of phy interface for radio parameters.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberMultiPhyRadioParameters * The current radio parameters based on provided phy index.
     */
    ezspGetRadioParameters(phyIndex: number): Promise<[SLStatus, parameters: EmberMultiPhyRadioParameters]>;
    /**
     * Returns information about the children of the local node and the parent of
     * the local node.
     * @returns uint8_t The number of children the node currently has.
     * @returns The parent's EUI64. The value is undefined for nodes without parents (coordinators and nodes that are not joined to a network).
     * @returns NodeId * The parent's node ID. The value is undefined for nodes without parents
     *          (coordinators and nodes that are not joined to a network).
     */
    ezspGetParentChildParameters(): Promise<[number, parentEui64: Eui64, parentNodeId: NodeId]>;
    /**
     * Return the number of router children that the node currently has.
     * @returns The number of router children.
     */
    ezspRouterChildCount(): Promise<number>;
    /**
     * Return the maximum number of children for this node.
     * The return value is undefined for nodes that are not joined to a network.
     * @returns The maximum number of children.
     */
    ezspMaxChildCount(): Promise<number>;
    /**
     * Return the maximum number of router children for this node.
     * The return value is undefined for nodes that are not joined to a network.
     * @returns The maximum number of router children.
     */
    ezspMaxRouterChildCount(): Promise<number>;
    /**
     *
     * @returns
     */
    ezspGetParentIncomingNwkFrameCounter(): Promise<number>;
    /**
     *
     * @param value uint32_t
     * @returns
     */
    ezspSetParentIncomingNwkFrameCounter(value: number): Promise<SLStatus>;
    /**
     * Return a bitmask indicating the stack's current tasks.
     * The mask ::SL_ZIGBEE_HIGH_PRIORITY_TASKS defines which tasks are high priority.
     * Devices should not sleep if any high priority tasks are active.
     * Active tasks that are not high priority are waiting for messages to arrive from other devices.
     * If there are active tasks, but no high priority ones, the device may sleep but should periodically wake up
     * and call ::emberPollForData() in order to receive messages.
     * Parents will hold messages for ::SL_ZIGBEE_INDIRECT_TRANSMISSION_TIMEOUT milliseconds before discarding them.
     * @returns A bitmask of the stack's active tasks.
     */
    ezspCurrentStackTasks(): Promise<number>;
    /**
     * Indicate whether the stack is currently in a state where there are no high-priority tasks, allowing the device to sleep.
     * There may be tasks expecting incoming messages, in which case the device should periodically wake up
     * and call ::emberPollForData() in order to receive messages.
     * This function can only be called when the node type is ::SL_ZIGBEE_SLEEPY_END_DEVICE
     * @returns True if the application may sleep but the stack may be expecting incoming messages.
     */
    ezspOkToNap(): Promise<boolean>;
    /**
     * Indicate whether the parent token has been set by association.
     * @returns True if the parent token has been set.
     */
    ezspParentTokenSet(): Promise<boolean>;
    /**
     * Indicate whether the stack currently has any tasks pending.
     * If no tasks are pending, ::emberTick() does not need to be called until the next time a stack API function is called.
     * This function can only be called when the node type is ::SL_ZIGBEE_SLEEPY_END_DEVICE.
     * @returns True if the application may sleep for as long as it wishes.
     */
    ezspOkToHibernate(): Promise<boolean>;
    /**
     * Indicate whether the stack is currently in a state that does not require the application to periodically poll.
     * @returns True if the device may poll less frequently.
     */
    ezspOkToLongPoll(): Promise<boolean>;
    /**
     * Calling this function will render all other stack functions except ezspStackPowerUp() non-functional until the radio is powered back on.
     */
    ezspStackPowerDown(): Promise<void>;
    /**
     * Initialize the radio. Typically called coming out of deep sleep.
     * For non-sleepy devices, also turns the radio on and leaves it in RX mode.
     */
    ezspStackPowerUp(): Promise<void>;
    /**
     * Returns information about a child of the local node.
     * @param uint8_t The index of the child of interest in the child table. Possible indexes range from zero to EMBER_CHILD_TABLE_SIZE.
     * @returns
     * - SLStatus.OK if there is a child at index.
     * - SLStatus.NOT_JOINED if there is no child at index.
     * @returns EmberChildData * The data of the child.
     */
    ezspGetChildData(index: number): Promise<[SLStatus, childData: EmberChildData]>;
    /**
     * Sets child data to the child table token.
     * @param index uint8_t The index of the child of interest in the child table. Possible indexes range from zero to (EMBER_CHILD_TABLE_SIZE - 1).
     * @param childData EmberChildData * The data of the child.
     * @returns
     * - SLStatus.OK if the child data is set successfully at index.
     * - SLStatus.INVALID_INDEX if provided index is out of range.
     */
    ezspSetChildData(index: number, childData: EmberChildData): Promise<SLStatus>;
    /**
     * Convert a child index to a node ID
     * @param childIndex uint8_t The index of the child of interest in the child table. Possible indexes range from zero to EMBER_CHILD_TABLE_SIZE.
     * @returns The node ID of the child or EMBER_NULL_NODE_ID if there isn't a child at the childIndex specified
     */
    ezspChildId(childIndex: number): Promise<NodeId>;
    /**
     * Return radio power value of the child from the given childIndex
     * @param childIndex uint8_t The index of the child of interest in the child table.
     *        Possible indexes range from zero to SL_ZIGBEE_CHILD_TABLE_SIZE.
     * @returns The power of the child or maximum radio power, which is the power value provided by the user
     *          while forming/joining a network if there isn't a child at the childIndex specified
     */
    ezspChilPower(childIndex: number): Promise<number>;
    /**
     * Set the radio power value for a given child index.
     * @param childIndex uint8_t
     * @param newPower int8_t
     */
    ezspSetChildPower(childIndex: number, newPower: number): Promise<void>;
    /**
     * Convert a node ID to a child index
     * @param childId The node ID of the child
     * @returns uint8_t The child index or 0xFF if the node ID doesn't belong to a child
     */
    ezspChildIndex(childId: NodeId): Promise<number>;
    /**
     * Returns the source route table total size.
     * @returns uint8_t Total size of source route table.
     */
    ezspGetSourceRouteTableTotalSize(): Promise<number>;
    /**
     * Returns the number of filled entries in source route table.
     * @returns uint8_t The number of filled entries in source route table.
     */
    ezspGetSourceRouteTableFilledSize(): Promise<number>;
    /**
     * Returns information about a source route table entry
     * @param index uint8_t The index of the entry of interest in the source route table.
     *        Possible indexes range from zero to SOURCE_ROUTE_TABLE_FILLED_SIZE.
     * @returns
     * - SLStatus.OK if there is source route entry at index.
     * - SLStatus.NOT_FOUND if there is no source route at index.
     * @returns NodeId * The node ID of the destination in that entry.
     * @returns uint8_t * The closer node index for this source route table entry
     */
    ezspGetSourceRouteTableEntry(index: number): Promise<[SLStatus, destination: NodeId, closerIndex: number]>;
    /**
     * Returns the neighbor table entry at the given index. The number of active
     * neighbors can be obtained using the neighborCount command.
     * @param index uint8_t The index of the neighbor of interest. Neighbors are stored in ascending order by node id,
     *        with all unused entries at the end of the table.
     * @returns
     * - SLStatus.FAIL if the index is greater or equal to the number of active neighbors, or if the device is an end device.
     * - SLStatus.OK otherwise.
     * @returns EmberNeighborTableEntry * The contents of the neighbor table entry.
     */
    ezspGetNeighbor(index: number): Promise<[SLStatus, value: EmberNeighborTableEntry]>;
    /**
     * Return EmberStatus depending on whether the frame counter of the node is
     * found in the neighbor or child table. This function gets the last received
     * frame counter as found in the Network Auxiliary header for the specified
     * neighbor or child
     * @param eui64 eui64 of the node
     * @returns
     * - SLStatus.NOT_FOUND if the node is not found in the neighbor or child table.
     * - SLStatus.OK otherwise
     * @returns uint32_t * Return the frame counter of the node from the neighbor or child table
     */
    ezspGetNeighborFrameCounter(eui64: Eui64): Promise<[SLStatus, returnFrameCounter: number]>;
    /**
     * Sets the frame counter for the neighbour or child.
     * @param eui64 eui64 of the node
     * @param frameCounter uint32_t Return the frame counter of the node from the neighbor or child table
     * @returns
     * - SLStatus.NOT_FOUND if the node is not found in the neighbor or child table.
     * - SLStatus.OK otherwise
     */
    ezspSetNeighborFrameCounter(eui64: Eui64, frameCounter: number): Promise<SLStatus>;
    /**
     * Sets the routing shortcut threshold to directly use a neighbor instead of
     * performing routing.
     * @param costThresh uint8_t The routing shortcut threshold to configure.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetRoutingShortcutThreshold(costThresh: number): Promise<SLStatus>;
    /**
     * Gets the routing shortcut threshold used to differentiate between directly
     * using a neighbor vs. performing routing.
     * @returns uint8_t The routing shortcut threshold
     */
    ezspGetRoutingShortcutThreshold(): Promise<number>;
    /**
     * Returns the number of active entries in the neighbor table.
     * @returns uint8_t The number of active entries in the neighbor table.
     */
    ezspNeighborCount(): Promise<number>;
    /**
     * Returns the route table entry at the given index. The route table size can be
     * obtained using the getConfigurationValue command.
     * @param index uint8_t The index of the route table entry of interest.
     * @returns
     * - SLStatus.FAIL if the index is out of range or the device is an end
     * - SLStatus.OK otherwise.
     * @returns EmberRouteTableEntry * The contents of the route table entry.
     */
    ezspGetRouteTableEntry(index: number): Promise<[SLStatus, value: EmberRouteTableEntry]>;
    /**
     * Sets the radio output power at which a node is operating. Ember radios have
     * discrete power settings. For a list of available power settings, see the
     * technical specification for the RF communication module in your Developer
     * Kit. Note: Care should be taken when using this API on a running network, as
     * it will directly impact the established link qualities neighboring nodes have
     * with the node on which it is called. This can lead to disruption of existing
     * routes and erratic network behavior.
     * @param power int8_t Desired radio output power, in dBm.
     * @returns An SLStatus value indicating the success or failure of the command.
     */
    ezspSetRadioPower(power: number): Promise<SLStatus>;
    /**
     * Sets the channel to use for sending and receiving messages. For a list of
     * available radio channels, see the technical specification for the RF
     * communication module in your Developer Kit. Note: Care should be taken when
     * using this API, as all devices on a network must use the same channel.
     * @param channel uint8_t Desired radio channel.
     * @returns An SLStatus value indicating the success or failure of the command.
     */
    ezspSetRadioChannel(channel: number): Promise<SLStatus>;
    /**
     * Gets the channel in use for sending and receiving messages.
     * @returns uint8_t Current radio channel.
     */
    ezspGetRadioChannel(): Promise<number>;
    /**
     * Set the configured 802.15.4 CCA mode in the radio.
     * @param ccaMode uint8_t A RAIL_IEEE802154_CcaMode_t value.
     * @returns An SLStatus value indicating the success or failure of the command.
     */
    ezspSetRadioIeee802154CcaMode(ccaMode: IEEE802154CcaMode): Promise<SLStatus>;
    /**
     * Enable/disable concentrator support.
     * @param on If this bool is true the concentrator support is enabled. Otherwise is disabled.
     *        If this bool is false all the other arguments are ignored.
     * @param concentratorType uint16_t Must be either EMBER_HIGH_RAM_CONCENTRATOR or EMBER_LOW_RAM_CONCENTRATOR.
     *        The former is used when the caller has enough memory to store source routes for the whole network.
     *        In that case, remote nodes stop sending route records once the concentrator has successfully received one.
     *        The latter is used when the concentrator has insufficient RAM to store all outbound source routes.
     *        In that case, route records are sent to the concentrator prior to every inbound APS unicast.
     * @param minTime uint16_t The minimum amount of time that must pass between MTORR broadcasts.
     * @param maxTime uint16_t The maximum amount of time that can pass between MTORR broadcasts.
     * @param routeErrorThreshold uint8_t The number of route errors that will trigger a re-broadcast of the MTORR.
     * @param deliveryFailureThreshold uint8_t The number of APS delivery failures that will trigger a re-broadcast of the MTORR.
     * @param maxHops uint8_t The maximum number of hops that the MTORR broadcast will be allowed to have.
     *        A value of 0 will be converted to the EMBER_MAX_HOPS value set by the stack.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetConcentrator(on: boolean, concentratorType: number, minTime: number, maxTime: number, routeErrorThreshold: number, deliveryFailureThreshold: number, maxHops: number): Promise<SLStatus>;
    /**
     * Starts periodic many-to-one route discovery.
     * Periodic discovery is started by default on bootup, but this function may be used if discovery
     * has been stopped by a call to ::ezspConcentratorStopDiscovery().
     */
    ezspConcentratorStartDiscovery(): Promise<void>;
    /**
     * Stops periodic many-to-one route discovery.
     */
    ezspConcentratorStopDiscovery(): Promise<void>;
    /**
     * Notes when a route error has occurred.
     * @param status
     * @param nodeId
     */
    ezspConcentratorNoteRouteError(status: SLStatus, nodeId: NodeId): Promise<void>;
    /**
     * Sets the error code that is sent back from a router with a broken route.
     * @param errorCode uint8_t Desired error code.
     * @returns An SLStatus value indicating the success or failure of the command.
     */
    ezspSetBrokenRouteErrorCode(errorCode: number): Promise<SLStatus>;
    /**
     * This causes to initialize the desired radio interface other than native and
     * form a new network by becoming the coordinator with same panId as native
     * radio network.
     * @param phyIndex uint8_t Index of phy interface. The native phy index would be always zero hence valid phy index starts from one.
     * @param page uint8_t Desired radio channel page.
     * @param channel uint8_t Desired radio channel.
     * @param power int8_t Desired radio output power, in dBm.
     * @param bitmask Network configuration bitmask.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspMultiPhyStart(phyIndex: number, page: number, channel: number, power: number, bitmask: EmberMultiPhyNwkConfig): Promise<SLStatus>;
    /**
     * This causes to bring down the radio interface other than native.
     * @param phyIndex uint8_t Index of phy interface. The native phy index would be always zero hence valid phy index starts from one.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspMultiPhyStop(phyIndex: number): Promise<SLStatus>;
    /**
     * Sets the radio output power for desired phy interface at which a node is
     * operating. Ember radios have discrete power settings. For a list of available
     * power settings, see the technical specification for the RF communication
     * module in your Developer Kit. Note: Care should be taken when using this api
     * on a running network, as it will directly impact the established link
     * qualities neighboring nodes have with the node on which it is called. This
     * can lead to disruption of existing routes and erratic network behavior.
     * @param phyIndex uint8_t Index of phy interface. The native phy index would be always zero hence valid phy index starts from one.
     * @param power int8_t Desired radio output power, in dBm.
     * @returns An SLStatus value indicating the success or failure of the command.
     */
    ezspMultiPhySetRadioPower(phyIndex: number, power: number): Promise<SLStatus>;
    /**
     * Send Link Power Delta Request from a child to its parent
     * @returns An SLStatus value indicating the success or failure of the command.
     */
    ezspSendLinkPowerDeltaRequest(): Promise<SLStatus>;
    /**
     * Sets the channel for desired phy interface to use for sending and receiving
     * messages. For a list of available radio pages and channels, see the technical
     * specification for the RF communication module in your Developer Kit. Note:
     * Care should be taken when using this API, as all devices on a network must
     * use the same page and channel.
     * @param phyIndex uint8_t Index of phy interface. The native phy index would be always zero hence valid phy index starts from one.
     * @param page uint8_t Desired radio channel page.
     * @param channel uint8_t Desired radio channel.
     * @returns An SLStatus value indicating the success or failure of the command.
     */
    ezspMultiPhySetRadioChannel(phyIndex: number, page: number, channel: number): Promise<SLStatus>;
    /**
     * Obtains the current duty cycle state.
     * @returns An SLStatus value indicating the success or failure of the command.
     * @returns EmberDutyCycleState * The current duty cycle state in effect.
     */
    ezspGetDutyCycleState(): Promise<[SLStatus, returnedState: EmberDutyCycleState]>;
    /**
     * Set the current duty cycle limits configuration. The Default limits set by
     * stack if this call is not made.
     * @param limits EmberDutyCycleLimits * The duty cycle limits configuration to utilize.
     * @returns
     * - SLStatus.OK if the duty cycle limit configurations set successfully,
     * - SLStatus.INVALID_PARAMETER if set illegal value such as setting only one of the limits to default
     *   or violates constraints Susp > Crit > Limi,
     * - SLStatus.INVALID_STATE if device is operating on 2.4Ghz
     */
    ezspSetDutyCycleLimitsInStack(limits: EmberDutyCycleLimits): Promise<SLStatus>;
    /**
     * Obtains the current duty cycle limits that were previously set by a call to emberSetDutyCycleLimitsInStack(),
     * or the defaults set by the stack if no set call was made.
     * @returns An SLStatus value indicating the success or failure of the command.
     * @returns EmberDutyCycleLimits * Return current duty cycle limits if returnedLimits is not NULL
     */
    ezspGetDutyCycleLimits(): Promise<[SLStatus, returnedLimits: EmberDutyCycleLimits]>;
    /**
     * Returns the duty cycle of the stack's connected children that are being
     * monitored, up to maxDevices. It indicates the amount of overall duty cycle
     * they have consumed (up to the suspend limit). The first entry is always the
     * local stack's nodeId, and thus the total aggregate duty cycle for the device.
     * The passed pointer arrayOfDeviceDutyCycles MUST have space for maxDevices.
     * @param maxDevices uint8_t Number of devices to retrieve consumed duty cycle.
     * @returns
     * - SLStatus.OK  if the duty cycles were read successfully,
     * - SLStatus.INVALID_PARAMETER maxDevices is greater than SL_ZIGBEE_MAX_END_DEVICE_CHILDREN + 1.
     * @returns uint8_t * Consumed duty cycles up to maxDevices. When the number of children that are being monitored is less than maxDevices,
     *          the NodeId element in the EmberPerDeviceDutyCycle will be 0xFFFF.
     */
    ezspGetCurrentDutyCycle(maxDevices: number): Promise<[SLStatus, arrayOfDeviceDutyCycles: number[]]>;
    /**
     * Callback
     * Callback fires when the duty cycle state has changed
     * @param channelPage uint8_t The channel page whose duty cycle state has changed.
     * @param channel uint8_t The channel number whose duty cycle state has changed.
     * @param state The current duty cycle state.
     * @param totalDevices uint8_t The total number of connected end devices that are being monitored for duty cycle.
     * @param arrayOfDeviceDutyCycles EmberPerDeviceDutyCycle * Consumed duty cycles of end devices that are being monitored.
     *        The first entry always be the local stack's nodeId, and thus the total aggregate duty cycle for the device.
     */
    ezspDutyCycleHandler(channelPage: number, channel: number, state: EmberDutyCycleState, totalDevices: number, arrayOfDeviceDutyCycles: EmberPerDeviceDutyCycle[]): void;
    /**
     * Configure the number of beacons to store when issuing active scans for networks.
     * @param numBeacons uint8_t The number of beacons to cache when scanning.
     * @returns
     * - SLStatus.INVALID_PARAMETER if numBeacons is greater than SL_ZIGBEE_MAX_BEACONS_TO_STORE
     * - SLStatus.OK
     */
    ezspSetNumBeaconToStore(numBeacons: number): Promise<SLStatus>;
    /**
     * Fetches the specified beacon in the cache. Beacons are stored in cache after issuing an active scan.
     * @param beaconNumber uint8_t The beacon index to fetch. Valid values range from 0 to ezspGetNumStoredBeacons-1.
     * @returns An appropriate SLStatus status code.
     * @returns EmberBeaconData * The beacon to populate upon success.
     */
    ezspGetStoredBeacon(beaconNumber: number): Promise<[SLStatus, beacon: EmberBeaconData]>;
    /**
     * Returns the number of cached beacons that have been collected from a scan.
     * @returns uint8_t The number of cached beacons that have been collected from a scan.
     */
    ezspGetNumStoredBeacons(): Promise<number>;
    /**
     * Clears all cached beacons that have been collected from a scan.
     * @returns An SLStatus value indicating success or the reason for failure. Always `OK` in v13-.
     */
    ezspClearStoredBeacons(): Promise<SLStatus>;
    /**
     * This call sets the radio channel in the stack and propagates the information
     * to the hardware.
     * @param radioChannel uint8_t The radio channel to be set.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetLogicalAndRadioChannel(radioChannel: number): Promise<SLStatus>;
    /**
     * Form a new sleepy-to-sleepy network.
     * If the network is using security, the device must call sli_zigbee_stack_set_initial_security_state() first.
     * @param parameters Specification of the new network.
     * @param initiator Whether this device is initiating or joining the network.
     * @returns An SLStatus value indicating success or a reason for failure.
     */
    ezspSleepyToSleepyNetworkStart(parameters: EmberNetworkParameters, initiator: boolean): Promise<SLStatus>;
    /**
     * Send a Zigbee NWK Leave command to the destination.
     * @param destination Node ID of the device being told to leave.
     * @param flags Bitmask indicating additional considerations for the leave request.
     * @returns Status indicating success or a reason for failure. Call is invalid if destination is on network or is the local node.
     */
    ezspSendZigbeeLeave(destination: PanId, flags: Zdo.LeaveRequestFlags): Promise<SLStatus>;
    /**
     * Indicate the state of permit joining in MAC.
     * @returns Whether the current network permits joining.
     */
    ezspGetPermitJoining(): Promise<boolean>;
    /**
     * Get the 8-byte extended PAN ID of this node.
     * @returns Extended PAN ID of this node. Valid only if it is currently on a network.
     */
    ezspGetExtendedPanId(): Promise<ExtendedPanId>;
    /**
     * Get the current network.
     * @returns Return the current network index.
     */
    ezspGetCurrentNetwork(): Promise<number>;
    /**
     * Set initial outgoing link cost for neighbor.
     * @param cost The new default cost. Valid values are 0, 1, 3, 5, and 7.
     * @returns Whether or not initial cost was successfully set.
     */
    ezspSetInitialNeighborOutgoingCost(cost: number): Promise<SLStatus>;
    /**
     * Get initial outgoing link cost for neighbor.
     * @returns The default cost associated with new neighbor's outgoing links.
     */
    ezspGetInitialNeighborOutgoingCost(): Promise<number>;
    /**
     * Indicate whether a rejoining neighbor should have its incoming frame counter reset.
     * @param reset
     */
    ezspResetRejoiningNeighborsFrameCounter(reset: boolean): Promise<void>;
    /**
     * Check whether a rejoining neighbor will have its incoming frame counter reset based on the currently set policy.
     * @returns Whether or not a rejoining neighbor's incoming FC gets reset (true or false).
     */
    ezspIsResetRejoiningNeighborsFrameCounterEnabled(): Promise<boolean>;
    /**
     * Deletes all binding table entries.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspClearBindingTable(): Promise<SLStatus>;
    /**
     * Sets an entry in the binding table.
     * @param index uint8_t The index of a binding table entry.
     * @param value EmberBindingTableEntry * The contents of the binding entry.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetBinding(index: number, value: EmberBindingTableEntry): Promise<SLStatus>;
    /**
     * Gets an entry from the binding table.
     * @param index uint8_t The index of a binding table entry.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberBindingTableEntry * The contents of the binding entry.
     */
    ezspGetBinding(index: number): Promise<[SLStatus, value: EmberBindingTableEntry]>;
    /**
     * Deletes a binding table entry.
     * @param index uint8_t The index of a binding table entry.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspDeleteBinding(index: number): Promise<SLStatus>;
    /**
     * Indicates whether any messages are currently being sent using this binding
     * table entry. Note that this command does not indicate whether a binding is
     * clear. To determine whether a binding is clear, check whether the type field
     * of the EmberBindingTableEntry has the value EMBER_UNUSED_BINDING.
     * @param index uint8_t The index of a binding table entry.
     * @returns True if the binding table entry is active, false otherwise.
     */
    ezspBindingIsActive(index: number): Promise<boolean>;
    /**
     * Returns the node ID for the binding's destination, if the ID is known. If a
     * message is sent using the binding and the destination's ID is not known, the
     * stack will discover the ID by broadcasting a ZDO address request. The
     * application can avoid the need for this discovery by using
     * setBindingRemoteNodeId when it knows the correct ID via some other means. The
     * destination's node ID is forgotten when the binding is changed, when the
     * local node reboots or, much more rarely, when the destination node changes
     * its ID in response to an ID conflict.
     * @param index uint8_t The index of a binding table entry.
     * @returns The short ID of the destination node or EMBER_NULL_NODE_ID if no destination is known.
     */
    ezspGetBindingRemoteNodeId(index: number): Promise<NodeId>;
    /**
     * Set the node ID for the binding's destination. See getBindingRemoteNodeId for
     * a description.
     * @param index uint8_t The index of a binding table entry.
     * @param The short ID of the destination node.
     */
    ezspSetBindingRemoteNodeId(index: number, nodeId: NodeId): Promise<void>;
    /**
     * Callback
     * The NCP used the external binding modification policy to decide how to handle
     * a remote set binding request. The Host cannot change the current decision,
     * but it can change the policy for future decisions using the setPolicy
     * command.
     * @param entry EmberBindingTableEntry * The requested binding.
     * @param index uint8_t The index at which the binding was added.
     * @param policyDecision SLStatus.OK if the binding was added to the table and any other status if not.
     */
    ezspRemoteSetBindingHandler(entry: EmberBindingTableEntry, index: number, policyDecision: SLStatus): void;
    /**
     * Callback
     * The NCP used the external binding modification policy to decide how to handle
     * a remote delete binding request. The Host cannot change the current decision,
     * but it can change the policy for future decisions using the setPolicy
     * command.
     * @param index uint8_t The index of the binding whose deletion was requested.
     * @param policyDecision SLStatus.OK if the binding was removed from the table and any other status if not.
     */
    ezspRemoteDeleteBindingHandler(index: number, policyDecision: SLStatus): void;
    /**
     * Returns the maximum size of the payload. The size depends on the security level in use.
     * @returns uint8_t The maximum APS payload length.
     */
    ezspMaximumPayloadLength(): Promise<number>;
    /**
     * Sends a unicast message as per the Zigbee specification.
     * The message will arrive at its destination only if there is a known route to the destination node.
     * Setting the ENABLE_ROUTE_DISCOVERY option will cause a route to be discovered if none is known.
     * Setting the FORCE_ROUTE_DISCOVERY option will force route discovery.
     * Routes to end-device children of the local node are always known.
     * Setting the APS_RETRY option will cause the message to be retransmitted until either a matching acknowledgement is received
     * or three transmissions have been made.
     * Note: Using the FORCE_ROUTE_DISCOVERY option will cause the first transmission to be consumed by a route request as part of discovery,
     * so the application payload of this packet will not reach its destination on the first attempt. If you want the packet to reach its destination,
     * the APS_RETRY option must be set so that another attempt is made to transmit the message with its application payload
     * after the route has been constructed.
     * Note: When sending fragmented messages, the stack will only assign a new APS sequence number for the first fragment of the message
     * (i.e., SL_ZIGBEE_APS_OPTION_FRAGMENT is set and the low-order byte of the groupId field in the APS frame is zero).
     * For all subsequent fragments of the same message, the application must set the sequence number field in the APS frame
     * to the sequence number assigned by the stack to the first fragment.
     * @param type Specifies the outgoing message type.
     *        Must be one of EMBER_OUTGOING_DIRECT, EMBER_OUTGOING_VIA_ADDRESS_TABLE, or EMBER_OUTGOING_VIA_BINDING.
     * @param indexOrDestination Depending on the type of addressing used, this is either the NodeId of the destination,
     *        an index into the address table, or an index into the binding table.
     * @param apsFrame EmberApsFrame * The APS frame which is to be added to the message.
     * @param messageTag uint8_t (v14+: uint16_t) A value chosen by the Host.
     *        This value is used in the ezspMessageSentHandler response to refer to this message.
     * @param messageContents uint8_t * Content of the message.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns uint8_t * The sequence number that will be used when this message is transmitted.
     */
    ezspSendUnicast(type: EmberOutgoingMessageType, indexOrDestination: NodeId, apsFrame: EmberApsFrame, messageTag: number, messageContents: Buffer): Promise<[SLStatus, apsSequence: number]>;
    /**
     * Sends a broadcast message as per the Zigbee specification.
     * @param alias uint16_t (unused in v13-) The aliased source from which we send the broadcast.
     *        This must be SL_ZIGBEE_NULL_NODE_ID if we do not need an aliased source
     * @param destination The destination to which to send the broadcast. This must be one of the three Zigbee broadcast addresses.
     * @param nwkSequence uint8_t (unused in v13-) The alias nwk sequence number. This won't be used if there is no aliased source.
     * @param apsFrame EmberApsFrame * The APS frame for the message.
     * @param radius uint8_t The message will be delivered to all nodes within radius hops of the sender.
     *        A radius of zero is converted to EMBER_MAX_HOPS.
     * @param messageTag uint8_t (v14+: uint16_t) A value chosen by the Host.
     *        This value is used in the ezspMessageSentHandler response to refer to this message.
     * @param messageContents uint8_t * The broadcast message.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns uint8_t * The sequence number that will be used when this message is transmitted.
     */
    ezspSendBroadcast(alias: NodeId, destination: NodeId, nwkSequence: number, apsFrame: EmberApsFrame, radius: number, messageTag: number, messageContents: Buffer): Promise<[SLStatus, apsSequence: number]>;
    /**
     * Sends proxied broadcast message for another node in conjunction with sl_zigbee_proxy_broadcast
     * where a long source is also specified in the NWK frame control.
     * @param euiSource The long source from which to send the broadcast
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspProxyNextBroadcastFromLong(euiSource: Eui64): Promise<SLStatus>;
    /**
     * Sends a multicast message to all endpoints that share a specific multicast ID and are within a specified number of hops of the sender.
     * @param apsFrame EmberApsFrame * The APS frame for the message. The multicast will be sent to the groupId in this frame.
     * @param hops uint8_t The message will be delivered to all nodes within this number of hops of the sender.
     *        A value of zero is converted to EMBER_MAX_HOPS.
     * @param broadcastAddr uint16_t (unused in v13-) The number of hops that the message will be forwarded by devices
     *        that are not members of the group.
     *        A value of 7 or greater is treated as infinite.
     * @param alias uint16_t (unused in v13-) The alias source address. This must be SL_ZIGBEE_NULL_NODE_ID if we do not need an aliased source
     * @param nwkSequence uint8_t (unused in v13-) The alias sequence number. This won't be used if there is no aliased source.
     * @param messageTag uint8_t (v14+: uint16_t) A value chosen by the Host.
     *        This value is used in the ezspMessageSentHandler response to refer to this message.
     * @param messageContents uint8_t * The multicast message.
     * @returns An SLStatus value. For any result other than SLStatus.OK, the message will not be sent.
     * - SLStatus.OK - The message has been submitted for transmission.
     * - SLStatus.INVALID_INDEX - The bindingTableIndex refers to a non-multicast binding.
     * - SLStatus.NETWORK_DOWN - The node is not part of a network.
     * - SLStatus.MESSAGE_TOO_LONG - The message is too large to fit in a MAC layer frame.
     * - SLStatus.ALLOCATION_FAILED - The free packet buffer pool is empty.
     * - SLStatus.BUSY - Insufficient resources available in Network or MAC layers to send message.
     * @returns uint8_t * The sequence number that will be used when this message is transmitted.
     */
    ezspSendMulticast(apsFrame: EmberApsFrame, hops: number, broadcastAddr: number, alias: NodeId, nwkSequence: number, messageTag: number, messageContents: Buffer): Promise<[SLStatus, apsSequence: number]>;
    /**
     * Sends a reply to a received unicast message. The incomingMessageHandler
     * callback for the unicast being replied to supplies the values for all the
     * parameters except the reply itself.
     * @param sender Value supplied by incoming unicast.
     * @param apsFrame EmberApsFrame * Value supplied by incoming unicast.
     * @param uint8_t The length of the messageContents parameter in bytes.
     * @param uint8_t * The reply message.
     * @returns
     * - SLStatus.INVALID_STATE - The SL_ZIGBEE_EZSP_UNICAST_REPLIES_POLICY is set to SL_ZIGBEE_EZSP_HOST_WILL_NOT_SUPPLY_REPLY.
     *   This means the NCP will automatically send an empty reply. The Host must change
     *   the policy to SL_ZIGBEE_EZSP_HOST_WILL_SUPPLY_REPLY before it can supply the reply.
     *   There is one exception to this rule: In the case of responses to message
     *   fragments, the host must call sendReply when a message fragment is received.
     *   In this case, the policy set on the NCP does not matter. The NCP expects a
     *   sendReply call from the Host for message fragments regardless of the current
     *   policy settings.
     * - SLStatus.ALLOCATION_FAILED - Not enough memory was available to send the reply.
     * - SLStatus.BUSY - Either no route or insufficient resources available.
     * - SLStatus.OK - The reply was successfully queued for transmission.
     */
    ezspSendReply(sender: NodeId, apsFrame: EmberApsFrame, messageContents: Buffer): Promise<SLStatus>;
    /**
     * Callback
     * A callback indicating the stack has completed sending a message.
     * @param status
     * - SL_STATUS_OK if an ACK was received from the destination
     * - SL_STATUS_ZIGBEE_DELIVERY_FAILED if no ACK was received.
     * @param type The type of message sent.
     * @param indexOrDestination uint16_t The destination to which the message was sent, for direct unicasts,
     *        or the address table or binding index for other unicasts. The value is unspecified for multicasts and broadcasts.
     * @param apsFrame EmberApsFrame * The APS frame for the message.
     * @param messageTag uint8_t The value supplied by the Host in the ezspSendUnicast, ezspSendBroadcast or ezspSendMulticast command.
     * @param messageContents uint8_t * The unicast message supplied by the Host. The message contents are only included here if the decision
     *        for the messageContentsInCallback policy is messageTagAndContentsInCallback.
     */
    ezspMessageSentHandler(status: SLStatus, type: EmberOutgoingMessageType, indexOrDestination: number, apsFrame: EmberApsFrame, messageTag: number, messageContents?: Buffer): void;
    /**
     * Sends a route request packet that creates routes from every node in the
     * network back to this node. This function should be called by an application
     * that wishes to communicate with many nodes, for example, a gateway, central
     * monitor, or controller. A device using this function was referred to as an
     * 'aggregator' in EmberZNet 2.x and earlier, and is referred to as a
     * 'concentrator' in the Zigbee specification and EmberZNet 3.  This function
     * enables large scale networks, because the other devices do not have to
     * individually perform bandwidth-intensive route discoveries. Instead, when a
     * remote node sends an APS unicast to a concentrator, its network layer
     * automatically delivers a special route record packet first, which lists the
     * network ids of all the intermediate relays. The concentrator can then use
     * source routing to send outbound APS unicasts. (A source routed message is one
     * in which the entire route is listed in the network layer header.) This allows
     * the concentrator to communicate with thousands of devices without requiring
     * large route tables on neighboring nodes.  This function is only available in
     * Zigbee Pro (stack profile 2), and cannot be called on end devices. Any router
     * can be a concentrator (not just the coordinator), and there can be multiple
     * concentrators on a network.  Note that a concentrator does not automatically
     * obtain routes to all network nodes after calling this function. Remote
     * applications must first initiate an inbound APS unicast.  Many-to-one routes
     * are not repaired automatically. Instead, the concentrator application must
     * call this function to rediscover the routes as necessary, for example, upon
     * failure of a retried APS message. The reason for this is that there is no
     * scalable one-size-fits-all route repair strategy. A common and recommended
     * strategy is for the concentrator application to refresh the routes by calling
     * this function periodically.
     * @param concentratorType uint16_t Must be either EMBER_HIGH_RAM_CONCENTRATOR or EMBER_LOW_RAM_CONCENTRATOR.
     *        The former is used when the caller has enough memory to store source routes for the whole network.
     *        In that case, remote nodes stop sending route records once the concentrator has successfully received one.
     *        The latter is used when the concentrator has insufficient RAM to store all outbound source routes.
     *        In that case, route records are sent to the concentrator prior to every inbound APS unicast.
     * @param radius uint8_t The maximum number of hops the route request will be relayed. A radius of zero is converted to EMBER_MAX_HOPS
     * @returns
     * - SLStatus.OK if the route request was successfully submitted to the transmit queue,
     * - SLStatus.FAIL otherwise.
     */
    ezspSendManyToOneRouteRequest(concentratorType: number, radius: number): Promise<SLStatus>;
    /**
     * Periodically request any pending data from our parent. Setting interval to 0
     * or units to EMBER_EVENT_INACTIVE will generate a single poll.
     * @param interval uint16_t The time between polls. Note that the timer clock is free running and is not synchronized with this command.
     *        This means that the time will be between interval and (interval - 1). The maximum interval is 32767.
     * @param units The units for interval.
     * @param failureLimit uint8_t The number of poll failures that will be tolerated before a pollCompleteHandler callback is generated.
     *        A value of zero will result in a callback for every poll. Any status value apart from EMBER_SUCCESS
     *        and EMBER_MAC_NO_DATA is counted as a failure.
     * @returns The result of sending the first poll.
     */
    ezspPollForData(interval: number, units: EmberEventUnits, failureLimit: number): Promise<SLStatus>;
    /**
     * Callback
     * Indicates the result of a data poll to the parent of the local node.
     * @param status An SLStatus value:
     * - SLStatus.OK - Data was received in response to the poll.
     * - SLStatus.MAC_NO_DATA - No data was pending.
     * - SLStatus.ZIGBEE_DELIVERY_FAILED - The poll message could not be sent.
     * - SLStatus.MAC_NO_ACK_RECEIVED - The poll message was sent but not acknowledged by the parent.
     */
    ezspPollCompleteHandler(status: SLStatus): void;
    /**
     * Set a flag to indicate that a message is pending for a child.
     * The next time that the child polls, it will be informed that it has a pending message.
     * The message is sent from emberPollHandler, which is called when the child requests data.
     * @param childId The ID of the child that just polled for data.
     * @returns
     * - SLStatus.OK - The next time that the child polls, it will be informed that it has pending data.
     * - SLStatus.NOT_JOINED - The child identified by childId is not our child.
     */
    ezspSetMessageFlag(childId: NodeId): Promise<SLStatus>;
    /**
     * Clear a flag to indicate that there are no more messages for a child.
     * The next time the child polls, it will be informed that it does not have any pending messages.
     * @param childId The ID of the child that no longer has pending messages.
     * @returns
     * - SLStatus.OK - The next time that the child polls, it will be informed that it does not have any pending messages.
     * - SLStatus.NOT_JOINED - The child identified by childId is not our child.
     */
    ezspClearMessageFlag(childId: NodeId): Promise<SLStatus>;
    /**
     * Callback
     * Indicates that the local node received a data poll from a child.
     * @param childId The node ID of the child that is requesting data.
     * @param transmitExpected True if transmit is expected, false otherwise.
     */
    ezspPollHandler(childId: NodeId, transmitExpected: boolean): void;
    /**
     * Add a child to the child/neighbor table only on SoC, allowing direct manipulation of these tables by the application.
     * This can affect the network functionality, and needs to be used wisely.
     * If used appropriately, the application can maintain more than the maximum of children provided by the stack.
     * @param shortId The preferred short ID of the node.
     * @param longId The long ID of the node.
     * @param nodeType The nodetype e.g., SL_ZIGBEE_ROUTER defining, if this would be added to the child table or neighbor table.
     * @returns
     * - SLStatus.OK - This node has been successfully added.
     * - SLStatus.FAIL - The child was not added to the child/neighbor table.
     */
    ezspAddChild(shortId: NodeId, longId: Eui64, nodeType: EmberNodeType): Promise<SLStatus>;
    /**
     * Remove a node from child/neighbor table only on SoC, allowing direct manipulation of these tables by the application.
     * This can affect the network functionality, and needs to be used wisely.
     * @param childEui64 The long ID of the node.
     * @returns
     * - SLStatus.OK - This node has been successfully removed.
     * - SLStatus.FAIL - The node was not found in either of the child or neighbor tables.
     */
    ezspRemoveChild(childEui64: Eui64): Promise<SLStatus>;
    /**
     * Remove a neighbor from neighbor table only on SoC, allowing direct manipulation of neighbor table by the application.
     * This can affect the network functionality, and needs to be used wisely.
     * @param shortId The short ID of the neighbor.
     * @param longId The long ID of the neighbor.
     */
    ezspRemoveNeighbor(shortId: NodeId, longId: Eui64): Promise<void>;
    /**
     * Callback
     * A callback indicating a message has been received.
     * @param type The type of the incoming message. One of the following: EMBER_INCOMING_UNICAST, EMBER_INCOMING_UNICAST_REPLY,
     *        EMBER_INCOMING_MULTICAST, EMBER_INCOMING_MULTICAST_LOOPBACK, EMBER_INCOMING_BROADCAST, EMBER_INCOMING_BROADCAST_LOOPBACK
     * @param apsFrame EmberApsFrame * The APS frame from the incoming message.
     * @param packetInfo Miscellanous message information.
     * @param messageContents uint8_t * The incoming message.
     */
    ezspIncomingMessageHandler(type: EmberIncomingMessageType, apsFrame: EmberApsFrame, packetInfo: EmberRxPacketInfo, messageContents: Buffer): void;
    /**
     * Sets source route discovery(MTORR) mode to on, off, reschedule
     * @param mode uint8_t Source route discovery mode: off:0, on:1, reschedule:2
     * @returns uint32_t Remaining time(ms) until next MTORR broadcast if the mode is on, MAX_INT32U_VALUE if the mode is off
     */
    ezspSetSourceRouteDiscoveryMode(mode: EmberSourceRouteDiscoveryMode): Promise<number>;
    /**
     * Callback
     * A callback indicating that a many-to-one route to the concentrator with the given short and long id is available for use.
     * @param NodeId The short id of the concentrator.
     * @param longId The EUI64 of the concentrator.
     * @param cost uint8_t The path cost to the concentrator. The cost may decrease as additional route request packets
     *        for this discovery arrive, but the callback is made only once.
     */
    ezspIncomingManyToOneRouteRequestHandler(source: NodeId, longId: Eui64, cost: number): void;
    /**
     * Callback
     * A callback invoked when a route error message is received.
     * The error indicates that a problem routing to or from the target node was encountered.
     *
     * A status of ::EMBER_SOURCE_ROUTE_FAILURE indicates that a source-routed unicast sent from this node encountered a broken link.
     * Note that this case occurs only if this node is a concentrator using many-to-one routing for inbound messages and source-routing for
     * outbound messages. The node prior to the broken link generated the route error message and returned it to us along the many-to-one route.
     *
     * A status of ::EMBER_MANY_TO_ONE_ROUTE_FAILURE also occurs only if the local device is a concentrator, and indicates that a unicast sent
     * to the local device along a many-to-one route encountered a broken link. The node prior to the broken link generated the route error
     * message and forwarded it to the local device via a randomly chosen neighbor, taking advantage of the many-to-one nature of the route.
     *
     * A status of ::EMBER_MAC_INDIRECT_TIMEOUT indicates that a message sent to the target end device could not be delivered by the parent
     * because the indirect transaction timer expired. Upon receipt of the route error, the stack sets the extended timeout for the target node
     * in the address table, if present. It then calls this handler to indicate receipt of the error.
     *
     * Note that if the original unicast data message is sent using the ::EMBER_APS_OPTION_RETRY option, a new route error message is generated
     * for each failed retry. Therefore, it is not unusual to receive three route error messages in succession for a single failed retried APS
     * unicast. On the other hand, it is also not guaranteed that any route error messages will be delivered successfully at all.
     * The only sure way to detect a route failure is to use retried APS messages and to check the status of the ::emberMessageSentHandler().
     *
     * @param status ::EMBER_SOURCE_ROUTE_FAILURE, ::EMBER_MANY_TO_ONE_ROUTE_FAILURE, ::EMBER_MAC_INDIRECT_TIMEOUT
     * @param target The short id of the remote node.
     */
    ezspIncomingRouteErrorHandler(status: SLStatus, target: NodeId): void;
    /**
     * Callback
     * A callback invoked when a network status/route error message is received.
     * The error indicates that there was a problem sending/receiving messages from the target node.
     *
     * Note: Network analyzer may flag this message as "route error" which is the old name for the "network status" command.
     *
     * This handler is a superset of ezspIncomingRouteErrorHandler. The old API was only invoking the handler for a couple of the possible
     * error codes and these were being translated into EmberStatus.
     *
     * @param errorCode uint8_t One byte over-the-air error code from network status message
     * @param target The short ID of the remote node
     */
    ezspIncomingNetworkStatusHandler(errorCode: EmberStackError, target: NodeId): void;
    /**
     * Callback
     * Reports the arrival of a route record command frame.
     * @param NodeId The source of the route record.
     * @param EUI64 The EUI64 of the source.
     * @param lastHopLqi uint8_t The link quality from the node that last relayed the route record.
     * @param lastHopRssi int8_t The energy level (in units of dBm) observed during the reception.
     * @param uint8_t The number of relays in relayList.
     * @param relayList uint8_t * The route record. Each relay in the list is an uint16_t node ID.
     *        The list is passed as uint8_t * to avoid alignment problems.
     */
    ezspIncomingRouteRecordHandler(source: NodeId, sourceEui: Eui64, lastHopLqi: number, lastHopRssi: number, relayCount: number, relayList: number[]): void;
    /**
     * Send the network key to a destination.
     * @param targetShort The destination node of the key.
     * @param targetLong The long address of the destination node.
     * @param parentShortId The parent node of the destination node.
     * @returns SLStatus.OK if send was successful
     */
    ezspUnicastCurrentNetworkKey(targetShort: NodeId, targetLong: Eui64, parentShortId: NodeId): Promise<SLStatus>;
    /**
     * Indicates whether any messages are currently being sent using this address
     * table entry. Note that this function does not indicate whether the address
     * table entry is unused. To determine whether an address table entry is unused,
     * check the remote node ID. The remote node ID will have the value
     * EMBER_TABLE_ENTRY_UNUSED_NODE_ID when the address table entry is not in use.
     * @param uint8_tThe index of an address table entry.
     * @returns True if the address table entry is active, false otherwise.
     */
    ezspAddressTableEntryIsActive(addressTableIndex: number): Promise<boolean>;
    /**
     * Sets the EUI64 and short ID of an address table entry.
     * Usually the application will not need to set the short ID in the address table.
     * Once the remote EUI64 is set the stack is capable of figuring out the short ID on its own.
     * However, in cases where the application does set the short ID, the application must set the remote EUI64 prior to setting the short ID.
     * This function will also check other address table entries, the child table and the neighbor table to see
     * if the node ID for the given EUI64 is already known.
     * If known then this function will set node ID. If not known it will set the node ID to SL_ZIGBEE_UNKNOWN_NODE_ID.
     * @param addressTableIndex
     * @param eui64
     * @param id
     * @returns
     * - SLStatus.OK if the information was successfully set,
     * - SLStatus.ZIGBEE_ADDRESS_TABLE_ENTRY_IS_ACTIVE otherwise.
     */
    ezspSetAddressTableInfo(addressTableIndex: number, eui64: Eui64, id: NodeId): Promise<SLStatus>;
    /**
     * Gets the EUI64 and short ID of an address table entry.
     * @param addressTableIndex
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns One of the following:
     * - The short ID corresponding to the remote node whose EUI64 is stored in the address table at the given index.
     * - SL_ZIGBEE_UNKNOWN_NODE_ID:
     *   Indicates that the EUI64 stored in the address table at the given index is valid but the short ID is currently unknown.
     * - SL_ZIGBEE_DISCOVERY_ACTIVE_NODE_ID:
     *   Indicates that the EUI64 stored in the address table at the given location is valid and network address discovery is underway.
     * - SL_ZIGBEE_TABLE_ENTRY_UNUSED_NODE_ID:
     *   Indicates that the entry stored in the address table at the given index is not in use.
     * @returns The EUI64 of the address table entry is copied to this location.
     */
    ezspGetAddressTableInfo(addressTableIndex: number): Promise<[SLStatus, nodeId: NodeId, eui64: Eui64]>;
    /**
     * Tells the stack whether or not the normal interval between retransmissions of a retried unicast message should
     * be increased by EMBER_INDIRECT_TRANSMISSION_TIMEOUT.
     * The interval needs to be increased when sending to a sleepy node so that the message is not retransmitted until the destination
     * has had time to wake up and poll its parent.
     * The stack will automatically extend the timeout:
     * - For our own sleepy children.
     * - When an address response is received from a parent on behalf of its child.
     * - When an indirect transaction expiry route error is received.
     * - When an end device announcement is received from a sleepy node.
     * @param remoteEui64 The address of the node for which the timeout is to be set.
     * @param extendedTimeout true if the retry interval should be increased by EMBER_INDIRECT_TRANSMISSION_TIMEOUT.
     *        false if the normal retry interval should be used.
     * @returns An SLStatus value indicating success or the reason for failure. Always `OK` in v13-.
     */
    ezspSetExtendedTimeout(remoteEui64: Eui64, extendedTimeout: boolean): Promise<SLStatus>;
    /**
     * Indicates whether or not the stack will extend the normal interval between
     * retransmissions of a retried unicast message by
     * EMBER_INDIRECT_TRANSMISSION_TIMEOUT.
     * @param remoteEui64 The address of the node for which the timeout is to be returned.
     * @returns
     * - SLStatus.OK if the retry interval will be increased by SL_ZIGBEE_INDIRECT_TRANSMISSION_TIMEOUT
     * - SLStatus.FAIL if the normal retry interval will be used.
     */
    ezspGetExtendedTimeout(remoteEui64: Eui64): Promise<SLStatus>;
    /**
     * Replaces the EUI64, short ID and extended timeout setting of an address table
     * entry. The previous EUI64, short ID and extended timeout setting are
     * returned.
     * @param addressTableIndex uint8_t The index of the address table entry that will be modified.
     * @param newEui64 The EUI64 to be written to the address table entry.
     * @param newId One of the following: The short ID corresponding to the new EUI64.
     *        SL_ZIGBEE_UNKNOWN_NODE_ID if the new EUI64 is valid but the short ID is unknown and should be discovered by the stack.
     *        SL_ZIGBEE_TABLE_ENTRY_UNUSED_NODE_ID if the address table entry is now unused.
     * @param newExtendedTimeout true if the retry interval should be increased by SL_ZIGBEE_INDIRECT_TRANSMISSION_TIMEOUT.
     *        false if the normal retry interval should be used.
     * @returns
     * - SLStatus.OK if the EUI64, short ID and extended timeout setting were successfully modified,
     * - SLStatus.ZIGBEE_ADDRESS_TABLE_ENTRY_IS_ACTIVE otherwise.
     * @returns oldEui64 The EUI64 of the address table entry before it was modified.
     * @returns oldId NodeId * One of the following: The short ID corresponding to the EUI64 before it was modified.
     *          SL_ZIGBEE_UNKNOWN_NODE_ID if the short ID was unknown. SL_ZIGBEE_DISCOVERY_ACTIVE_NODE_ID if discovery of the short ID was underway.
     *          SL_ZIGBEE_TABLE_ENTRY_UNUSED_NODE_ID if the address table entry was unused.
     * @returns oldExtendedTimeouttrue bool * if the retry interval was being increased by SL_ZIGBEE_INDIRECT_TRANSMISSION_TIMEOUT.
     *          false if the normal retry interval was being used.
     */
    ezspReplaceAddressTableEntry(addressTableIndex: number, newEui64: Eui64, newId: NodeId, newExtendedTimeout: boolean): Promise<[SLStatus, oldEui64: Eui64, oldId: NodeId, oldExtendedTimeout: boolean]>;
    /**
     * Returns the node ID that corresponds to the specified EUI64. The node ID is
     * found by searching through all stack tables for the specified EUI64.
     * @param eui64 The EUI64 of the node to look up.
     * @returns The short ID of the node or SL_ZIGBEE_NULL_NODE_ID if the short ID is not known.
     */
    ezspLookupNodeIdByEui64(eui64: Eui64): Promise<NodeId>;
    /**
     * Returns the EUI64 that corresponds to the specified node ID. The EUI64 is
     * found by searching through all stack tables for the specified node ID.
     * @param nodeId The short ID of the node to look up.
     * @returns
     * - SLStatus.OK if the EUI64 was found,
     * - SLStatus.FAIL if the EUI64 is not known.
     * @returns eui64 The EUI64 of the node.
     */
    ezspLookupEui64ByNodeId(nodeId: NodeId): Promise<[SLStatus, eui64: Eui64]>;
    /**
     * Gets an entry from the multicast table.
     * @param uint8_t The index of a multicast table entry.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberMulticastTableEntry * The contents of the multicast entry.
     */
    ezspGetMulticastTableEntry(index: number): Promise<[SLStatus, value: EmberMulticastTableEntry]>;
    /**
     * Sets an entry in the multicast table.
     * @param index uint8_t The index of a multicast table entry
     * @param EmberMulticastTableEntry * The contents of the multicast entry.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetMulticastTableEntry(index: number, value: EmberMulticastTableEntry): Promise<SLStatus>;
    /**
     * Callback
     * A callback invoked by the EmberZNet stack when an id conflict is discovered,
     * that is, two different nodes in the network were found to be using the same
     * short id. The stack automatically removes the conflicting short id from its
     * internal tables (address, binding, route, neighbor, and child tables). The
     * application should discontinue any other use of the id.
     * @param id The short id for which a conflict was detected
     */
    ezspIdConflictHandler(id: NodeId): void;
    /**
     * Write the current node Id, PAN ID, or Node type to the tokens
     * @param erase Erase the node type or not
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspWriteNodeData(erase: boolean): Promise<SLStatus>;
    /**
     * Transmits the given message without modification. The MAC header is assumed
     * to be configured in the message at the time this function is called.
     * @param messageContents uint8_t * The raw message.
     * @param priority uint8_t transmit priority.
     * @param useCca Should we enable CCA or not.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSendRawMessage(messageContents: Buffer, priority: EmberTransmitPriority, useCca: boolean): Promise<SLStatus>;
    /**
     * Callback
     * A callback invoked by the EmberZNet stack when a MAC passthrough message is
     * received.
     * @param messageType The type of MAC passthrough message received.
     * @param packetInfo Information about the incoming packet.
     * @param messageContents uint8_t * The raw message that was received.
     */
    ezspMacPassthroughMessageHandler(messageType: EmberMacPassthroughType, packetInfo: EmberRxPacketInfo, messageContents: Buffer): void;
    /**
     * Callback
     * A callback invoked by the EmberZNet stack when a raw MAC message that has
     * matched one of the application's configured MAC filters.
     * @param filterValueMatch uint16_t The value of the filter that was matched.
     *   - < v18: uint8_t The index of the filter that was matched.
     * @param legacyPassthroughType The type of MAC passthrough message received.
     * @param packetInfo Information about the incoming packet.
     * @param messageContents uint8_t * The raw message that was received.
     */
    ezspMacFilterMatchMessageHandler(filterValueMatch: number, legacyPassthroughType: EmberMacPassthroughType, packetInfo: EmberRxPacketInfo, messageContents: Buffer): void;
    /**
     * Callback
     * A callback invoked by the EmberZNet stack when the MAC has finished
     * transmitting a raw message.
     * @param messageContents (v14+)
     * @param status
     * - SLStatus.OK if the transmission was successful,
     * - SLStatus.ZIGBEE_DELIVERY_FAILED if not
     */
    ezspRawTransmitCompleteHandler(messageContents: Buffer, status: SLStatus): void;
    /**
     * This function is useful to sleepy end devices.
     * This function will set the retry interval (in milliseconds) for mac data poll.
     * This interval is the time in milliseconds the device waits before retrying a data poll when a MAC level
     * data poll fails for any reason.
     * @param waitBeforeRetryIntervalMs uint32_t Time in milliseconds the device waits before retrying
     *        a data poll when a MAC level data poll fails for any reason.
     */
    ezspSetMacPollFailureWaitTime(waitBeforeRetryIntervalMs: number): Promise<void>;
    /**
     * Returns the maximum number of no-ack retries that will be attempted
     * @returns Max MAC retries
     */
    ezspGetMaxMacRetries(): Promise<number>;
    /**
     * Sets the priority masks and related variables for choosing the best beacon.
     * @param param EmberBeaconClassificationParams * The beacon prioritization related variable
     * @returns The attempt to set the parameters returns SLStatus.OK
     */
    ezspSetBeaconClassificationParams(param: EmberBeaconClassificationParams): Promise<SLStatus>;
    /**
     * Gets the priority masks and related variables for choosing the best beacon.
     * @returns The attempt to get the parameters returns SLStatus.OK
     * @returns EmberBeaconClassificationParams * Gets the beacon prioritization related variable
     */
    ezspGetBeaconClassificationParams(): Promise<[SLStatus, param: EmberBeaconClassificationParams]>;
    /**
     * Indicate whether there are pending messages in the APS retry queue.
     * @returns True if there is a pending message for this network in the APS retry queue, false if not.
     */
    ezspPendingAckedMessages(): Promise<boolean>;
    /**
     * Reschedule sending link status message, with first one being sent immediately.
     * @returns
     */
    ezspRescheduleLinkStatusMsg(): Promise<SLStatus>;
    /**
     * Set the network update ID to the desired value. Must be called before joining or forming the network.
     * @param nwkUpdateId uint8_t Desired value of the network update ID.
     * @param setWhenOnNetwork Set to true in case change should also apply when on network.
     * @returns Status of set operation for the network update ID.
     */
    ezspSetNwkUpdateId(nwkUpdateId: number, setWhenOnNetwork: boolean): Promise<SLStatus>;
    /**
     * Sets the security state that will be used by the device when it forms or
     * joins the network. This call should not be used when restoring saved network
     * state via networkInit as this will result in a loss of security data and will
     * cause communication problems when the device re-enters the network.
     * @param state EmberInitialSecurityState * The security configuration to be set.
     * @returns The success or failure code of the operation.
     */
    ezspSetInitialSecurityState(state: EmberInitialSecurityState): Promise<SLStatus>;
    /**
     * Gets the current security state that is being used by a device that is joined
     * in the network.
     * @returns The success or failure code of the operation.
     * @returns EmberCurrentSecurityState * The security configuration in use by the stack.
     */
    ezspGetCurrentSecurityState(): Promise<[SLStatus, state: EmberCurrentSecurityState]>;
    /**
     * Exports a key from security manager based on passed context.
     * @param context sl_zb_sec_man_context_t * Metadata to identify the requested key.
     * @returns sl_zb_sec_man_key_t * Data to store the exported key in.
     * @returns SLStatus * The success or failure code of the operation.
     */
    ezspExportKey(context: SecManContext): Promise<[SLStatus, key: SecManKey]>;
    /**
     * Imports a key into security manager based on passed context.
     * @param context sl_zb_sec_man_context_t * Metadata to identify where the imported key should be stored.
     * @param key sl_zb_sec_man_key_t * The key to be imported.
     * @returns The success or failure code of the operation.
     */
    ezspImportKey(context: SecManContext, key: SecManKey): Promise<SLStatus>;
    /**
     * Callback
     * A callback to inform the application that the Network Key has been updated
     * and the node has been switched over to use the new key. The actual key being
     * used is not passed up, but the sequence number is.
     * @param sequenceNumber uint8_t The sequence number of the new network key.
     */
    ezspSwitchNetworkKeyHandler(sequenceNumber: number): void;
    /**
     * This function searches through the Key Table and tries to find the entry that
     * matches the passed search criteria.
     * @param address The address to search for. Alternatively, all zeros may be passed in to search for the first empty entry.
     * @param linkKey This indicates whether to search for an entry that contains a link key or a master key.
     *        true means to search for an entry with a Link Key.
     * @returns uint8_t This indicates the index of the entry that matches the search criteria.
     *          A value of 0xFF is returned if not matching entry is found.
     */
    ezspFindKeyTableEntry(address: Eui64, linkKey: boolean): Promise<number>;
    /**
     * This function sends an APS TransportKey command containing the current trust
     * center link key. The node to which the command is sent is specified via the
     * short and long address arguments.
     * @param destinationNodeId The short address of the node to which this command will be sent
     * @param destinationEui64 The long address of the node to which this command will be sent
     * @returns An SLStatus value indicating success of failure of the operation
     */
    ezspSendTrustCenterLinkKey(destinationNodeId: NodeId, destinationEui64: Eui64): Promise<SLStatus>;
    /**
     * This function erases the data in the key table entry at the specified index.
     * If the index is invalid, false is returned.
     * @param index uint8_t This indicates the index of entry to erase.
     * @returns The success or failure of the operation.
     */
    ezspEraseKeyTableEntry(index: number): Promise<SLStatus>;
    /**
     * This function clears the key table of the current network.
     * @returns The success or failure of the operation.
     */
    ezspClearKeyTable(): Promise<SLStatus>;
    /**
     * A function to request a Link Key from the Trust Center with another device on
     * the Network (which could be the Trust Center). A Link Key with the Trust
     * Center is possible but the requesting device cannot be the Trust Center. Link
     * Keys are optional in Zigbee Standard Security and thus the stack cannot know
     * whether the other device supports them. If EMBER_REQUEST_KEY_TIMEOUT is
     * non-zero on the Trust Center and the partner device is not the Trust Center,
     * both devices must request keys with their partner device within the time
     * period. The Trust Center only supports one outstanding key request at a time
     * and therefore will ignore other requests. If the timeout is zero then the
     * Trust Center will immediately respond and not wait for the second request.
     * The Trust Center will always immediately respond to requests for a Link Key
     * with it. Sleepy devices should poll at a higher rate until a response is
     * received or the request times out. The success or failure of the request is
     * returned via ezspZigbeeKeyEstablishmentHandler(...)
     * @param partner This is the IEEE address of the partner device that will share the link key.
     * @returns The success or failure of sending the request.
     *          This is not the final result of the attempt. ezspZigbeeKeyEstablishmentHandler(...) will return that.
     */
    ezspRequestLinkKey(partner: Eui64): Promise<SLStatus>;
    /**
     * Requests a new link key from the Trust Center. This function starts by
     * sending a Node Descriptor request to the Trust Center to verify its R21+
     * stack version compliance. A Request Key message will then be sent, followed
     * by a Verify Key Confirm message.
     * @param maxAttempts uint8_t The maximum number of attempts a node should make when sending the Node Descriptor,
     *        Request Key, and Verify Key Confirm messages. The number of attempts resets for each message type sent
     *        (e.g., if maxAttempts is 3, up to 3 Node Descriptors are sent, up to 3 Request Keys, and up to 3 Verify Key Confirm messages are sent).
     * @returns The success or failure of sending the request.
     *          If the Node Descriptor is successfully transmitted, ezspZigbeeKeyEstablishmentHandler(...)
     *          will be called at a later time with a final status result.
     */
    ezspUpdateTcLinkKey(maxAttempts: number): Promise<SLStatus>;
    /**
     * Callback
     * This is a callback that indicates the success or failure of an attempt to establish a key with a partner device.
     * @param partner This is the IEEE address of the partner that the device successfully established a key with.
     *        This value is all zeros on a failure.
     * @param status This is the status indicating what was established or why the key establishment failed.
     */
    ezspZigbeeKeyEstablishmentHandler(partner: Eui64, status: EmberKeyStatus): void;
    /**
     * Clear all of the transient link keys from RAM.
     */
    ezspClearTransientLinkKeys(): Promise<void>;
    /**
     * Retrieve information about the current and alternate network key, excluding their contents.
     * @returns Success or failure of retrieving network key info.
     * @returns sl_zb_sec_man_network_key_info_t * Information about current and alternate network keys.
     */
    ezspGetNetworkKeyInfo(): Promise<[SLStatus, networkKeyInfo: SecManNetworkKeyInfo]>;
    /**
     * Retrieve metadata about an APS link key.  Does not retrieve contents.
     * @param context sl_zb_sec_man_context_t * Context used to input information about key.
     * @returns Status of metadata retrieval operation.
     * @returns sl_zb_sec_man_aps_key_metadata_t * Metadata about the referenced key.
     */
    ezspGetApsKeyInfo(context: SecManContext): Promise<[status: SLStatus, keyData: SecManAPSKeyMetadata]>;
    /**
     * Import an application link key into the key table.
     * @param index uint8_t Index where this key is to be imported to.
     * @param address EUI64 this key is associated with.
     * @param plaintextKey sl_zb_sec_man_key_t * The key data to be imported.
     * @returns Status of key import operation.
     */
    ezspImportLinkKey(index: number, address: Eui64, plaintextKey: SecManKey): Promise<SLStatus>;
    /**
     * Export the link key at given index from the key table.
     * @param uint8_t  Index of key to export.
     * @returns Status of key export operation.
     * @returns sl_zigbee_sec_man_context_t * Context referencing the exported key. Contains information like the EUI64 address it is associated with.
     * @returns sl_zb_sec_man_key_t * The exported key.
     * @returns sl_zb_sec_man_aps_key_metadata_t * Metadata about the key.
     */
    ezspExportLinkKeyByIndex(index: number): Promise<[SLStatus, context: SecManContext, plaintextKey: SecManKey, keyData: SecManAPSKeyMetadata]>;
    /**
     * Export the link key associated with the given EUI from the key table.
     * @param eui EUI64 associated with the key to export.
     * @returns Status of key export operation.
     * @returns sl_zb_sec_man_key_t * The exported key.
     * @returns sl_zigbee_sec_man_context_t * Context referencing the exported key. Contains information like the EUI64 address it is associated with.
     * @returns sl_zb_sec_man_aps_key_metadata_t * Metadata about the key.
     */
    ezspExportLinkKeyByEui(eui: Eui64): Promise<[SLStatus, context: SecManContext, plaintextKey: SecManKey, keyData: SecManAPSKeyMetadata]>;
    /**
     * Check whether a key context can be used to load a valid key.
     * @param context sl_zb_sec_man_context_t * Context struct to check the validity of.
     * @returns Validity of the checked context.
     */
    ezspCheckKeyContext(context: SecManContext): Promise<SLStatus>;
    /**
     * Import a transient link key.
     * @param eui64 EUI64 associated with this transient key.
     * @param plaintextKey sl_zb_sec_man_key_t * The key to import.
     * @param flags sl_zigbee_sec_man_flags_t (unused in v14+) Flags associated with this transient key.
     * @returns Status of key import operation.
     */
    ezspImportTransientKey(eui64: Eui64, plaintextKey: SecManKey, flags?: SecManFlag): Promise<SLStatus>;
    /**
     * Export a transient link key from a given table index.
     * @param uint8_t Index to export from.
     * @returns Status of key export operation.
     * @returns sl_zb_sec_man_context_t * Context struct for export operation.
     * @returns sl_zb_sec_man_key_t * The exported key.
     * @returns sl_zb_sec_man_aps_key_metadata_t * Metadata about the key.
     */
    ezspExportTransientKeyByIndex(index: number): Promise<[SLStatus, context: SecManContext, plaintextKey: SecManKey, key_data: SecManAPSKeyMetadata]>;
    /**
     * Export a transient link key associated with a given EUI64
     * @param eui Index to export from.
     * @returns Status of key export operation.
     * @returns sl_zb_sec_man_context_t * Context struct for export operation.
     * @returns sl_zb_sec_man_key_t * The exported key.
     * @returns sl_zb_sec_man_aps_key_metadata_t * Metadata about the key.
     */
    ezspExportTransientKeyByEui(eui: Eui64): Promise<[SLStatus, context: SecManContext, plaintextKey: SecManKey, key_data: SecManAPSKeyMetadata]>;
    /**
     * Set the incoming TC link key frame counter to desired value.
     * @param frameCounter Value to set the frame counter to.
     */
    ezspSetIncomingTcLinkKeyFrameCounter(frameCounter: number): Promise<void>;
    /**
     * Encrypt/decrypt a message in-place using APS.
     * @param encrypt Encrypt (true) or decrypt (false) the message.
     * @param lengthCombinedArg uint8_t Length of the array containing message, needs to be long enough to include the auxiliary header and MIC.
     * @param message uint8_t * The message to be en/de-crypted.
     * @param apsHeaderEndIndex uint8_t Index just past the APS frame.
     * @param remoteEui64 IEEE address of the device this message is associated with.
     * @returns Status of the encryption/decryption call.
     */
    ezspApsCryptMessage(encrypt: boolean, lengthCombinedArg: number, message: Buffer, apsHeaderEndIndex: number, remoteEui64: Eui64): Promise<[SLStatus, cryptedMessage: Buffer]>;
    /**
     * Callback
     * The NCP used the trust center behavior policy to decide whether to allow a
     * new node to join the network. The Host cannot change the current decision,
     * but it can change the policy for future decisions using the setPolicy
     * command.
     * @param newNodeId The Node Id of the node whose status changed
     * @param newNodeEui64 The EUI64 of the node whose status changed.
     * @param status The status of the node: Secure Join/Rejoin, Unsecure Join/Rejoin, Device left.
     * @param policyDecision An EmberJoinDecision reflecting the decision made.
     * @param parentOfNewNodeId The parent of the node whose status has changed.
     */
    ezspTrustCenterJoinHandler(newNodeId: NodeId, newNodeEui64: Eui64, status: EmberDeviceUpdate, policyDecision: EmberJoinDecision, parentOfNewNodeId: NodeId): void;
    /**
     * This function broadcasts a new encryption key, but does not tell the nodes in
     * the network to start using it. To tell nodes to switch to the new key, use
     * ezspBroadcastNetworkKeySwitch(). This is only valid for the Trust
     * Center/Coordinator. It is up to the application to determine how quickly to
     * send the Switch Key after sending the alternate encryption key.
     * @param key EmberKeyData * An optional pointer to a 16-byte encryption key (EMBER_ENCRYPTION_KEY_SIZE).
     *        An all zero key may be passed in, which will cause the stack to randomly generate a new key.
     * @returns SLStatus value that indicates the success or failure of the command.
     */
    ezspBroadcastNextNetworkKey(key: EmberKeyData): Promise<SLStatus>;
    /**
     * This function broadcasts a switch key message to tell all nodes to change to
     * the sequence number of the previously sent Alternate Encryption Key.
     * @returns SLStatus value that indicates the success or failure of the command.
     */
    ezspBroadcastNetworkKeySwitch(): Promise<SLStatus>;
    /**
     * This routine processes the passed chunk of data and updates the hash context
     * based on it. If the 'finalize' parameter is not set, then the length of the
     * data passed in must be a multiple of 16. If the 'finalize' parameter is set
     * then the length can be any value up 1-16, and the final hash value will be
     * calculated.
     * @param context EmberAesMmoHashContext * The hash context to update.
     * @param finalize This indicates whether the final hash value should be calculated
     * @param data uint8_t * The data to hash.
     * @returns The result of the operation
     * @returns EmberAesMmoHashContext * The updated hash context.
     */
    ezspAesMmoHash(context: EmberAesMmoHashContext, finalize: boolean, data: Buffer): Promise<[SLStatus, returnContext: EmberAesMmoHashContext]>;
    /**
     * This command sends an APS remove device using APS encryption to the
     * destination indicating either to remove itself from the network, or one of
     * its children.
     * @param destShort The node ID of the device that will receive the message
     * @param destLong The long address (EUI64) of the device that will receive the message.
     * @param targetLong The long address (EUI64) of the device to be removed.
     * @returns An SLStatus value indicating success, or the reason for failure
     */
    ezspRemoveDevice(destShort: NodeId, destLong: Eui64, targetLong: Eui64): Promise<SLStatus>;
    /**
     * This command will send a unicast transport key message with a new NWK key to
     * the specified device. APS encryption using the device's existing link key
     * will be used.
     * @param destShort The node ID of the device that will receive the message
     * @param destLong The long address (EUI64) of the device that will receive the message.
     * @param key EmberKeyData * The NWK key to send to the new device.
     * @returns An SLStatus value indicating success, or the reason for failure
     */
    ezspUnicastNwkKeyUpdate(destShort: NodeId, destLong: Eui64, key: EmberKeyData): Promise<SLStatus>;
    /**
     * This call starts the generation of the ECC Ephemeral Public/Private key pair.
     * When complete it stores the private key. The results are returned via
     * ezspGenerateCbkeKeysHandler().
     */
    ezspGenerateCbkeKeys(): Promise<SLStatus>;
    /**
     * Callback
     * A callback by the Crypto Engine indicating that a new ephemeral
     * public/private key pair has been generated. The public/private key pair is
     * stored on the NCP, but only the associated public key is returned to the
     * host. The node's associated certificate is also returned.
     * @param status The result of the CBKE operation.
     * @param ephemeralPublicKey EmberPublicKeyData * The generated ephemeral public key.
     */
    ezspGenerateCbkeKeysHandler(status: SLStatus, ephemeralPublicKey: EmberPublicKeyData): void;
    /**
     * Calculates the SMAC verification keys for both the initiator and responder
     * roles of CBKE using the passed parameters and the stored public/private key
     * pair previously generated with ezspGenerateKeysRetrieveCert(). It also stores
     * the unverified link key data in temporary storage on the NCP until the key
     * establishment is complete.
     * @param amInitiator The role of this device in the Key Establishment protocol.
     * @param partnerCertificate EmberCertificateData * The key establishment partner's implicit certificate.
     * @param partnerEphemeralPublicKey EmberPublicKeyData * The key establishment partner's ephemeral public key
     */
    ezspCalculateSmacs(amInitiator: boolean, partnerCertificate: EmberCertificateData, partnerEphemeralPublicKey: EmberPublicKeyData): Promise<SLStatus>;
    /**
     * Callback
     * A callback to indicate that the NCP has finished calculating the Secure
     * Message Authentication Codes (SMAC) for both the initiator and responder. The
     * associated link key is kept in temporary storage until the host tells the NCP
     * to store or discard the key via emberClearTemporaryDataMaybeStoreLinkKey().
     * @param status The Result of the CBKE operation.
     * @param initiatorSmac EmberSmacData * The calculated value of the initiator's SMAC
     * @param responderSmac EmberSmacData * The calculated value of the responder's SMAC
     */
    ezspCalculateSmacsHandler(status: SLStatus, initiatorSmac: EmberSmacData, responderSmac: EmberSmacData): void;
    /**
     * This call starts the generation of the ECC 283k1 curve Ephemeral
     * Public/Private key pair. When complete it stores the private key. The results
     * are returned via ezspGenerateCbkeKeysHandler283k1().
     */
    ezspGenerateCbkeKeys283k1(): Promise<SLStatus>;
    /**
     * Callback
     * A callback by the Crypto Engine indicating that a new 283k1 ephemeral
     * public/private key pair has been generated. The public/private key pair is
     * stored on the NCP, but only the associated public key is returned to the
     * host. The node's associated certificate is also returned.
     * @param status The result of the CBKE operation.
     * @param ephemeralPublicKey EmberPublicKey283k1Data * The generated ephemeral public key.
     */
    ezspGenerateCbkeKeysHandler283k1(status: SLStatus, ephemeralPublicKey: EmberPublicKey283k1Data): void;
    /**
     * Calculates the SMAC verification keys for both the initiator and responder
     * roles of CBKE for the 283k1 ECC curve using the passed parameters and the
     * stored public/private key pair previously generated with
     * ezspGenerateKeysRetrieveCert283k1(). It also stores the unverified link key
     * data in temporary storage on the NCP until the key establishment is complete.
     * @param amInitiator The role of this device in the Key Establishment protocol.
     * @param partnerCertificate EmberCertificate283k1Data * The key establishment partner's implicit certificate.
     * @param partnerEphemeralPublicKey EmberPublicKey283k1Data * The key establishment partner's ephemeral public key
     */
    ezspCalculateSmacs283k1(amInitiator: boolean, partnerCertificate: EmberCertificate283k1Data, partnerEphemeralPublicKey: EmberPublicKey283k1Data): Promise<SLStatus>;
    /**
     * Callback
     * A callback to indicate that the NCP has finished calculating the Secure
     * Message Authentication Codes (SMAC) for both the initiator and responder for
     * the CBKE 283k1 Library. The associated link key is kept in temporary storage
     * until the host tells the NCP to store or discard the key via
     * emberClearTemporaryDataMaybeStoreLinkKey().
     * @param status The Result of the CBKE operation.
     * @param initiatorSmac EmberSmacData * The calculated value of the initiator's SMAC
     * @param responderSmac EmberSmacData * The calculated value of the responder's SMAC
     */
    ezspCalculateSmacsHandler283k1(status: SLStatus, initiatorSmac: EmberSmacData, responderSmac: EmberSmacData): void;
    /**
     * Clears the temporary data associated with CBKE and the key establishment,
     * most notably the ephemeral public/private key pair. If storeLinKey is true it
     * moves the unverified link key stored in temporary storage into the link key
     * table. Otherwise it discards the key.
     * @param storeLinkKey A bool indicating whether to store (true) or discard (false) the unverified link
     *        key derived when ezspCalculateSmacs() was previously called.
     */
    ezspClearTemporaryDataMaybeStoreLinkKey(storeLinkKey: boolean): Promise<SLStatus>;
    /**
     * Clears the temporary data associated with CBKE and the key establishment,
     * most notably the ephemeral public/private key pair. If storeLinKey is true it
     * moves the unverified link key stored in temporary storage into the link key
     * table. Otherwise it discards the key.
     * @param storeLinkKey A bool indicating whether to store (true) or discard (false) the unverified link
     *        key derived when ezspCalculateSmacs() was previously called.
     */
    ezspClearTemporaryDataMaybeStoreLinkKey283k1(storeLinkKey: boolean): Promise<SLStatus>;
    /**
     * Retrieves the certificate installed on the NCP.
     * @returns EmberCertificateData * The locally installed certificate.
     */
    ezspGetCertificate(): Promise<[SLStatus, localCert: EmberCertificateData]>;
    /**
     * Retrieves the 283k certificate installed on the NCP.
     * @returns EmberCertificate283k1Data * The locally installed certificate.
     */
    ezspGetCertificate283k1(): Promise<[SLStatus, localCert: EmberCertificate283k1Data]>;
    /**
     * Callback
     * The handler that returns the results of the signing operation. On success,
     * the signature will be appended to the original message (including the
     * signature type indicator that replaced the startIndex field for the signing)
     * and both are returned via this callback.
     * @param status The result of the DSA signing operation.
     * @param messageLength uint8_t The length of the messageContents parameter in bytes.
     * @param messageContents uint8_t *The message and attached which includes the original message and the appended signature.
     */
    ezspDsaSignHandler(status: SLStatus, messageContents: Buffer): void;
    /**
     * Verify that signature of the associated message digest was signed by the
     * private key of the associated certificate.
     * @param digest EmberMessageDigest * The AES-MMO message digest of the signed data.
     *        If dsaSign command was used to generate the signature for this data, the final byte (replaced by signature type of 0x01)
     *        in the messageContents array passed to dsaSign is included in the hash context used for the digest calculation.
     * @param signerCertificate EmberCertificateData * The certificate of the signer. Note that the signer's certificate and the verifier's
     *        certificate must both be issued by the same Certificate Authority, so they should share the same CA Public Key.
     * @param receivedSig EmberSignatureData * The signature of the signed data.
     */
    ezspDsaVerify(digest: EmberMessageDigest, signerCertificate: EmberCertificateData, receivedSig: EmberSignatureData): Promise<SLStatus>;
    /**
     * Callback
     * This callback is executed by the stack when the DSA verification has
     * completed and has a result. If the result is EMBER_SUCCESS, the signature is
     * valid. If the result is EMBER_SIGNATURE_VERIFY_FAILURE then the signature is
     * invalid. If the result is anything else then the signature verify operation
     * failed and the validity is unknown.
     * @param status The result of the DSA verification operation.
     */
    ezspDsaVerifyHandler(status: SLStatus): void;
    /**
     * Verify that signature of the associated message digest was signed by the
     * private key of the associated certificate.
     * @param digest EmberMessageDigest * The AES-MMO message digest of the signed data.
     *        If dsaSign command was used to generate the signature for this data, the final byte (replaced by signature type of 0x01)
     *        in the messageContents array passed to dsaSign is included in the hash context used for the digest calculation.
     * @param signerCertificate EmberCertificate283k1Data * The certificate of the signer. Note that the signer's certificate and the verifier's
     *        certificate must both be issued by the same Certificate Authority, so they should share the same CA Public Key.
     * @param receivedSig EmberSignature283k1Data * The signature of the signed data.
     */
    ezspDsaVerify283k1(digest: EmberMessageDigest, signerCertificate: EmberCertificate283k1Data, receivedSig: EmberSignature283k1Data): Promise<SLStatus>;
    /**
     * Sets the device's CA public key, local certificate, and static private key on
     * the NCP associated with this node.
     * @param caPublic EmberPublicKeyData * The Certificate Authority's public key.
     * @param myCert EmberCertificateData * The node's new certificate signed by the CA.
     * @param myKey EmberPrivateKeyData *The node's new static private key.
     */
    ezspSetPreinstalledCbkeData(caPublic: EmberPublicKeyData, myCert: EmberCertificateData, myKey: EmberPrivateKeyData): Promise<SLStatus>;
    /**
     * Sets the device's 283k1 curve CA public key, local certificate, and static
     * private key on the NCP associated with this node.
     * @returns Status of operation
     */
    ezspSavePreinstalledCbkeData283k1(): Promise<SLStatus>;
    /**
     * Activate use of mfglib test routines and enables the radio receiver to report
     * packets it receives to the mfgLibRxHandler() callback. These packets will not
     * be passed up with a CRC failure. All other mfglib functions will return an
     * error until the mfglibStart() has been called
     * @param rxCallback true to generate a mfglibRxHandler callback when a packet is received.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalStart(rxCallback: boolean): Promise<SLStatus>;
    /**
     * Deactivate use of mfglib test routines; restores the hardware to the state it
     * was in prior to mfglibStart() and stops receiving packets started by
     * mfglibStart() at the same time.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalEnd(): Promise<SLStatus>;
    /**
     * Starts transmitting an unmodulated tone on the currently set channel and
     * power level. Upon successful return, the tone will be transmitting. To stop
     * transmitting tone, application must call mfglibStopTone(), allowing it the
     * flexibility to determine its own criteria for tone duration (time, event,
     * etc.)
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalStartTone(): Promise<SLStatus>;
    /**
     * Stops transmitting tone started by mfglibStartTone().
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalStopTone(): Promise<SLStatus>;
    /**
     * Starts transmitting a random stream of characters. This is so that the radio
     * modulation can be measured.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalStartStream(): Promise<SLStatus>;
    /**
     * Stops transmitting a random stream of characters started by
     * mfglibStartStream().
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalStopStream(): Promise<SLStatus>;
    /**
     * Sends a single packet consisting of the following bytes: packetLength,
     * packetContents[0], ... , packetContents[packetLength - 3], CRC[0], CRC[1].
     * The total number of bytes sent is packetLength + 1. The radio replaces the
     * last two bytes of packetContents[] with the 16-bit CRC for the packet.
     * @param packetLength uint8_t The length of the packetContents parameter in bytes. Must be greater than 3 and less than 123.
     * @param packetContents uint8_t * The packet to send. The last two bytes will be replaced with the 16-bit CRC.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalSendPacket(packetContents: Buffer): Promise<SLStatus>;
    /**
     * Sets the radio channel. Calibration occurs if this is the first time the
     * channel has been used.
     * @param channel uint8_t The channel to switch to. Valid values are 11 - 26.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalSetChannel(channel: number): Promise<SLStatus>;
    /**
     * Returns the current radio channel, as previously set via mfglibSetChannel().
     * @returns uint8_t The current channel.
     */
    mfglibInternalGetChannel(): Promise<number>;
    /**
     * First select the transmit power mode, and then include a method for selecting
     * the radio transmit power. The valid power settings depend upon the specific
     * radio in use. Ember radios have discrete power settings, and then requested
     * power is rounded to a valid power setting; the actual power output is
     * available to the caller via mfglibGetPower().
     * @param txPowerMode uint16_t Power mode. Refer to txPowerModes in stack/include/ember-types.h for possible values.
     * @param power int8_t Power in units of dBm. Refer to radio data sheet for valid range.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    mfglibInternalSetPower(txPowerMode: EmberTXPowerMode, power: number): Promise<SLStatus>;
    /**
     * Returns the current radio power setting, as previously set via mfglibSetPower().
     * @returns int8_t Power in units of dBm. Refer to radio data sheet for valid range.
     */
    mfglibInternalGetPower(): Promise<number>;
    /**
     * Callback
     * A callback indicating a packet with a valid CRC has been received.
     * @param linkQuality uint8_t The link quality observed during the reception
     * @param rssi int8_t The energy level (in units of dBm) observed during the reception.
     * @param packetContents uint8_t * The received packet (last 2 bytes are not FCS / CRC and may be discarded)
     *        Length will be greater than 3 and less than 123.
     */
    ezspMfglibRxHandler(linkQuality: number, rssi: number, packetContents: Buffer): void;
    /**
     * Quits the current application and launches the standalone bootloader (if installed).
     * The function returns an error if the standalone bootloader is not present.
     * @param enabled If true, launch the standalone bootloader. If false, do nothing.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspLaunchStandaloneBootloader(enabled: boolean): Promise<SLStatus>;
    /**
     * Transmits the given bootload message to a neighboring node using a specific
     * 802.15.4 header that allows the EmberZNet stack as well as the bootloader to
     * recognize the message, but will not interfere with other Zigbee stacks.
     * @param broadcast If true, the destination address and pan id are both set to the broadcast address.
     * @param destEui64 The EUI64 of the target node. Ignored if the broadcast field is set to true.
     * @param messageLength uint8_t The length of the messageContents parameter in bytes.
     * @param messageContents uint8_t * The multicast message.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSendBootloadMessage(broadcast: boolean, destEui64: Eui64, messageContents: Buffer): Promise<SLStatus>;
    /**
     * Detects if the standalone bootloader is installed, and if so returns the
     * installed version. If not return 0xffff. A returned version of 0x1234 would
     * indicate version 1.2 build 34. Also return the node's version of PLAT, MICRO
     * and PHY.
     * @returns uint16_t BOOTLOADER_INVALID_VERSION if the standalone bootloader is not present,
     *          or the version of the installed standalone bootloader.
     * @returns uint8_t * The value of PLAT on the node
     * @returns uint8_t * The value of MICRO on the node
     * @returns uint8_t * The value of PHY on the node
     */
    ezspGetStandaloneBootloaderVersionPlatMicroPhy(): Promise<[
        bootloaderVersion: number,
        nodePlat: number,
        nodeMicro: number,
        nodePhy: number
    ]>;
    /**
     * Callback
     * A callback invoked by the EmberZNet stack when a bootload message is
     * received.
     * @param longId The EUI64 of the sending node.
     * @param packetInfo Information about the incoming packet.
     * @param messageContents uint8_t *The bootload message that was sent.
     */
    ezspIncomingBootloadMessageHandler(longId: Eui64, packetInfo: EmberRxPacketInfo, messageContents: Buffer): void;
    /**
     * Callback
     * A callback invoked by the EmberZNet stack when the MAC has finished
     * transmitting a bootload message.
     * @param status An EmberStatus value of SLStatus.OK if an ACK was received from the destination
     *        or SLStatus.ZIGBEE_DELIVERY_FAILED if no ACK was received.
     * @param messageLength uint8_t  The length of the messageContents parameter in bytes.
     * @param messageContents uint8_t * The message that was sent.
     */
    ezspBootloadTransmitCompleteHandler(status: SLStatus, messageContents: Buffer): void;
    /**
     * Perform AES encryption on plaintext using key.
     * @param uint8_t * 16 bytes of plaintext.
     * @param uint8_t * The 16-byte encryption key to use.
     * @returns uint8_t * 16 bytes of ciphertext.
     */
    ezspAesEncrypt(plaintext: number[], key: number[]): Promise<number[]>;
    /**
     * Callback
     * A callback to be implemented on the Golden Node to process acknowledgements.
     * If you supply a custom version of this handler, you must define SL_ZIGBEE_APPLICATION_HAS_INCOMING_MFG_TEST_MESSAGE_HANDLER
     * in your application's CONFIGURATION_HEADER
     * @param messageType uint8_t The type of the incoming message. Currently, the only possibility is MFG_TEST_TYPE_ACK.
     * @param data uint8_t * A pointer to the data received in the current message.
     */
    ezspIncomingMfgTestMessageHandler(messageType: number, messageContents: Buffer): void;
    /**
     * A function used on the Golden Node to switch between normal network operation (for testing) and manufacturing configuration.
     * Like emberSleep(), it may not be possible to execute this command due to pending network activity.
     * For the transition from normal network operation to manufacturing configuration, it is customary to loop,
     * calling this function alternately with emberTick() until the mode change succeeds.
     * @param beginConfiguration Determines the new mode of operation.
     *        true causes the node to enter manufacturing configuration.
     *        false causes the node to return to normal network operation.
     * @returns An SLStatus value indicating success or failure of the command.
     */
    ezspMfgTestSetPacketMode(beginConfiguration: boolean): Promise<SLStatus>;
    /**
     * A function used during manufacturing configuration on the Golden Node to send the DUT a reboot command.
     * The usual practice is to execute this command at the end of manufacturing configuration,
     * to place the DUT into normal network operation for testing.
     * This function executes only during manufacturing configuration mode and returns an error otherwise.
     * If successful, the DUT acknowledges the reboot command within 20 milliseconds and then reboots.
     * @returns An SLStatus value indicating success or failure of the command.
     */
    ezspMfgTestSendRebootCommand(): Promise<SLStatus>;
    /**
     * A function used during manufacturing configuration on the Golden Node to set the DUT's 8-byte EUI ID.
     * This function executes only during manufacturing configuration mode and returns an error otherwise.
     * If successful, the DUT acknowledges the new EUI ID within 150 milliseconds.
     * @param newId The 8-byte EUID for the DUT.
     * @returns An SLStatus value indicating success or failure of the command.
     */
    ezspMfgTestSendEui64(newId: Eui64): Promise<SLStatus>;
    /**
     * A function used during manufacturing configuration on the Golden Node to set the DUT's 16-byte configuration string.
     * This function executes only during manufacturing configuration mode and will return an error otherwise.
     * If successful, the DUT will acknowledge the new string within 150 milliseconds.
     * @param newString The 16-byte manufacturing string.
     * @returns An SLStatus value indicating success or failure of the command.
     */
    ezspMfgTestSendManufacturingString(newString: number[]): Promise<SLStatus>;
    /**
     * A function used during manufacturing configuration on the Golden Node to set the DUT's radio parameters.
     * This function executes only during manufacturing configuration mode and returns an error otherwise.
     * If successful, the DUT acknowledges the new parameters within 25 milliseconds.
     * @param supportedBands Sets the radio band for the DUT. See ember-common.h for possible values.
     * @param crystalOffset Sets the CC1020 crystal offset. This parameter has no effect on the EM2420, and it may safely be set to 0 for this RFIC.
     * @returns An SLStatus value indicating success or failure of the command.
     */
    ezspMfgTestSendRadioParameters(supportedBands: number, crystalOffset: number): Promise<SLStatus>;
    /**
     * A function used in each of the manufacturing configuration API calls.
     * Most implementations will not need to call this function directly. See mfg-test.c for more detail.
     * This function executes only during manufacturing configuration mode and returns an error otherwise.
     * @param command A pointer to the outgoing command string.
     * @returns An SLStatus value indicating success or failure of the command.
     */
    ezspMfgTestSendCommand(command: number): Promise<SLStatus>;
    /**
     * A consolidation of ZLL network operations with similar signatures;
     * specifically, forming and joining networks or touch-linking.
     * @param networkInfo EmberZllNetwork * Information about the network.
     * @param op Operation indicator.
     * @param radioTxPower int8_t Radio transmission power.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspZllNetworkOps(networkInfo: EmberZllNetwork, op: EzspZllNetworkOperation, radioTxPower: number): Promise<SLStatus>;
    /**
     * This call will cause the device to setup the security information used in its
     * network. It must be called prior to forming, starting, or joining a network.
     * @param networkKey EmberKeyData * ZLL Network key.
     * @param securityState EmberZllInitialSecurityState * Initial security state of the network.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspZllSetInitialSecurityState(networkKey: EmberKeyData, securityState: EmberZllInitialSecurityState): Promise<SLStatus>;
    /**
     * This call will update ZLL security token information. Unlike
     * emberZllSetInitialSecurityState, this can be called while a network is
     * already established.
     * @param securityState EmberZllInitialSecurityState * Security state of the network.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspZllSetSecurityStateWithoutKey(securityState: EmberZllInitialSecurityState): Promise<SLStatus>;
    /**
     * This call will initiate a ZLL network scan on all the specified channels.
     * @param channelMask uint32_t The range of channels to scan.
     * @param radioPowerForScan int8_t The radio output power used for the scan requests.
     * @param nodeType The node type of the local device.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspZllStartScan(channelMask: number, radioPowerForScan: number, nodeType: EmberNodeType): Promise<SLStatus>;
    /**
     * This call will change the mode of the radio so that the receiver is on for a
     * specified amount of time when the device is idle.
     * @param durationMs uint32_t The duration in milliseconds to leave the radio on.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspZllSetRxOnWhenIdle(durationMs: number): Promise<SLStatus>;
    /**
     * Callback
     * This call is fired when a ZLL network scan finds a ZLL network.
     * @param networkInfo EmberZllNetwork * Information about the network.
     * @param isDeviceInfoNull Used to interpret deviceInfo field.
     * @param deviceInfo EmberZllDeviceInfoRecord * Device specific information.
     * @param packetInfo Information about the incoming packet received from this network.
     */
    ezspZllNetworkFoundHandler(networkInfo: EmberZllNetwork, isDeviceInfoNull: boolean, deviceInfo: EmberZllDeviceInfoRecord, packetInfo: EmberRxPacketInfo): void;
    /**
     * Callback
     * This call is fired when a ZLL network scan is complete.
     * @param status Status of the operation.
     */
    ezspZllScanCompleteHandler(status: SLStatus): void;
    /**
     * Callback
     * This call is fired when network and group addresses are assigned to a remote
     * mode in a network start or network join request.
     * @param addressInfo EmberZllAddressAssignment * Address assignment information.
     * @param packetInfo Information about the incoming packet received from this network.
     */
    ezspZllAddressAssignmentHandler(addressInfo: EmberZllAddressAssignment, packetInfo: EmberRxPacketInfo): void;
    /**
     * Callback
     * This call is fired when the device is a target of a touch link.
     * @param networkInfo EmberZllNetwork * Information about the network.
     */
    ezspZllTouchLinkTargetHandler(networkInfo: EmberZllNetwork): void;
    /**
     * Get the ZLL tokens.
     * @returns EmberTokTypeStackZllData * Data token return value.
     * @returns EmberTokTypeStackZllSecurity * Security token return value.
     */
    ezspZllGetTokens(): Promise<[data: EmberTokTypeStackZllData, security: EmberTokTypeStackZllSecurity]>;
    /**
     * Set the ZLL data token.
     * @param data EmberTokTypeStackZllData * Data token to be set.
     */
    ezspZllSetDataToken(data: EmberTokTypeStackZllData): Promise<void>;
    /**
     * Set the ZLL data token bitmask to reflect the ZLL network state.
     */
    ezspZllSetNonZllNetwork(): Promise<void>;
    /**
     * Is this a ZLL network?
     * @returns ZLL network?
     */
    ezspIsZllNetwork(): Promise<boolean>;
    /**
     * This call sets the radio's default idle power mode.
     * @param mode The power mode to be set.
     */
    ezspZllSetRadioIdleMode(mode: number): Promise<void>;
    /**
     * This call gets the radio's default idle power mode.
     * @returns uint8_t The current power mode.
     */
    ezspZllGetRadioIdleMode(): Promise<number>;
    /**
     * This call sets the default node type for a factory new ZLL device.
     * @param nodeType The node type to be set.
     */
    ezspSetZllNodeType(nodeType: EmberNodeType): Promise<void>;
    /**
     * This call sets additional capability bits in the ZLL state.
     * @param uint16_t A mask with the bits to be set or cleared.
     */
    ezspSetZllAdditionalState(state: number): Promise<void>;
    /**
     * Is there a ZLL (Touchlink) operation in progress?
     * @returns ZLL operation in progress? false on error
     */
    ezspZllOperationInProgress(): Promise<boolean>;
    /**
     * Is the ZLL radio on when idle mode is active?
     * @returns ZLL radio on when idle mode is active? false on error
     */
    ezspZllRxOnWhenIdleGetActive(): Promise<boolean>;
    /**
     * Informs the ZLL API that application scanning is complete
     */
    ezspZllScanningComplete(): Promise<void>;
    /**
     * Get the primary ZLL (touchlink) channel mask.
     * @returns uint32_t The primary ZLL channel mask
     */
    ezspGetZllPrimaryChannelMask(): Promise<number>;
    /**
     * Get the secondary ZLL (touchlink) channel mask.
     * @returns uint32_t The secondary ZLL channel mask
     */
    ezspGetZllSecondaryChannelMask(): Promise<number>;
    /**
     * Set the primary ZLL (touchlink) channel mask
     * @param uint32_t The primary ZLL channel mask
     */
    ezspSetZllPrimaryChannelMask(zllPrimaryChannelMask: number): Promise<void>;
    /**
     * Set the secondary ZLL (touchlink) channel mask.
     * @param uint32_t The secondary ZLL channel mask
     */
    ezspSetZllSecondaryChannelMask(zllSecondaryChannelMask: number): Promise<void>;
    /**
     * Clear ZLL stack tokens.
     */
    ezspZllClearTokens(): Promise<void>;
    /**
     * Update the GP Proxy table based on a GP pairing.
     * @param options uint32_t The options field of the GP Pairing command.
     * @param addr EmberGpAddress * The target GPD.
     * @param commMode uint8_t The communication mode of the GP Sink.
     * @param sinkNetworkAddress uint16_t The network address of the GP Sink.
     * @param sinkGroupId uint16_t The group ID of the GP Sink.
     * @param assignedAlias uint16_t The alias assigned to the GPD.
     * @param sinkIeeeAddress uint8_t * The IEEE address of the GP Sink.
     * @param gpdKey EmberKeyData * The key to use for the target GPD.
     * @param gpdSecurityFrameCounter uint32_t The GPD security frame counter.
     * @param forwardingRadius uint8_t The forwarding radius.
     * @returns Whether a GP Pairing has been created or not.
     */
    ezspGpProxyTableProcessGpPairing(options: number, addr: EmberGpAddress, commMode: number, sinkNetworkAddress: number, sinkGroupId: number, assignedAlias: number, sinkIeeeAddress: Eui64, gpdKey: EmberKeyData, gpdSecurityFrameCounter: number, forwardingRadius: number): Promise<boolean>;
    /**
     * Adds/removes an entry from the GP Tx Queue.
     * @param action The action to perform on the GP TX queue (true to add, false to remove).
     * @param useCca Whether to use ClearChannelAssessment when transmitting the GPDF.
     * @param addr EmberGpAddress * The Address of the destination GPD.
     * @param gpdCommandId uint8_t The GPD command ID to send.
     * @param gpdAsdu uint8_t * The GP command payload.
     * @param gpepHandle uint8_t The handle to refer to the GPDF.
     * @param gpTxQueueEntryLifetimeMs uint16_t How long to keep the GPDF in the TX Queue.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspDGpSend(action: boolean, useCca: boolean, addr: EmberGpAddress, gpdCommandId: number, gpdAsdu: Buffer, gpepHandle: number, gpTxQueueEntryLifetimeMs: number): Promise<SLStatus>;
    /**
     * Callback
     * A callback to the GP endpoint to indicate the result of the GPDF
     * transmission.
     * @param status An SLStatus value indicating success or the reason for failure.
     * @param gpepHandle uint8_t The handle of the GPDF.
     */
    ezspDGpSentHandler(status: SLStatus, gpepHandle: number): void;
    /**
     * Callback
     * A callback invoked by the Zigbee GP stack when a GPDF is received.
     * @param status The status of the GPDF receive.
     * @param gpdLink uint8_t The gpdLink value of the received GPDF.
     * @param sequenceNumber uint8_t The GPDF sequence number.
     * @param addr EmberGpAddress *The address of the source GPD.
     * @param gpdfSecurityLevel The security level of the received GPDF.
     * @param gpdfSecurityKeyType The securityKeyType used to decrypt/authenticate the incoming GPDF.
     * @param autoCommissioning Whether the incoming GPDF had the auto-commissioning bit set.
     * @param bidirectionalInfo uint8_t Bidirectional information represented in bitfields,
     *        where bit0 holds the rxAfterTx of incoming gpdf and bit1 holds if tx queue is available for outgoing gpdf.
     * @param gpdSecurityFrameCounter uint32_t The security frame counter of the incoming GPDF.
     * @param gpdCommandId uint8_t The gpdCommandId of the incoming GPDF.
     * @param mic uint32_t The received MIC of the GPDF.
     * @param proxyTableIndex uint8_tThe proxy table index of the corresponding proxy table entry to the incoming GPDF.
     * @param gpdCommandPayload uint8_t * The GPD command payload.
     * @param packetInfo Rx packet information.
     */
    ezspGpepIncomingMessageHandler(status: EmberGPStatus, gpdLink: number, sequenceNumber: number, addr: EmberGpAddress, gpdfSecurityLevel: EmberGpSecurityLevel, gpdfSecurityKeyType: EmberGpKeyType, autoCommissioning: boolean, bidirectionalInfo: number, gpdSecurityFrameCounter: number, gpdCommandId: number, mic: number, proxyTableIndex: number, gpdCommandPayload: Buffer, packetInfo: EmberRxPacketInfo): void;
    /**
     * Retrieves the proxy table entry stored at the passed index.
     * @param proxyIndex uint8_t The index of the requested proxy table entry.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberGpProxyTableEntry * An EmberGpProxyTableEntry struct containing a copy of the requested proxy entry.
     */
    ezspGpProxyTableGetEntry(proxyIndex: number): Promise<[SLStatus, entry: EmberGpProxyTableEntry]>;
    /**
     * Finds the index of the passed address in the gp table.
     * @param addr EmberGpAddress * The address to search for
     * @returns uint8_t The index, or 0xFF for not found
     */
    ezspGpProxyTableLookup(addr: EmberGpAddress): Promise<number>;
    /**
     * Removes the proxy table entry stored at the passed index.
     * @param proxyIndex The index of the requested proxy table entry.
     */
    ezspGpProxyTableRemoveEntry(proxyIndex: number): Promise<void>;
    /**
     * Clear the entire proxy table
     */
    ezspGpClearProxyTable(): Promise<void>;
    /**
     * Retrieves the sink table entry stored at the passed index.
     * @param sinkIndex uint8_t The index of the requested sink table entry.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberGpSinkTableEntry * An EmberGpSinkTableEntry struct containing a copy of the requested sink entry.
     */
    ezspGpSinkTableGetEntry(sinkIndex: number): Promise<[SLStatus, entry: EmberGpSinkTableEntry]>;
    /**
     * Finds the index of the passed address in the gp table.
     * @param addr EmberGpAddress *The address to search for.
     * @returns uint8_t The index, or 0xFF for not found
     */
    ezspGpSinkTableLookup(addr: EmberGpAddress): Promise<number>;
    /**
     * Retrieves the sink table entry stored at the passed index.
     * @param sinkIndex uint8_t The index of the requested sink table entry.
     * @param entry EmberGpSinkTableEntry * An EmberGpSinkTableEntry struct containing a copy of the sink entry to be updated.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspGpSinkTableSetEntry(sinkIndex: number, entry: EmberGpSinkTableEntry): Promise<SLStatus>;
    /**
     * Removes the sink table entry stored at the passed index.
     * @param uint8_t The index of the requested sink table entry.
     */
    ezspGpSinkTableRemoveEntry(sinkIndex: number): Promise<void>;
    /**
     * Finds or allocates a sink entry
     * @param addr EmberGpAddress * An EmberGpAddress struct containing a copy of the gpd address to be found.
     * @returns uint8_t An index of found or allocated sink or 0xFF if failed.
     */
    ezspGpSinkTableFindOrAllocateEntry(addr: EmberGpAddress): Promise<number>;
    /**
     * Clear the entire sink table
     */
    ezspGpSinkTableClearAll(): Promise<void>;
    /**
     * Iniitializes Sink Table
     */
    ezspGpSinkTableInit(): Promise<void>;
    /**
     * Sets security framecounter in the sink table
     * @param index uint8_t Index to the Sink table
     * @param sfc uint32_t Security Frame Counter
     */
    ezspGpSinkTableSetSecurityFrameCounter(index: number, sfc: number): Promise<void>;
    /**
     * Puts the GPS in commissioning mode.
     * @param uint8_t commissioning options
     * @param uint16_t gpm address for security.
     * @param uint16_t gpm address for pairing.
     * @param uint8_t sink endpoint.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspGpSinkCommission(options: number, gpmAddrForSecurity: number, gpmAddrForPairing: number, sinkEndpoint: number): Promise<SLStatus>;
    /**
     * Clears all entries within the translation table.
     */
    ezspGpTranslationTableClear(): Promise<void>;
    /**
     * Return number of active entries in sink table.
     * @returns uint8_t Number of active entries in sink table. 0 if error.
     */
    ezspGpSinkTableGetNumberOfActiveEntries(): Promise<number>;
    /**
     * Gets the total number of tokens.
     * @returns uint32_t Total number of tokens.
     *   - < v18: uint8_t
     */
    ezspGetTokenCount(): Promise<number>;
    /**
     * Gets the token information for a single token at provided index
     * @param index uint8_t Index of the token in the token table for which information is needed.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberTokenInfo * Token information.
     */
    ezspGetTokenInfo(index: number): Promise<[SLStatus, tokenInfo: EmberTokenInfo]>;
    /**
     * Gets the token data for a single token with provided key
     * @param token uint32_t Key of the token in the token table for which data is needed.
     * @param index uint32_t Index in case of the indexed token.
     * @returns An SLStatus value indicating success or the reason for failure.
     * @returns EmberTokenData * Token Data
     */
    ezspGetTokenData(token: number, index: number): Promise<[SLStatus, tokenData: EmberTokenData]>;
    /**
     * Sets the token data for a single token with provided key
     * @param token uint32_t Key of the token in the token table for which data is to be set.
     * @param index uint32_t Index in case of the indexed token.
     * @param EmberTokenData * Token Data
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspSetTokenData(token: number, index: number, tokenData: EmberTokenData): Promise<SLStatus>;
    /**
     * Reset the node by calling halReboot.
     */
    ezspResetNode(): Promise<void>;
    /**
     * Run GP security test vectors.
     * @returns An SLStatus value indicating success or the reason for failure.
     */
    ezspGpSecurityTestVectors(): Promise<SLStatus>;
    /**
     * Factory reset all configured zigbee tokens
     * @param excludeOutgoingFC Exclude network and APS outgoing frame counter tokens.
     * @param excludeBootCounter Exclude stack boot counter token.
     */
    ezspTokenFactoryReset(excludeOutgoingFC: boolean, excludeBootCounter: boolean): Promise<void>;
}
//# sourceMappingURL=ezsp.d.ts.map