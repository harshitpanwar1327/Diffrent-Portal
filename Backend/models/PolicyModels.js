export class GroupDetails {
    constructor(groupData) {
        this.groupID = groupData.groupID;
        this.groupName = groupData.groupName;
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
    }
}