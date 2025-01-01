'use server';

import { db } from "@/db";
import schema from "@/db/schema/_index";
import { verifySession } from "@/lib/session";
import axios from "axios";

export default async function uploadResume(formData: FormData) {
    const url =
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

    try {

        const session = await verifySession();
        const userId = session.user.id;

        // Append required fields
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        formData.append("resource_type", "raw"); // Specify 'raw' for PDFs

        // Send the request with FormData as the body
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // TODO: reusume Link => response.data.secure_url;
        await db.insert(schema.Candidates).values({
            resume: response.data.secure_url,
            userId,
            isComplete: false
        })


    } catch (error: any) {
        console.error("Error at Server Action - Upload Resume", error);
        console.error(error?.response?.data);
        throw error;
    }
}
