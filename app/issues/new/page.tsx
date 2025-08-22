"use client";

import { TextField, Text, Button, Callout } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";

// Fix: dynamically import SimpleMDE
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
});

type IssueForm = z.infer<typeof CreateIssueSchema>;

const NewIssuePage = () => {
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IssueForm>({
        resolver: zodResolver(CreateIssueSchema),
    });
    const [error, setError] = useState("");
    return (
        <div className="max-w-xl">
            {error && (
                <Callout.Root color="red" className="mb-5">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}
            <form
                className="space-y-3"
                onSubmit={handleSubmit(async (data) => {
                    try {
                        await axios.post("/api/issues", data);
                        router.push("/issues");
                    } catch (error) {
                        setError(
                            "An unexpected error occurred while creating the issue."
                        );
                    }
                })}
            >
                <TextField.Root
                    placeholder="Title"
                    {...register("title")}
                ></TextField.Root>

                <ErrorMessage>{errors.title?.message}</ErrorMessage>

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <SimpleMDE
                            {...field}
                            options={{ placeholder: "Description" }}
                        />
                    )}
                />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>

                <Button type="submit">Submit New Issue</Button>
            </form>
        </div>
    );
};

export default NewIssuePage;
