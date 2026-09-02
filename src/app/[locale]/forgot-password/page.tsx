import AuthLayout from "@/components/auth/AuthLayout/AuthLayout";
import AuthCard from "@/components/auth/AuthCard/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPassword/ForgotPasswordForm";

const ForgotPasswordPage = () => {
    return (
        <AuthLayout className="forgot_password_page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-6 col-md-8 col-12">
                        <AuthCard className="forgot_password_card">
                            <ForgotPasswordForm />
                        </AuthCard>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;