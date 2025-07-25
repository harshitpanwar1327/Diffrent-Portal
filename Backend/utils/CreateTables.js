import { pool } from '../config/Database.js';

const users = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    organization VARCHAR(50),
    created_At DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

const groupDetails = `CREATE TABLE IF NOT EXISTS groupDetails (
    groupId INT AUTO_INCREMENT PRIMARY KEY,
    groupName VARCHAR(50) NOT NULL
);`;

const devices = `CREATE TABLE IF NOT EXISTS devices (
    deviceId INT AUTO_INCREMENT PRIMARY KEY,
    groupId INT,
    groupName VARCHAR(50),
    deviceName VARCHAR(50),
    os VARCHAR(50),
    macAddress VARCHAR(30) UNIQUE NOT NULL,
    ipAddress VARCHAR(45),
    licenseKey VARCHAR(255),
    lastActive DATETIME
);`;

const policyDetails = `CREATE TABLE IF NOT EXISTS policy (
    policyId INT AUTO_INCREMENT PRIMARY KEY,
    groupId INT NOT NULL,
    usbmtp BOOLEAN NOT NULL,
    printing BOOLEAN NOT NULL,
    browserUpload BOOLEAN NOT NULL,
    bluetooth BOOLEAN NOT NULL,
    clipboard BOOLEAN NOT NULL,
    snipping BOOLEAN NOT NULL,
    blockedApps TEXT,
    clipboardWhiteLists TEXT,
    FOREIGN KEY (groupId) REFERENCES groupDetails(groupId)
        ON DELETE CASCADE
);`;

const configDetails = `CREATE TABLE IF NOT EXISTS config(
    configId INT AUTO_INCREMENT PRIMARY KEY,
    groupId INT NOT NULL,
    organization VARCHAR(30),
    macAddress BOOLEAN NOT NULL,
    ipAddress BOOLEAN NOT NULL,
    date_enabled BOOLEAN NOT NULL,
    tagline_enabled BOOLEAN NOT NULL,
    layout VARCHAR(10) NOT NULL,
    qr_top_left BOOLEAN NOT NULL,
    qr_top_right BOOLEAN NOT NULL,
    qr_bottom_left BOOLEAN NOT NULL,
    qr_bottom_right BOOLEAN NOT NULL,
    whitelist_processes TEXT,
    FOREIGN KEY (groupId) REFERENCES groupDetails(groupId)
        ON DELETE CASCADE
);`;

const licenseDetails = `CREATE TABLE IF NOT EXISTS license (
    licenseId INT AUTO_INCREMENT PRIMARY KEY,
    licenseKey VARCHAR(255) NOT NULL
);`;

const supportDetails = `CREATE TABLE IF NOT EXISTS support (
    ticketId VARCHAR(36) PRIMARY KEY,
    groupId INT NOT NULL,
    deviceId INT NOT NULL,
    issueType VARCHAR(100) NOT NULL,
    description LONGTEXT  NOT NULL,
    screenshot LONGTEXT,
    urgency VARCHAR(10),
    status VARCHAR(10) DEFAULT 'pending',
    created_At DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

const createTable = async (tableName, query) => {
    try {
        await pool.query(query);
        console.log(`${tableName} table created successfully`);
    } catch (error) {
        console.error(`Failed to create ${tableName} table:`, error);
    }
};

const createAllTables = async () => {
    try {
        await createTable('Users', users);
        await createTable('Groups', groupDetails);
        await createTable('Devices', devices);
        await createTable('Policy', policyDetails);
        await createTable('Config', configDetails);
        await createTable('License', licenseDetails);
        await createTable('Support', supportDetails);
    } catch (error) {
        console.error("Failed to create all tables:", error);
    }
};

export default createAllTables;