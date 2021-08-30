import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Loader from "../components/Loader";

const App = () => {
  return (
    <div>
      <Link href={{ pathname: "/[username]", query: { username: "mckn123" } }}>
        Mckeen's Profile
      </Link>

      <Loader show />
    </div>
  );
};

export default App;
