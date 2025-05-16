export class SupportModels {
    constructor(supportData){
        this.ticketID = supportData.ticketID;
        this.groupID = supportData.groupID;
        this.deviceName = supportData.deviceName;
        this.issueType = supportData.issueType;
        this.description = supportData.description;
        this.screenshot = supportData.screenshot;
        this.urgency = supportData.urgency;
    }
}