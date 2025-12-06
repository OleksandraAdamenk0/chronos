import React, {useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";

// types
import type {LoginFormType} from "@/types";

// components
import LoginForm from "@/components/auth/loginForm.tsx";
import {ModeToggle} from "@/components/theme/mode-toggle.tsx";
import { toast } from "sonner";

// services
import {login} from "@/services/authService.ts";

// contexts
import { UserContext } from "@/contexts/UserContext";

const LoginPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const {path} = location.state || {undefined};
  console.log("path: ", path, location);

  const handleSubmit = async (data: LoginFormType) => {
    try {
      const user = await login(data);
      if (userContext) userContext.setUser(user);
      if (path) navigate(path);
      else navigate("/calendar");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="absolute top-1/16 left-1/16 flex items-center gap-2 font-medium">
        <div className=" bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
          <img src="/logo.svg" alt="Logo" className="logo"/>
        </div>
        Chronos
      </div>

      <div className="absolute top-1/9 left-1/16">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm md:max-w-4xl">

        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default LoginPage;