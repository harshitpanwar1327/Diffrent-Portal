export class GroupDetails {
    constructor(groupData) {
        this.groupID = groupData.groupID;
        this.groupName = groupData.groupName;
        this.product = groupData.product;
    }
}

export class PolicyDetails {
    constructor(policyData){
        this.groupID = policyData.groupID;
        this.usb = policyData.usb;
        this.mtp = policyData.mtp;
        this.printing = policyData.printing;
        this.browserUpload = policyData.browserUpload;
        this.bluetooth = policyData.bluetooth;
        this.monitoring = policyData.monitoring;
        this.source = policyData.source;
        this.applications = policyData.applications;
    }
}