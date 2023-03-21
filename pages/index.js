import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Date from "../components/date";
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import matter from "gray-matter";


export async function getServerSideProps(context) {
  let allPostsData = [];
  try {
    const client = await clientPromise;
    const collection = await client.db("blog").collection("posts");
    const sort = { date: -1 };
    const allDocs = await collection.find({}).sort(sort);
   
    await allDocs.forEach((doc) => {
      const id = doc.path;
      const title = doc.title;
      const date = doc.date;
      const data = matter(doc.content);
      allPostsData.push({ id, title, date, ...data.data });
    });

    return {
          props: {
            allPostsData
          },
        };
  } catch (e) {
    console.error(e)
    return {
      props: {
        allPostsData
      },
    };
  }
}

export default function Home(props) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hallöchen! Das ist eine kleine Erweiterung vom <a href="https://nextjs.org/learn">NextJS Getting Started Tutorial</a>
        </p>
        <desc>Ich habe das ganze um eine Datenbankverbindung erweitert! In Zukunft möchte ich auch eine UI einbauen, mit der man Posts erstellen kann :^)</desc>
        
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
            {props.allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
