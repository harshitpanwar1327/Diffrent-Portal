import { pool } from '../config/Database.js';

//users Table
const users = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    organization VARCHAR(50)
);`;

//groupDetails Table
const groupDetails = `CREATE TABLE IF NOT EXISTS groupDetails (
    groupID VARCHAR(4) PRIMARY KEY,
    groupName VARCHAR(50) NOT NULL,
    product VARCHAR(30) NOT NULL
);`;

//Devices Table
const devices = `CREATE TABLE IF NOT EXISTS Devices (
    deviceID INT AUTO_INCREMENT PRIMARY KEY,
    deviceName VARCHAR(50),
    os VARCHAR(50),
    macAddress VARCHAR(30) UNIQUE NOT NULL,
    ipAddress VARCHAR(45),
    groupID VARCHAR(4),
    licenseKey VARCHAR(255) DEFAULT false,
    lastActive DATETIME,
    FOREIGN KEY (groupID) REFERENCES groupDetails(groupID)
        ON DELETE CASCADE
);`;

//Policy Table
const policyDetails = `CREATE TABLE IF NOT EXISTS Policy (
    groupID VARCHAR(36) PRIMARY KEY,
    usb BOOLEAN NOT NULL,
    mtp BOOLEAN NOT NULL,
    printing BOOLEAN NOT NULL,
    browserUpload BOOLEAN NOT NULL,
    bluetooth BOOLEAN NOT NULL,
    monitoring BOOLEAN NOT NULL,
    source VARCHAR(255),
    applications TEXT,
    FOREIGN KEY (groupID) REFERENCES groupDetails(groupID)
        ON DELETE CASCADE
);`;

//Config Table
const configDetails = `CREATE TABLE IF NOT EXISTS Config(
    groupID VARCHAR(4) PRIMARY KEY,
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
    whitelist_processes TEXT
);`;

//License Table
const licenseDetails = `CREATE TABLE IF NOT EXISTS License (
    licenseKey VARCHAR(255) PRIMARY KEY
)`;

//SupportDetails Table
const supportDetails = `CREATE TABLE IF NOT EXISTS Support (
    ticketID VARCHAR(36) PRIMARY KEY,
    groupID VARCHAR(4)  NOT NULL,
    deviceName VARCHAR(50)  NOT NULL,
    issueType VARCHAR(100) NOT NULL,
    description LONGTEXT  NOT NULL,
    screenshot LONGTEXT,
    urgency VARCHAR(10)
);`;

const createTable = async (tableName, query) => {
    try {
        await pool.query(query);
        console.log(`${tableName} table created successfully!`);
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