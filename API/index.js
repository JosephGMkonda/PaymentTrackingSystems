import express from "express"
import dotenv from "dotenv"
import Users from "./models/Users.js"
import Payments from "./models/Payments.js"
import Customers from "./models/Customers.js"
import MonthlyBills from "./models/MonthlyBills.js"
import Wallets from "./models/AirtelMoneyModels/Wallets.js"
import Transactions from "./models/AirtelMoneyModels/Transaction.js"
import AirtelMoneyUsers from "./models/AirtelMoneyModels/AirMoneyUsers.js"
import session from "express-session"
import SequelizeStore from "connect-session-sequelize"
import {db} from "./config/database.js"
import { airtelDB } from "./config/database.js"
import cookieParser from 'cookie-parser';
import cors from "cors"
import AuthRouter from "./routes/AuthRoute.js"
import CustomerRoute from "./routes/CustomerRoute.js"
import routes from "./routes/MonthlyBillsRoute.js"
import paymentRouter from "./routes/PaymentsRoutes.js"
import DataRouter from "./routes/DataAnalyticsRoutes.js"
import simulationRoute from "./routes/AirtelRoutes.js"
import reportRoute from "./routes/reportRoute.js"
dotenv.config();

const app = express();


const SequelizeSessionStore = SequelizeStore(session.Store);

const store = new SequelizeSessionStore({
    db: db,
    airtelDB: airtelDB

});

(async () => {
    try {
        await db.sync({ force: false });
        console.log("Database synced successfully!");

        await airtelDB.sync({ force: false });
        console.log("Airtel Money DB synced successfully!");
        
    } catch (error) {
        console.error("Error syncing database:", error);
    }
})();

app.use(session({

    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: 'auto' },
}))
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));

app.use(express.json());
app.use("/api/v1", AuthRouter);
app.use("/api/v1", CustomerRoute )
app.use("/api/v1", routes);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", DataRouter);
app.use("/api/v1", simulationRoute);
app.use("/api/v1", reportRoute);



// store.sync();


 const PORT = process.env.APP_PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server is running ${PORT}........`)
})