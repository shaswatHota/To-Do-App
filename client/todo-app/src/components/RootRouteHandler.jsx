
import LandingPage from "../Pages/LandingPage";
import PageSkeleton from "./PageSkeleton";

const RootRouteHandler = () => {
  const token = localStorage.getItem("token");

  return token ? <PageSkeleton /> : <LandingPage />;
};

export default RootRouteHandler;
