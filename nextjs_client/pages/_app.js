import "../styles/globals.css";
import Navbar from "../components/Navbar";
// import { UserContext } from "../lib/context";
// import { useUserData } from "../lib/hooks";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  // const userData = useUserData();

  return (
    <>
    
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    

    </>
  );
}

export default MyApp;
