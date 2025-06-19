export class DevicesModels {
    constructor(deviceData) {
        this.macAddress = deviceData.macAddress;
        this.groupId = deviceData.groupId;
        this.groupName = deviceData.groupName;
    }
}