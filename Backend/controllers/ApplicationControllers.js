import { ApplicationModels } from "../models/ApplicationModels.js";
import { insertDeviceLogic } from "../services/ApplicationServices.js";

export const insertDevice = async (req, res) => {
    let {deviceName, os, macAddress, ipAddress} = req.body;

    if (!macAddress) {
        const iniError = `
            [License]
            Active=true
            [Settings]
            Version=1.0.1
            Enable=true
            Organization=ProtectionMark
            MacAddress=true
            IPAddress=true
            Date=true
            Tagline=true
            Layout=medium
            QRTopLeft=true
            QRTopRight=true
            QRBottomLeft=true
            QRBottomRight=true
            [WhiteLists]
            processes=
            [DataBlockSolution]
            BlockUSBMTP=true
            BlockBluetooth=true
            BlockFileUpload=true
            BlockClipboard=true
            BlockPrint=true
            BlockSnipping=true
            BlockedApps=
            [ClipboardWhiteLists]
		    ClipboardProcesses=
        `.trim();

        res.setHeader('Content-Type', 'text/plain');
        return res.status(400).send(iniError);
    }

    let deviceData = new ApplicationModels({deviceName, os, macAddress, ipAddress});

    try {
        let response = await insertDeviceLogic(deviceData);
        res.setHeader('Content-Type', 'text/plain');
        res.send(response.data);
    } catch (error) {
        const defaultINI = `
            [License]
            Active=true
            [Settings]
            Version=1.0.1
            Enable=true
            Organization=ProtectionMark
            MacAddress=true
            IPAddress=true
            Date=true
            Tagline=true
            Layout=medium
            QRTopLeft=true
            QRTopRight=true
            QRBottomLeft=true
            QRBottomRight=true
            [WhiteLists]
            processes=
            [DataBlockSolution]
            BlockUSBMTP=true
            BlockBluetooth=true
            BlockFileUpload=true
            BlockClipboard=true
            BlockPrint=true
            BlockSnipping=true
            BlockedApps=
            [ClipboardWhiteLists]
		    ClipboardProcesses=
        `.trim();

        res.setHeader('Content-Type', 'text/plain');
        res.status(500).send(defaultINI);
    }
}