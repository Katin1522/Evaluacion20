import { Schema, model } from "mongoose";

const reservationShema = new Schema(
    {
    
    clientId: {
        type: Schema.Types.ObjectId
    },
    vehicle :{
        type: String
    }, 
    service:{
        type: String
    },
    status:{
        type:String
    }

    }
);

export default model ("reservation", reservationShema );