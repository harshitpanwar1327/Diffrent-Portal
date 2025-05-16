export class ApplicationModels{
    constructor(deviceData) {
        this.deviceName = deviceData.deviceName;
        this.os = deviceData.os;
        this.macAddress = deviceData.macAddress;
        this.ipAddress = deviceData.ipAddress;
    }
}