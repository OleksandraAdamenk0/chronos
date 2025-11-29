import './App.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";

// pages
import MainPage from "@/pages/MainPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import RegisterPage from "@/pages/RegisterPage.tsx";
import SuccessesRegistrationPage from "@/pages/SuccessesRegistrationPage.tsx";
import {CreateEventPage} from "@/pages/CreateEventPage.tsx";


// components
import { Toaster } from "@/components/ui/sonner";

// providers
import CalendarProvider from "@/components/CalendarProvider.tsx";
import UserProvider from "@/components/UserProvider.tsx";
import EventProvider from "@/components/EventProvider.tsx";

import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import Layout from "@/components/layout.tsx";

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <CalendarProvider>
          <EventProvider>
            <Toaster />
            <Routes>
              <Route path="/login" element={<LoginPage/> } />
              <Route path="/register" element={<RegisterPage/> } />
              <Route path="/register/success" element={<SuccessesRegistrationPage/> } />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout children={<MainPage/>} />} />
                <Route path="/calendar" element={<Layout children={<MainPage/>} />} />
                <Route path="/create" element={<Layout children={<CreateEventPage />} />} />
              </Route>
            </Routes>
          </EventProvider>
        </CalendarProvider>
      </UserProvider>
    </BrowserRouter>
  )
}


export default App
