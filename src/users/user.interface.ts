import mongoose from "mongoose";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
    };
    permissions?: {
        _id: string;
        name: string;
        apiPath: string;
        module: string;
    }[]
    company: {
        _id: mongoose.Schema.Types.ObjectId,
        name: string,
    };
}
