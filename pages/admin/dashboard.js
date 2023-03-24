import Layout from "../../components/layout";
import { useState, useEffect } from "react";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { parseCookies } from "nookies";


export default function Dashboard(props) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookieSetter, setCookie, removeCookie] = useCookies(["isLoggedIn"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    setIsLoggedIn(cookies.isLoggedIn === "true");
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/authUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const now = new Date();
          const expires = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
          setCookie("isLoggedIn", "true", { path: "/", expires });
          setIsLoggedIn(true);
          setPassword("");
        } else {
          setErrorMessage(data.message);
        }
      } else {
        setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      }
    } catch (error) {
      setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  };

  function logout() {
    removeCookie('isLoggedIn', { path: '/' })
    setIsLoggedIn(false);
  }

  if (isLoggedIn == true) {
    return (
      <Layout className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h1>Dashboard</h1>
        <Link href={"/admin/new-post"}>Neuer Post</Link>
        <br/><br/>
        <button onClick={logout}>Logout</button>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
        ></input>
        <button onClick={handleLogin}>Login</button>
      </Layout>
    );
  }
}
