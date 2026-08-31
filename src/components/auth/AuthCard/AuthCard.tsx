import { ReactNode } from "react";


interface AuthCardProps {
    children: ReactNode;
    className?: string;
}

const AuthCard = ({
    children,
    className = "",
}: AuthCardProps) => {
    return (
        <div className={`auth_card ${className}`}>
            {children}
        </div>
    );
};

export default AuthCard;