import express from "express";
import cookieParser from "cookie-parser";
import "./database.js";  
import clientRoutes from "./src/routes/client.js";
import reservationRoutes from "./src/routes/reservation.js";
import registerClientRouter from "./src/routes/registerClient.js";
import swaggerUi from "swagger-ui-express"; 
import fs from "fs"; 
import path from "path"; 

const app = express();

app.use(express.json());
app.use(cookieParser());

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve("./partplus.json"), "utf-8")
)

app.use("/api/docs", swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.use("/api/client", clientRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/registerClient", registerClientRouter);


export default app; 