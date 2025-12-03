import Buffalo from "../../buffalo/buffalo";
import { ClusterId as ZdoClusterId } from "./definition/clusters";
import type { LocalTLVReader, RequestMap, ResponseMap, Tlv, ValidResponseMap } from "./definition/tstypes";
export declare class BuffaloZdo extends Buffalo {
    /**
     * Set the byte at given position without affecting the internal position tracker.
     * TODO: move to base `Buffalo` class
     * @param position
     * @param value
     */
    setByte(position: number, value: number): void;
    /**
     * Get the byte at given position without affecting the internal position tracker.
     * TODO: move to base `Buffalo` class
     * @param position
     * @returns
     */
    getByte(position: number): number;
    /**
     * Check if internal buffer has enough bytes to satisfy: (current position + given count).
     * TODO: move to base `Buffalo` class
     * @param count
     * @returns True if has given more bytes
     */
    isMoreBy(count: number): boolean;
    private writeManufacturerSpecificGlobalTLV;
    private readManufacturerSpecificGlobalTLV;
    private writeSupportedKeyNegotiationMethodsGlobalTLV;
    private readSupportedKeyNegotiationMethodsGlobalTLV;
    private writePanIdConflictReportGlobalTLV;
    private readPanIdConflictReportGlobalTLV;
    private writeNextPanIdChangeGlobalTLV;
    private readNextPanIdChangeGlobalTLV;
    private writeNextChannelChangeGlobalTLV;
    private readNextChannelChangeGlobalTLV;
    private writeSymmetricPassphraseGlobalTLV;
    private readSymmetricPassphraseGlobalTLV;
    private writeRouterInformationGlobalTLV;
    private readRouterInformationGlobalTLV;
    private writeFragmentationParametersGlobalTLV;
    private readFragmentationParametersGlobalTLV;
    private writeJoinerEncapsulationGlobalTLV;
    private readJoinerEncapsulationGlobalTLV;
    private writeBeaconAppendixEncapsulationGlobalTLV;
    private readBeaconAppendixEncapsulationGlobalTLV;
    private writeConfigurationParametersGlobalTLV;
    private readConfigurationParametersGlobalTLV;
    private writeDeviceCapabilityExtensionGlobalTLV;
    private readDeviceCapabilityExtensionGlobalTLV;
    writeGlobalTLV(tlv: Tlv): void;
    readGlobalTLV(tagId: number, length: number): Tlv["tlv"] | undefined;
    writeGlobalTLVs(tlvs: Tlv[]): void;
    private readCurve25519PublicPointTLV;
    private readAPSFrameCounterResponseTLV;
    private readBeaconSurveyResultsTLV;
    private readPotentialParentsTLV;
    private readDeviceAuthenticationLevelTLV;
    private readProcessingStatusTLV;
    /**
     * ANNEX I ZIGBEE TLV DEFINITIONS AND FORMAT
     *
     * Unknown tags => TLV ignored
     * Duplicate tags => reject message except for MANUFACTURER_SPECIFIC_GLOBAL_TLV
     * Malformed TLVs => reject message
     *
     * @param localTLVReaders Mapping of tagID to local TLV reader function
     * @param encapsulated Default false. If true, this is reading inside an encapsuled TLV (excludes further encapsulation)
     * @returns
     */
    readTLVs(localTLVReaders?: Map<number, LocalTLVReader>, encapsulated?: boolean): Tlv[];
    static buildRequest<K extends keyof RequestMap>(hasZdoMessageOverhead: boolean, clusterId: K, ...args: RequestMap[K]): Buffer;
    /**
     * @see ClusterId.NETWORK_ADDRESS_REQUEST
     * @param target IEEE address for the request
     * @param reportKids True to request that the target list their children in the response. [request type = 0x01]
     * @param childStartIndex The index of the first child to list in the response. Ignored if reportKids is false.
     */
    private buildNetworkAddressRequest;
    /**
     * @see ClusterId.IEEE_ADDRESS_REQUEST
     * Can be sent to target, or to another node that will send to target.
     * @param target NWK address for the request
     * @param reportKids True to request that the target list their children in the response. [request type = 0x01]
     * @param childStartIndex The index of the first child to list in the response. Ignored if reportKids is false.
     */
    private buildIeeeAddressRequest;
    /**
     * @see ClusterId.NODE_DESCRIPTOR_REQUEST
     * @param target NWK address for the request
     */
    private buildNodeDescriptorRequest;
    /**
     * @see ClusterId.POWER_DESCRIPTOR_REQUEST
     * @param target NWK address for the request
     */
    private buildPowerDescriptorRequest;
    /**
     * @see ClusterId.SIMPLE_DESCRIPTOR_REQUEST
     * @param target NWK address for the request
     * @param targetEndpoint The endpoint on the destination
     */
    private buildSimpleDescriptorRequest;
    /**
     * @see ClusterId.ACTIVE_ENDPOINTS_REQUEST
     * @param target NWK address for the request
     */
    private buildActiveEndpointsRequest;
    /**
     * @see ClusterId.MATCH_DESCRIPTORS_REQUEST
     * @param target NWK address for the request
     * @param profileId Profile ID to be matched at the destination
     * @param inClusterList List of Input ClusterIDs to be used for matching
     * @param outClusterList List of Output ClusterIDs to be used for matching
     */
    private buildMatchDescriptorRequest;
    /**
     * @see ClusterId.SYSTEM_SERVER_DISCOVERY_REQUEST
     * @param serverMask See Table 2-34 for bit assignments.
     */
    private buildSystemServiceDiscoveryRequest;
    /**
     * @see ClusterId.PARENT_ANNOUNCE
     * @param children The IEEE addresses of the children bound to the parent.
     */
    private buildParentAnnounce;
    /**
     * @see ClusterId.BIND_REQUEST
     *
     * @param source The IEEE address for the source.
     * @param sourceEndpoint The source endpoint for the binding entry.
     * @param clusterId The identifier of the cluster on the source device that is bound to the destination.
     * @param type The addressing mode for the destination address used in this command, either ::UNICAST_BINDING, ::MULTICAST_BINDING.
     * @param destination The destination address for the binding entry. IEEE for ::UNICAST_BINDING.
     * @param groupAddress The destination address for the binding entry. Group ID for ::MULTICAST_BINDING.
     * @param destinationEndpoint The destination endpoint for the binding entry. Only if ::UNICAST_BINDING.
     */
    private buildBindRequest;
    /**
     * @see ClusterId.UNBIND_REQUEST
     *
     * @param source The IEEE address for the source.
     * @param sourceEndpoint The source endpoint for the binding entry.
     * @param clusterId The identifier of the cluster on the source device that is bound to the destination.
     * @param type The addressing mode for the destination address used in this command, either ::UNICAST_BINDING, ::MULTICAST_BINDING.
     * @param destination The destination address for the binding entry. IEEE for ::UNICAST_BINDING.
     * @param groupAddress The destination address for the binding entry. Group ID for ::MULTICAST_BINDING.
     * @param destinationEndpoint The destination endpoint for the binding entry. Only if ::UNICAST_BINDING.
     */
    private buildUnbindRequest;
    /**
     * @see ClusterId.CLEAR_ALL_BINDINGS_REQUEST
     */
    private buildClearAllBindingsRequest;
    /**
     * @see ClusterId.LQI_TABLE_REQUEST
     * @param startIndex Starting Index for the requested elements of the Neighbor Table.
     */
    private buildLqiTableRequest;
    /**
     * @see ClusterId.ROUTING_TABLE_REQUEST
     * @param startIndex Starting Index for the requested elements of the Neighbor Table.
     */
    private buildRoutingTableRequest;
    /**
     * @see ClusterId.BINDING_TABLE_REQUEST
     * @param startIndex Starting Index for the requested elements of the Neighbor Table.
     */
    private buildBindingTableRequest;
    /**
     * @see ClusterId.LEAVE_REQUEST
     * @param deviceAddress All zeros if the target is to remove itself from the network or
     *   the EUI64 of a child of the target device to remove that child.
     * @param leaveRequestFlags A bitmask of leave options. Include ::AND_REJOIN if the target is to rejoin the network immediately after leaving.
     */
    private buildLeaveRequest;
    /**
     * @see ClusterId.PERMIT_JOINING_REQUEST
     * @param duration A value of 0x00 disables joining. A value of 0xFF enables joining. Any other value enables joining for that number of seconds.
     * @param authentication Controls Trust Center authentication behavior.
     *   This field SHALL always have a value of 1, indicating a request to change the Trust Center policy.
     *   If a frame is received with a value of 0, it shall be treated as having a value of 1.
     */
    private buildPermitJoining;
    /**
     * @see ClusterId.NWK_UPDATE_REQUEST
     * @param channels See Table 3-7 for details on the 32-bit field structure..
     * @param duration A value used to calculate the length of time to spend scanning each channel.
     *   The time spent scanning each channel is (aBaseSuperframeDuration * (2n + 1)) symbols, where n is the value of the duration parameter.
     *   If has a value of 0xfe this is a request for channel change.
     *   If has a value of 0xff this is a request to change the apsChannelMaskList and nwkManagerAddr attributes.
     * @param count This field represents the number of energy scans to be conducted and reported.
     *   This field SHALL be present only if the duration is within the range of 0x00 to 0x05.
     * @param nwkUpdateId The value of the nwkUpdateId contained in this request.
     *   This value is set by the Network Channel Manager prior to sending the message.
     *   This field SHALL only be present if the duration is 0xfe or 0xff.
     *   If the ScanDuration is 0xff, then the value in the nwkUpdateID SHALL be ignored.
     * @param nwkManagerAddr This field SHALL be present only if the duration is set to 0xff, and, where present,
     *   indicates the NWK address for the device with the Network Manager bit set in its Node Descriptor.
     */
    private buildNwkUpdateRequest;
    /**
     * @see ClusterId.NWK_ENHANCED_UPDATE_REQUEST
     * @param channelPages The set of channels (32-bit bitmap) for each channel page.
     *   The five most significant bits (b27,..., b31) represent the binary encoded Channel Page.
     *   The 27 least significant bits (b0, b1,... b26) indicate which channels are to be scanned
     *   (1 = scan, 0 = do not scan) for each of the 27 valid channels
     *   If duration is in the range 0x00 to 0x05, SHALL be restricted to a single page.
     * @param duration A value used to calculate the length of time to spend scanning each channel.
     *   The time spent scanning each channel is (aBaseSuperframeDuration * (2n + 1)) symbols, where n is the value of the duration parameter.
     *   If has a value of 0xfe this is a request for channel change.
     *   If has a value of 0xff this is a request to change the apsChannelMaskList and nwkManagerAddr attributes.
     * @param count This field represents the number of energy scans to be conducted and reported.
     *   This field SHALL be present only if the duration is within the range of 0x00 to 0x05.
     * @param nwkUpdateId The value of the nwkUpdateId contained in this request.
     *   This value is set by the Network Channel Manager prior to sending the message.
     *   This field SHALL only be present if the duration is 0xfe or 0xff.
     *   If the ScanDuration is 0xff, then the value in the nwkUpdateID SHALL be ignored.
     * @param nwkManagerAddr This field SHALL be present only if the duration is set to 0xff, and, where present,
     *   indicates the NWK address for the device with the Network Manager bit set in its Node Descriptor.
     * @param configurationBitmask Defined in defined in section 2.4.3.3.12.
     *   The configurationBitmask must be added to the end of the list of parameters.
     *   This octet may or may not be present.
     *   If not present then assumption should be that it is enhanced active scan.
     *   Bit 0: This bit determines whether to do an Active Scan or Enhanced Active Scan.
     *          When the bit is set to 1 it indicates an Enhanced Active Scan.
     *          And in case of Enhanced Active scan EBR shall be sent with EPID filter instead of PJOIN filter.
     *   Bit 1-7: Reserved
     */
    private buildNwkEnhancedUpdateRequest;
    /**
     * @see ClusterId.NWK_IEEE_JOINING_LIST_REQUEST
     * @param startIndex The starting index into the receiving device’s nwkIeeeJoiningList that SHALL be sent back.
     */
    private buildNwkIEEEJoiningListRequest;
    /**
     * @see ClusterId.NWK_BEACON_SURVEY_REQUEST
     */
    private buildNwkBeaconSurveyRequest;
    /**
     * @see ClusterId.START_KEY_NEGOTIATION_REQUEST
     */
    private buildStartKeyNegotiationRequest;
    /**
     * @see ClusterId.RETRIEVE_AUTHENTICATION_TOKEN_REQUEST
     */
    private buildRetrieveAuthenticationTokenRequest;
    /**
     * @see ClusterId.GET_AUTHENTICATION_LEVEL_REQUEST
     */
    private buildGetAuthenticationLevelRequest;
    /**
     * @see ClusterId.SET_CONFIGURATION_REQUEST
     */
    private buildSetConfigurationRequest;
    /**
     * @see ClusterId.GET_CONFIGURATION_REQUEST
     * @param tlvIds The IDs of each TLV that are being requested.
     *   Maximum number dependent on the underlying maximum size of the message as allowed by fragmentation.
     */
    private buildGetConfigurationRequest;
    /**
     * @see ClusterId.START_KEY_UPDATE_REQUEST
     */
    private buildStartKeyUpdateRequest;
    /**
     * @see ClusterId.DECOMMISSION_REQUEST
     */
    private buildDecommissionRequest;
    /**
     * @see ClusterId.CHALLENGE_REQUEST
     */
    private buildChallengeRequest;
    static checkStatus<K extends keyof ValidResponseMap>(result: ResponseMap[number]): result is ValidResponseMap[K];
    static readResponse<K extends number>(hasZdoMessageOverhead: boolean, clusterId: K extends keyof ResponseMap ? keyof ResponseMap : K, buffer: Buffer): ResponseMap[K];
    /**
     * @see ClusterId.NETWORK_ADDRESS_RESPONSE
     */
    readNetworkAddressResponse(): ResponseMap[ZdoClusterId.NETWORK_ADDRESS_RESPONSE];
    /**
     * @see ClusterId.IEEE_ADDRESS_RESPONSE
     */
    readIEEEAddressResponse(): ResponseMap[ZdoClusterId.IEEE_ADDRESS_RESPONSE];
    /**
     * @see ClusterId.NODE_DESCRIPTOR_RESPONSE
     */
    readNodeDescriptorResponse(): ResponseMap[ZdoClusterId.NODE_DESCRIPTOR_RESPONSE];
    /**
     * @see ClusterId.POWER_DESCRIPTOR_RESPONSE
     */
    readPowerDescriptorResponse(): ResponseMap[ZdoClusterId.POWER_DESCRIPTOR_RESPONSE];
    /**
     * @see ClusterId.SIMPLE_DESCRIPTOR_RESPONSE
     */
    readSimpleDescriptorResponse(): ResponseMap[ZdoClusterId.SIMPLE_DESCRIPTOR_RESPONSE];
    /**
     * @see ClusterId.ACTIVE_ENDPOINTS_RESPONSE
     */
    readActiveEndpointsResponse(): ResponseMap[ZdoClusterId.ACTIVE_ENDPOINTS_RESPONSE];
    /**
     * @see ClusterId.MATCH_DESCRIPTORS_RESPONSE
     */
    readMatchDescriptorsResponse(): ResponseMap[ZdoClusterId.MATCH_DESCRIPTORS_RESPONSE];
    /**
     * @see ClusterId.END_DEVICE_ANNOUNCE
     */
    readEndDeviceAnnounce(): ResponseMap[ZdoClusterId.END_DEVICE_ANNOUNCE];
    /**
     * @see ClusterId.SYSTEM_SERVER_DISCOVERY_RESPONSE
     */
    readSystemServerDiscoveryResponse(): ResponseMap[ZdoClusterId.SYSTEM_SERVER_DISCOVERY_RESPONSE];
    /**
     * @see ClusterId.PARENT_ANNOUNCE_RESPONSE
     */
    readParentAnnounceResponse(): ResponseMap[ZdoClusterId.PARENT_ANNOUNCE_RESPONSE];
    /**
     * @see ClusterId.BIND_RESPONSE
     * @returns No response payload, throws if not success
     */
    readBindResponse(): ResponseMap[ZdoClusterId.BIND_RESPONSE];
    /**
     * @see ClusterId.UNBIND_RESPONSE
     * @returns No response payload, throws if not success
     */
    readUnbindResponse(): ResponseMap[ZdoClusterId.UNBIND_RESPONSE];
    /**
     * @see ClusterId.CLEAR_ALL_BINDINGS_RESPONSE
     * @returns No response payload, throws if not success
     */
    readClearAllBindingsResponse(): ResponseMap[ZdoClusterId.CLEAR_ALL_BINDINGS_RESPONSE];
    /**
     * @see ClusterId.LQI_TABLE_RESPONSE
     */
    readLQITableResponse(): ResponseMap[ZdoClusterId.LQI_TABLE_RESPONSE];
    /**
     * @see ClusterId.ROUTING_TABLE_RESPONSE
     */
    readRoutingTableResponse(): ResponseMap[ZdoClusterId.ROUTING_TABLE_RESPONSE];
    /**
     * @see ClusterId.BINDING_TABLE_RESPONSE
     */
    readBindingTableResponse(): ResponseMap[ZdoClusterId.BINDING_TABLE_RESPONSE];
    /**
     * @see ClusterId.LEAVE_RESPONSE
     * @returns No response payload, throws if not success
     */
    readLeaveResponse(): ResponseMap[ZdoClusterId.LEAVE_RESPONSE];
    /**
     * @see ClusterId.PERMIT_JOINING_RESPONSE
     * @returns No response payload, throws if not success
     */
    readPermitJoiningResponse(): ResponseMap[ZdoClusterId.PERMIT_JOINING_RESPONSE];
    /**
     * @see ClusterId.NWK_UPDATE_RESPONSE
     */
    readNwkUpdateResponse(): ResponseMap[ZdoClusterId.NWK_UPDATE_RESPONSE];
    /**
     * @see ClusterId.NWK_ENHANCED_UPDATE_RESPONSE
     */
    readNwkEnhancedUpdateResponse(): ResponseMap[ZdoClusterId.NWK_ENHANCED_UPDATE_RESPONSE];
    /**
     * @see ClusterId.NWK_IEEE_JOINING_LIST_REPONSE
     */
    readNwkIEEEJoiningListResponse(): ResponseMap[ZdoClusterId.NWK_IEEE_JOINING_LIST_RESPONSE];
    /**
     * @see ClusterId.NWK_UNSOLICITED_ENHANCED_UPDATE_RESPONSE
     */
    readNwkUnsolicitedEnhancedUpdateResponse(): ResponseMap[ZdoClusterId.NWK_UNSOLICITED_ENHANCED_UPDATE_RESPONSE];
    /**
     * @see ClusterId.NWK_BEACON_SURVEY_RESPONSE
     */
    readNwkBeaconSurveyResponse(): ResponseMap[ZdoClusterId.NWK_BEACON_SURVEY_RESPONSE];
    /**
     * @see ClusterId.START_KEY_NEGOTIATION_RESPONSE
     */
    readStartKeyNegotiationResponse(): ResponseMap[ZdoClusterId.START_KEY_NEGOTIATION_RESPONSE];
    /**
     * @see ClusterId.RETRIEVE_AUTHENTICATION_TOKEN_RESPONSE
     */
    readRetrieveAuthenticationTokenResponse(): ResponseMap[ZdoClusterId.RETRIEVE_AUTHENTICATION_TOKEN_RESPONSE];
    /**
     * @see ClusterId.GET_AUTHENTICATION_LEVEL_RESPONSE
     */
    readGetAuthenticationLevelResponse(): ResponseMap[ZdoClusterId.GET_AUTHENTICATION_LEVEL_RESPONSE];
    /**
     * @see ClusterId.SET_CONFIGURATION_RESPONSE
     */
    readSetConfigurationResponse(): ResponseMap[ZdoClusterId.SET_CONFIGURATION_RESPONSE];
    /**
     * @see ClusterId.GET_CONFIGURATION_RESPONSE
     */
    readGetConfigurationResponse(): ResponseMap[ZdoClusterId.GET_CONFIGURATION_RESPONSE];
    /**
     * @see ClusterId.START_KEY_UPDATE_RESPONSE
     * @returns No response payload, throws if not success
     */
    readStartKeyUpdateResponse(): ResponseMap[ZdoClusterId.START_KEY_UPDATE_RESPONSE];
    /**
     * @see ClusterId.DECOMMISSION_RESPONSE
     * @returns No response payload, throws if not success
     */
    readDecommissionResponse(): ResponseMap[ZdoClusterId.DECOMMISSION_RESPONSE];
    /**
     * @see ClusterId.CHALLENGE_RESPONSE
     */
    readChallengeResponse(): ResponseMap[ZdoClusterId.CHALLENGE_RESPONSE];
}
//# sourceMappingURL=buffaloZdo.d.ts.map