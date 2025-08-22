"use client";

import { TextField, Button, Callout } from "@radix-ui/themes";
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
import Spinner from "@/app/components/spinner";

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
    const [isSubmitting, setSubmitting] = useState(false);

    return (
        <div className="max-w-xl">
            {/* Top-level error callout */}
            {error && (
                <Callout.Root color="red" className="mb-5">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}

            <form
                className="space-y-4"
                onSubmit={handleSubmit(async (data) => {
                    try {
                        setSubmitting(true);
                        await axios.post("/api/issues", data);
                        router.push("/issues");
                    } catch (error) {
                        setSubmitting(false);
                        setError(
                            "An unexpected error occurred while creating the issue."
                        );
                    }
                })}
            >
                {/* Title input */}
                <TextField.Root placeholder="Title" {...register("title")} />
                <ErrorMessage>{errors.title?.message}</ErrorMessage>

                {/* Description input with SimpleMDE */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <div className="border rounded-md overflow-hidden">
                            <SimpleMDE
                                value={value}
                                onChange={onChange}
                                options={{
                                    placeholder: "Write a description...",
                                    spellChecker: false,
                                    autofocus: true, // 👈 auto-focus on load
                                }}
                            />
                        </div>
                    )}
                />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>

                {/* Submit button */}
                <Button disabled={isSubmitting} type="submit">
                    Submit New Issue
                    {isSubmitting && <Spinner />}
                </Button>
            </form>
        </div>
    );
};

export default NewIssuePage;
