import { NextRequest } from "next/server";
import { prisma } from "@/prisma/client";
import { CreateIssueSchema } from "../../validationSchemas";

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
