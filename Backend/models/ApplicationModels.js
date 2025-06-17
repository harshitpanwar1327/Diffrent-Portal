export class ApplicationModels{
    constructor(deviceData) {
        this.userId = deviceData.userId;
        this.deviceName = deviceData.deviceName;
        this.os = deviceData.os;
        this.macAddress = deviceData.macAddress;
        this.ipAddress = deviceData.ipAddress;
    }
}