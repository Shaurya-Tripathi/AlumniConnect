"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from 'firebase/firestore';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/emoji-picker";
import { useRouter } from "next/navigation";

import qs from "query-string";
import axios from "axios";

interface ChatInputProps {
    targetId: string;
    apiUrl: string;
    query: Record<string, any>;
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput = ({
    targetId,
    apiUrl,
    query,
}: ChatInputProps ) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        }
    })

    const isLoading = form.formState.isSubmitting;

    const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            const userDoc = await getDoc(doc(firestore, "users", targetId));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    name: userData.name || "Unknown User",
                    avatar: userData.pp || "", // Adjust based on Firestore structure
                });
            }
        };

        fetchUser();
    }, [targetId]);

    // New onSubmit handler to log message
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url,values);
            form.reset();
            router.refresh();
        }catch(error){
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-1 pb-2">
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                                        placeholder={`Message ${user?.name}`}
                                        {...field}
                                    />
                                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                                        <EmojiPicker 
                                            onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                {/* Optional: Add a submit button if you want */}
                <button type="submit" className="hidden">Send</button>
            </form>
        </Form>
    )
}