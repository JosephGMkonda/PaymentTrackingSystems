import express from "express"
import dotenv from "dotenv"
import Users from "./models/Users.js"
import Payments from "./models/Payments.js"
import Customers from "./models/Customers.js"
import MonthlyBills from "./models/MonthlyBills.js"
import session from "express-session"
import SequelizeStore from "connect-session-sequelize"
import {db} from "./config/database.js"
import cors from "cors"
import AuthRouter from "./routes/AuthRoute.js"
import CustomerRoute from "./routes/CustomerRoute.js"
import routes from "./routes/MonthlyBillsRoute.js"

dotenv.config();

const app = express();


const SequelizeSessionStore = SequelizeStore(session.Store);

const store = new SequelizeSessionStore({
    db: db,
});

(async () => {
    try {
        await db.sync({ force: false });
        console.log("Database synced successfully!");
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

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));

app.use(express.json());
app.use("/api/v1", AuthRouter);
app.use("/api/v1", CustomerRoute )
app.use("/api/v1", routes);



// store.sync();


 const PORT = process.env.APP_PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server is running ${PORT}........`)
})