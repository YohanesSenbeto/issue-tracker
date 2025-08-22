import { NextRequest } from "next/server";
import { z } from 'zod';
import { prisma } from "@/prisma/client";

const CreateIssueSchema = z.object({
  title: z.string().min(1,'Title is required').max(255),
  description: z.string().min(1,'Description is required')
});

export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();

  const validation = CreateIssueSchema.safeParse(body);
  //if the validation is not Successful

  if (!validation.success) {
      return new Response(JSON.stringify(validation.error.format()), { status: 400 });
    }
  
    const newIssue = await prisma.issue.create({
      data: { title: validation.data.title, description: validation.data.description }
    });

  return new Response(JSON.stringify(newIssue), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
}
