export class ConfigModels{
    constructor(configData){
        this.groupId = configData.groupId;
        this.organization = configData.organization;
        this.macAddress = configData.macAddress;
        this.ipAddress = configData.ipAddress;
        this.date_enabled = configData.date_enabled;
        this.tagline_enabled = configData.tagline_enabled;
        this.layout = configData.layout;
        this.qr_top_left = configData.qr_top_left;
        this.qr_top_right = configData.qr_top_right;
        this.qr_bottom_left = configData.qr_bottom_left;
        this.qr_bottom_right =configData.qr_bottom_right;
        this.whitelist_processes = configData.whitelist_processes;
    }
}