import React, { PropsWithChildren, ReactNode } from "react";
import { Text } from "@radix-ui/themes";

// interface Props {
//     children: ReactNode;
//We longer need these props }

const ErrorMessage = ({ children }: PropsWithChildren) => {
    return (
        <Text color="red" as="p">
            {children}
        </Text>
    );
};

export default ErrorMessage;
