import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import { prisma } from "@/prisma/client";
import { Card, Flex, Heading } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import React from "react";
import { Text } from "@radix-ui/themes";

interface Props {
    params: {
        id: string;
    };
}

const IssueDetailPage = async ({ params }: Props) => {
    const id = parseInt(params.id);
    if (isNaN(id)) notFound();
    const issue = await prisma.issue.findUnique({
        where: { id },
    });

    if (!issue) {
        notFound();
    }

    return (
        <div>
            <Heading>{issue?.title}</Heading>
            <Flex className="space-x-4" my="2">
                <IssueStatusBadge status={issue?.status} />
                <Text>{issue.createdAt.toString()}</Text>
            </Flex>
            <Card>
                <p>{issue?.description}</p>
            </Card>
        </div>
    );
};

export default IssueDetailPage;
