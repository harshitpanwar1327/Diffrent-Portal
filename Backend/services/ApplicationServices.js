import {pool} from '../config/Database.js';
import {decodeLicenseCodeWithToken} from '../services/LicenseServices.js';

export const insertDeviceLogic = async (deviceData) => {
    try {
        const [existingDevice] = await pool.query(`SELECT * FROM devices WHERE macAddress = ?`, [deviceData.macAddress]);

        if (existingDevice.length > 0) {
            let current = new Date();
            await pool.query(`UPDATE devices SET lastActive = ? WHERE macAddress = ?`, [current, deviceData.macAddress]);

            const groupID = existingDevice[0].groupID;
            const [configRow] = await pool.query(`SELECT * FROM config WHERE groupID = ?`, [groupID]);

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
                    [DATABLOCK]
                    BLUETOOTH=true
                    USB=true
                    PRINT=true
                    MTP=true
                    UPLOAD=true
                `.trim();

                return { success: true, data: newINI, message: "Device registered successfully."};
            }

            const config = configRow[0];

            const [policyRow] = await pool.query(`SELECT * FROM policy WHERE groupID = ?`, [groupID]);

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
                    [DATABLOCK]
                    BLUETOOTH=true
                    USB=true
                    PRINT=true
                    MTP=true
                    UPLOAD=true
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
                [DATABLOCK]
                BLUETOOTH=${policy.bluetooth ? 'true' : 'false'}
                USB=${policy.usb ? 'true' : 'false'}
                PRINT=${policy.printing ? 'true' : 'false'}
                MTP=${policy.mtp ? 'true' : 'false'}
                UPLOAD=${policy.browserUpload ? 'true' : 'false'}
            `.trim();

            return { success: true, data: iniContent };
        } else {
            let current = new Date();
            const insertQuery = `INSERT INTO devices(userId, deviceName, os, macAddress, ipAddress, lastActive) VALUES (?,?,?,?,?,?)`;
            const values = [deviceData.userId, deviceData.deviceName, deviceData.os, deviceData.macAddress, deviceData.ipAddress, current];
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
                [DATABLOCK]
                BLUETOOTH=true
                USB=true
                PRINT=true
                MTP=true
                UPLOAD=true
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
            [DATABLOCK]
            BLUETOOTH=true
            USB=true
            PRINT=true
            MTP=true
            UPLOAD=true
        `.trim();

        return { success: false, data: errorINI, message: "Operation failed." };
    }
};