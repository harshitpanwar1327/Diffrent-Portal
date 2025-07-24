export class PolicyDetails {
    constructor(policyData){
        this.groupId = policyData.groupId;
        this.usbmtp = policyData.usbmtp;
        this.printing = policyData.printing;
        this.browserUpload = policyData.browserUpload;
        this.bluetooth = policyData.bluetooth;
        this.clipboard = policyData.clipboard;
        this.snipping = policyData.snipping;
        this.blockedApps = policyData.blockedApps;
        this.clipboardWhiteLists = policyData.clipboardWhiteLists;
    }
}