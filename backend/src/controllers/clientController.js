const clientController = {};
import clientModel from "../models/client.js";

clientController.getClients = async (req, res) => {
    try {
        const clients = await clientModel.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: "Error getting clients", error });
    }
};



clientController.createClient = async (req, res) => {
    const { name, email, password, phone, age } = req.body;

if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: "El nombre es requerido y debe ser texto válido" });
}


if (email) {
    const existing = await clientModel.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
    });
    if (existing) {
        return res.status(409).json({ message: "Email ya está en uso" });
    }
}

    if (!password || password.length < 6) {
        return res.status(400).json({ message: "La contraseña necesita 6 caracteres" });
    }

    if (age !== undefined && (typeof age !== 'number' || age < 0)) {
        return res.status(400).json({ message: "La edad tiene que ser positiva" });
    }

    try {
       
        const existing = await clientModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const newClient = new clientModel({ name, email, password, phone, age });
        await newClient.save();

        res.status(201).json({ message: "Client saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving client", error });
    }
};


clientController.deleteClient = async (req, res) => {
    try {
        const deletedClient = await clientModel.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.json({ message: "Client deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error para eliminar un cliente", error });
    }
};


clientController.getClientById = async (req, res) => {
    try {
        const client = await clientModel.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: "Error getting client", error });
    }
};


clientController.updateClient = async (req, res) => {
    const { name, email, password, phone, age } = req.body;

   
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Formato invalido" });
    }

    if (password && password.length < 6) {
        return res.status(400).json({ message: "La contraseña tiene que tener 6 caracteres" });
    }

    if (age !== undefined && (typeof age !== 'number' || age < 0)) {
        return res.status(400).json({ message: "El numero tiene que esatr positivo" });
    }

    try {
        const updatedClient = await clientModel.findByIdAndUpdate(
            req.params.id,
            { name, email, password, phone, age },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json({ message: "Client updated", updatedClient });
    } catch (error) {
        res.status(500).json({ message: "Error updating client", error });
    }
};

export default clientController;
