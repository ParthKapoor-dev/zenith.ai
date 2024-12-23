'use server';

import { db } from "@/db";
import schema from "@/db/schema";
import axios from "axios";

export default async function uploadResume(formData: FormData, userId: number) {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

    try {
        // Append required fields
        formData.append("upload_preset", "ml_default");
        formData.append("resource_type", "raw"); // Specify 'raw' for PDFs

        // Send the request with FormData as the body
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // TODO: reusume Link => response.data.secure_url;
        await db.insert(schema.Candidate).values({
            resume: response.data.secure_url,
            userId 
        })  


    } catch (error: any) {
        console.error("Error at Server Action - Upload Resume", error);
        console.error(error?.response?.data);
        throw error;
    }
}
