export class SupportModels {
    constructor(supportData){
        this.userId = supportData.userId;
        this.ticketId = supportData.ticketId;
        this.groupId = supportData.groupId;
        this.deviceName = supportData.deviceName;
        this.issueType = supportData.issueType;
        this.description = supportData.description;
        this.screenshot = supportData.screenshot;
        this.urgency = supportData.urgency;
    }
}