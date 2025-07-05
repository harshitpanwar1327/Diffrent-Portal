export class SupportModels {
    constructor(supportData){
        this.ticketId = supportData.ticketId;
        this.groupId = supportData.groupId;
        this.deviceId = supportData.deviceId;
        this.issueType = supportData.issueType;
        this.description = supportData.description;
        this.screenshot = supportData.screenshot;
        this.urgency = supportData.urgency;
    }
}