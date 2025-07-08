import express from "express";
import cookieParser from "cookie-parser";
import "./database.js";  
import clientRoutes from "./src/routes/client.js";
import reservationRoutes from "./src/routes/reservation.js";
import registerClientRouter from "./src/routes/registerClient.js";
const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/client", clientRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/registerClient", registerClientRouter);


export default app; 