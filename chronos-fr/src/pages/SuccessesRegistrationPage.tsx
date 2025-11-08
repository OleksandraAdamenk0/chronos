import React from "react";
import {useLocation} from "react-router-dom";

// components
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";

const SuccessesRegistrationPage: React.FC = () => {
  const location = useLocation();
  const { login, email } = location.state || {};

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="absolute top-1/16 left-1/16 flex items-center gap-6">
        <div className=" flex items-center gap-2 font-medium">
          <div className=" bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
            <img src="/logo.svg" alt="Logo" />
          </div>
          Chronos
        </div>
        <ModeToggle />
      </div>
      <Card className="max-w-md w-full shadow-lg border border-gray-200">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <h1 className="text-3xl font-bold text-custom-accent-foreground text-center">
            Registration Almost Complete! 🎉
          </h1>
          <p className="text-gray-700 text-center text-base">
            Hi <span className="font-medium text-accent-foreground">{login}</span>!
            We’ve sent a confirmation email to
            <span className="font-medium text-purple-600"> {email}</span>.
          </p>
          <p className="text-gray-600 text-center">
            Please open your inbox and click the confirmation link to activate your account.
          </p>
          <div className="mt-4">
            <button
              className="bg-button hover:bg-button-accent text-white font-semibold py-2 px-4 rounded transition"
              onClick={() => window.location.href="/login"}
            >
              Go to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}

export default SuccessesRegistrationPage;