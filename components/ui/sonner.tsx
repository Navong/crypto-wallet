"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { FaCheckCircle } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ToasterProps = React.ComponentProps<typeof Sonner> 

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "dark" } = useTheme();
    

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
                
            }}
            icons={{
                success: <FaCheckCircle className="text-[#39A6FF] h-4 w-4" />,
                error: <RiErrorWarningFill className="text-[#39A6FF] h-[18px] w-[18px]" />,
                loading: <AiOutlineLoading3Quarters className="text-[#39A6FF] h-[18px] w-[18px] animate-spin" />,
            }}
            {...props}
        />
    );
};

export { Toaster };
