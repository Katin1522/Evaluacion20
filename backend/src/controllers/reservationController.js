const reservationController = {};
import reservationModel from "../models/reservation.js";


reservationController.getReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reservas", error });
    }
};


reservationController.createReservation = async (req, res) => {
    const { clientId, vehicle, service, status } = req.body;

    if (!clientId || typeof clientId !== "string") {
        return res.status(400).json({ message: "El ID del cliente es obligatorio" });
    }

    if (!vehicle || typeof vehicle !== "string") {
        return res.status(400).json({ message: "El campo vehículo es obligatorio" });
    }

    if (!service || typeof service !== "string") {
        return res.status(400).json({ message: "El campo servicio es obligatorio" });
    }

    const validStatus = ["pending", "confirmed", "cancelled"];
    if (status && !validStatus.includes(status)) {
        return res.status(400).json({ message: "El estado no es válido" });
    }

    try {
        const newReservation = new reservationModel({
            clientId,
            vehicle,
            service,
            status: status || "pending"
        });

        await newReservation.save();
        res.status(201).json({ message: "Reserva creada correctamente", newReservation });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva", error });
    }
};


reservationController.deleteReservation = async (req, res) => {
    try {
        const deleted = await reservationModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        res.json({ message: "Reserva eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la reserva", error });
    }
};


reservationController.getReservationById = async (req, res) => {
    try {
        const reservation = await reservationModel.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar la reserva", error });
    }
};


reservationController.updateReservation = async (req, res) => {
    const { clientId, vehicle, service, status } = req.body;

    const validStatus = ["pending", "confirmed", "cancelled"];
    if (status && !validStatus.includes(status)) {
        return res.status(400).json({ message: "Estado no válido" });
    }

    try {
        const updatedReservation = await reservationModel.findByIdAndUpdate(
            req.params.id,
            { clientId, vehicle, service, status },
            { new: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }

        res.json({ message: "Reserva actualizada", updatedReservation });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reserva", error });
    }
};

export default reservationController;
