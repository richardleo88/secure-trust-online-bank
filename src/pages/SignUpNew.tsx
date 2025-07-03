import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComprehensiveSignUpForm from "@/components/auth/ComprehensiveSignUpForm";
import RegistrationSuccess from "@/components/auth/RegistrationSuccess";

const SignUpNew = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  const handleRegistrationSuccess = (data: any) => {
    setUserData(data);
    setIsSuccess(true);
  };

  if (isSuccess && userData) {
    return <RegistrationSuccess userData={userData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">U</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">UnionTrust</h1>
              <p className="text-sm text-muted-foreground">Capital</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">Join Us Today</h2>
          <p className="text-muted-foreground">Create your comprehensive banking account</p>
        </div>

        <ComprehensiveSignUpForm onSuccess={handleRegistrationSuccess} />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth")}
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-primary"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpNew;