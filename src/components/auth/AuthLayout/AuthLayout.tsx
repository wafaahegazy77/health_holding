import { ReactNode } from "react";

import AuthNavbar from "@/components/auth/AuthNavbar/AuthNavbar";

import "./_AuthLayout.scss";

interface AuthLayoutProps {
    children: ReactNode;
    className?: string;
}

const AuthLayout = ({
    children,
    className = "",
}: AuthLayoutProps) => {
    return (
        <main className={`auth_layout ${className}`}>
            <AuthNavbar />

            <div className="auth_layout_content">
                {children}
            </div>
        </main>
    );
};

export default AuthLayout;