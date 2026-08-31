import AuthLayout from "@/components/auth/AuthLayout/AuthLayout";
import AuthCard from "@/components/auth/AuthCard/AuthCard";
import LoginForm from "@/components/auth/LoginForm/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout className="login_page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-5 col-lg-6 col-md-8 col-12">
                        <AuthCard className="login_card">
                            <LoginForm />
                        </AuthCard>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}