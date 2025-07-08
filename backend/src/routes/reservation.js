import express from "express";
import reservationsController from "../controllers/reservationController.js";

const router = express.Router();

router
  .route("/")
  .get(reservationsController.getReservations)
  .post(reservationsController.createReservation);

router
  .route("/:id")
  .get(reservationsController.getReservationById)
  .put(reservationsController.updateReservation)
  .delete(reservationsController.deleteReservation);

export default router;
