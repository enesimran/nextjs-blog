import Layout from "../../components/layout"
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useCookies } from 'react-cookie'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';



export default function NewPost() {

    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [path, setPath] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const cookieValue = Cookies.get('isLoggedIn');
        if (!cookieValue) {
            router.push('/admin/dashboard');
            // oder window.location.href = '/verweis-seite';
        } else {
            setIsLoggedIn(true);
        }
    }, []);


    async function createPost(e) {

        e.preventDefault();

        try {
            const response = await fetch("/api/createPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content, path }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert("Post erstellt")
                    router.push("/posts/" + path)
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


    if (isLoggedIn) {
        return (
            <Layout>
                <h1>Neuen Post erstellen</h1>
                <form onSubmit={createPost}>
                <input required value={path} onChange={(e) => setPath(e.target.value)} placeholder="Pfadname"></input>
                <input required placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                <br />
                <textarea required placeholder="Inhalt" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                <br />
                <button type="submit">Senden</button>
                </form>
            </Layout>
        )
    }
}






