interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export const StyledButton: React.FC<ButtonProps> = ({ children, onClick, className = "", disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-5 py-2 font-medium text-sm border transition-all 
                ${disabled ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed" :
                    "bg-gray-700 text-white border-gray-700 hover:bg-blue-600 active:bg-blue-700 focus:ring focus:ring-indigo-400"} 
                ${className}`}
        >
            {children}
        </button>
    );
};
