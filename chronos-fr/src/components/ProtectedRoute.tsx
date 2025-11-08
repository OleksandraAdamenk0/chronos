import { useNavigate, Outlet } from "react-router-dom";
import {useEffect} from "react";
import { useUser } from "@/hooks/useUser";

const ProtectedRoute: React.FC = () => {
  const { isLoaded, getUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user && isLoaded) navigate('/login');
  }, [isLoaded])

  return <Outlet/>;
}

export default ProtectedRoute;