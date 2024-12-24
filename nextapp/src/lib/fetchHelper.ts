import { toast } from "@/hooks/use-toast";

export default async function fetchServerAction<T>(
    action: () => Promise<T>,
    errResult?: any,
    errFunc?: (msg: string) => void
): Promise<T | null> {
    try {
        const result = await action();
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "An Unknown Error Occoured";

        if (errFunc) errFunc(errorMessage);
        else toast({
            variant: 'destructive',
            title: errorMessage
        });
        return errResult || null;
    }
}