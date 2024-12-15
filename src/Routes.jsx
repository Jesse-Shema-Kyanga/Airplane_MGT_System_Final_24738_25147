import { createBrowserRouter } from "react-router-dom";
import App from './App';
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import PilotManagement from "./pages/PilotManagement";
import Signup from "./pages/Signup";
import FlightManagement from "./pages/FlightManagement";
import PassengerFlights from "./pages/PassengerFlights";
import MyTickets from "./pages/MyTickets";
import PasswordReset from "./pages/PasswordReset";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import FlightAttendantManagement from "./pages/FlightAttendantManagement";
import AirplaneManagement from "./pages/AirplaneManagement"
import ScheduleCrew from "./pages/ScheduleCrew";
import ScheduleProgram from "./pages/ScheduleProgram";
import MessageManagement from "./pages/MessageManagement";
import MaintenanceCheck from "./pages/MaintenanceCheck";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/admin",
        element: <Admin />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/pilotManagement",
        element: <PilotManagement />,
    },
    {
        path: "/flightManagement",
        element: <FlightManagement />,
    },
    {
        path: "/passenger-flights",
        element: <PassengerFlights />,
    },
    {
        path: "/my-tickets",
        element: <MyTickets />,
    },
    {
        path: "/forgot-password",
        element: <PasswordReset />,
    },
    {
        path: "/reset-password",
        element: <PasswordReset />,
    },
    {
        path: "/2fa",
        element: <TwoFactorAuth />,
    },{
        path:"/flight-attendant",
        element:<FlightAttendantManagement/>
    },{
        path:"/airplane-management",
        element:<AirplaneManagement/>
    },{
        path:"/schedule-crew",
        element:<ScheduleCrew/>
    },{
        path:"/schedule-program",
        element:<ScheduleProgram/>
    },{
        path:"/maintenance-page",
        element:<MessageManagement/>
    },{
        path:"/maintenance-check",
        element:<MaintenanceCheck/>
    }
]);

export default router;
