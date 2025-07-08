import express from "express";
import clientController from "../controllers/clientController.js";

const router = express.Router();

router
  .route("/")
  .get(clientController.getClients)
  .post(clientController.createClient);

router
  .route("/:id")
  .get(clientController.getClientById)
  .put(clientController.updateClient)
  .delete(clientController.deleteClient);

export default router;
