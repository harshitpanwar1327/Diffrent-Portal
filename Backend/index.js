import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { authMiddleware } from './middleware/AuthMiddleware.js';
import createAllTables from './utils/CreateTables.js';
import { checkConnection } from './config/Database.js';
import PolicyRoutes from './routes/PolicyRoutes.js';
import SupportRoutes from './routes/SupportRoutes.js';
import LicensesRoutes from './routes/LicensesRoutes.js';
import ConfigRoutes from './routes/ConfigRoutes.js';
import DevicesRoutes from './routes/DevicesRoutes.js';
import ApplicationRoutes from './routes/ApplicationRoutes.js';
import UsersRoutes from './routes/UsersRoutes.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 1000,
});
app.use(limiter);

app.use("/api/users", UsersRoutes);

app.use("/api/config", ApplicationRoutes);

app.use("/api/license", LicensesRoutes);

app.use(authMiddleware);

app.use("/api/policy", PolicyRoutes);

app.use("/api/config", ConfigRoutes);

app.use("/api/devices", DevicesRoutes);

app.use("/api/support", SupportRoutes);

app.use((req, res, next) => {
    res.status(404).json({message: "Route not exist"});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Internal Server Error"});
});

app.listen(PORT, async() => {
    console.log(`Welcome to the port ${PORT}`);
    try {
        await checkConnection();
        await createAllTables();
    } catch (error) {
        console.log('Something went wrong!',error);
    }
});