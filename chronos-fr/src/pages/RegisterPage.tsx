import { SignupForm } from "@/components/auth/signupForm.tsx"
import type {SignupFormType} from "@/types";
import {register} from "@/services/authService.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import {useState} from "react";
import AvatarUpload from "@/components/avatarUpload.tsx";

export default function SignupPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("https://avatar.iran.liara.run/public/48");
  const navigate = useNavigate();

  const handleSubmit = async (data: SignupFormType) => {
    console.log(data)
    try {
      const result: boolean = await register(data);
      if (result) navigate("/register/success", {state: {login: data.login, email: data.email}});
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="grid min-h-svh max-w-svw lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-4 md:justify-around flex-col md:flex-row">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
              <img src="/logo.svg" alt="Logo" className="logo" />
            </div>
            Chronos
          </a>
            <ModeToggle />
        </div>


        <div className="flex flex-1 items-center justify-center">
          <Card className="w-xs md:w-md transition-transform duration-500 hover:scale-105
               animate-pulse-glow">
            <CardContent className="w-full max-w-xs md:max-w-md">
              <SignupForm
                photo={photo}
                setPhoto={setPhoto}
                preview={preview}
                setPreview={setPreview}
                onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>

      <AvatarUpload
        preview={preview}
        setPreview={setPreview}
        setFile={setPhoto}
        variant="large"
      />
    </div>
  )
}
