import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/dashboard", Component: Dashboard },
  { path: "/about", Component: AboutPage },
  { path: "/contact", Component: ContactPage },
]);
