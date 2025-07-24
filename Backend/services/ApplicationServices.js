import {pool} from '../config/Database.js';
import {decodeLicenseCodeWithToken} from '../services/LicenseServices.js';

export const insertDeviceLogic = async (deviceData) => {
    try {
        const [existingDevice] = await pool.query(`SELECT * FROM devices WHERE macAddress = ?`, [deviceData.macAddress]);
        
        if (existingDevice.length > 0) {
            let current = new Date();
            await pool.query(`UPDATE devices SET lastActive = ? WHERE macAddress = ?`, [current, deviceData.macAddress]);

            const groupId = existingDevice[0].groupId;
            const [configRow] = await pool.query(`SELECT * FROM config WHERE groupID = ?`, [groupId]);

            if (configRow.length === 0) {
                const newINI = `
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

                return { success: true, data: newINI, message: "Device registered successfully."};
            }

            const config = configRow[0];

            const [policyRow] = await pool.query(`SELECT * FROM policy WHERE groupID = ?`, [groupId]);

            if (policyRow.length === 0) {
                const newINI = `
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

                return { success: true, data: newINI, message: "Device registered successfully."};
            }

            const policy = policyRow[0];

            const licenseData = decodeLicenseCodeWithToken(existingDevice[0].licenseKey);
            const expiryDate = licenseData.expiryDate;
            let currentDate = new Date().toISOString().split('T')[0];

            const iniContent = `
                [License]
                Active=${expiryDate>currentDate ? 'true' : 'false'}
                [Settings]
                Version=1.0.1
                Enable=true
                Organization=${config.organization || 'Protectionmark'}
                MacAddress=${config.macAddress ? 'true' : 'false'}
                IPAddress=${config.ipAddress ? 'true' : 'false'}
                Date=${config.date_enabled ? 'true' : 'false'}
                Tagline=${config.tagline_enabled ? 'true' : 'false'}
                Layout=${config.layout || 'low'}
                QRTopLeft=${config.qr_top_left ? 'true' : 'false'}
                QRTopRight=${config.qr_top_right ? 'true' : 'false'}
                QRBottomLeft=${config.qr_bottom_left ? 'true' : 'false'}
                QRBottomRight=${config.qr_bottom_right ? 'true' : 'false'}
                [WhiteLists]
                processes=${config.whitelist_processes || ''}
                [DataBlockSolution]
                BlockUSBMTP=${policy.usbmtp ? 'true' : 'false'}
                BlockBluetooth=${policy.bluetooth ? 'true' : 'false'}
                BlockFileUpload=${policy.browserUpload ? 'true' : 'false'}
                BlockClipboard=${policy.clipboard ? 'true' : 'false'}
                BlockPrint=${policy.printing ? 'true' : 'false'}
                BlockSnipping=${policy.snipping ? 'true': 'false'}
                BlockedApps=${policy.blockedApps || ''}
                [ClipboardWhiteLists]
		        ClipboardProcesses=${policy.clipboardWhiteLists || ''}
            `.trim();

            return { success: true, data: iniContent };
        } else {
            let current = new Date();
            const insertQuery = `INSERT INTO devices(deviceName, os, macAddress, ipAddress, lastActive) VALUES (?,?,?,?,?)`;
            const values = [deviceData.deviceName, deviceData.os, deviceData.macAddress, deviceData.ipAddress, current];
            await pool.query(insertQuery, values);

            const newINI = `
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

            return { success: true, data: newINI, message: "Device registered successfully."};
        }
    } catch (error) {
        console.log(error);

        const errorINI = `
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

        return { success: false, data: errorINI, message: "Operation failed." };
    }
};