import AuthLayout from "@/components/auth/AuthLayout/AuthLayout";
import AuthCard from "@/components/auth/AuthCard/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthLayout className="register_page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-8 col-lg-8 col-md-10 col-12">
                        <AuthCard>
                            <RegisterForm />
                        </AuthCard>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}