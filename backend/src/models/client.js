import { Schema, model } from "mongoose";

const clientShema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
    }, 
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String
    },
    age: {
        type: Number
    },
    
});

export default model("client", clientShema);