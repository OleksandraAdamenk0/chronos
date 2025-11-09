import './App.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";

// pages
import MainPage from "@/pages/MainPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import RegisterPage from "@/pages/RegisterPage.tsx";
import SuccessesRegistrationPage from "@/pages/SuccessesRegistrationPage.tsx";


// components
import { Toaster } from "@/components/ui/sonner";

import UserProvider from "@/components/UserProvider.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage/> } />
          <Route path="/register" element={<RegisterPage/> } />
          <Route path="/register/success" element={<SuccessesRegistrationPage/> } />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage/>} />
            <Route path="/calendar" element={<MainPage/>} />


          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}


export default App
