import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Loader from "../components/Loader";

const App = () => {
  return (
    <div>
      {/* query: { username: "mckn123" }  */}
      <Link href={{ pathname: "/[username]" }}>Mckeen's Profile</Link>

      <Loader show />
    </div>
  );
};

export default App;
