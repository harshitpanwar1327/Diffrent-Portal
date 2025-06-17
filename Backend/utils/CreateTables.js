import { pool } from '../config/Database.js';

//users Table
const users = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    organization VARCHAR(50),
    created_At DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

//groupDetails Table
const groupDetails = `CREATE TABLE IF NOT EXISTS groupDetails (
    groupId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    groupName VARCHAR(50) NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(id)
        ON DELETE CASCADE
);`;

//Devices Table
const devices = `CREATE TABLE IF NOT EXISTS devices (
    deviceId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    groupId INT NOT NULL,
    deviceName VARCHAR(50),
    os VARCHAR(50),
    macAddress VARCHAR(30) UNIQUE NOT NULL,
    ipAddress VARCHAR(45),
    licenseKey VARCHAR(255),
    lastActive DATETIME,
    FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
);`;

//Policy Table
const policyDetails = `CREATE TABLE IF NOT EXISTS policy (
    policyId INT AUTO_INCREMENT PRIMARY KEY,
    groupId INT NOT NULL,
    usb BOOLEAN NOT NULL,
    mtp BOOLEAN NOT NULL,
    printing BOOLEAN NOT NULL,
    browserUpload BOOLEAN NOT NULL,
    bluetooth BOOLEAN NOT NULL,
    FOREIGN KEY (groupId) REFERENCES groupDetails(groupId)
        ON DELETE CASCADE
);`;

//Config Table
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

//License Table
const licenseDetails = `CREATE TABLE IF NOT EXISTS license (
    licenseId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    licenseKey VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
)`;

//SupportDetails Table
const supportDetails = `CREATE TABLE IF NOT EXISTS support (
    userId INT NOT NULL,
    ticketId VARCHAR(36) PRIMARY KEY,
    groupId INT NOT NULL,
    deviceName VARCHAR(50)  NOT NULL,
    issueType VARCHAR(100) NOT NULL,
    description LONGTEXT  NOT NULL,
    screenshot LONGTEXT,
    urgency VARCHAR(10),
    FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
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