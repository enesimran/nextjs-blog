import Layout from "../../components/layout";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import clientPromise from "../../lib/mongodb";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function getServerSideProps(context) {
  const id = context.params.id;

  const client = await clientPromise;
  const collection = await client.db("blog").collection("posts");
  let postDocument = await collection.findOne({ path: id });

  if(postDocument){
    const processedContent = await remark().use(html).process(postDocument.content)
    const contentHtml = processedContent.toString();
    const content = matter(postDocument.content)
    const dateOfPost = postDocument.date
    const returnObject = {
      id,
      dateOfPost,
      contentHtml
    }

    return {
      props: {
       returnObject
      },
    };
  } else {
    return {
      props: {
       returnObject: {}
      },
    };
  }
 



  
}

export default function Post({ returnObject }) {
  if(returnObject.id){
    return (
      <Layout>
        <Head>
          <title>{returnObject.title}</title>
            <link rel='icon' href="favicon.ico"></link>
        </Head>
        <article>
            <h1 className={utilStyles.headingXl}>{returnObject.title}</h1>
            <div className={utilStyles.lightText}>
  
              <Date dateString={returnObject.dateOfPost} />
            </div>
            <div dangerouslySetInnerHTML={{ __html: returnObject.contentHtml }} />
          </article>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <h1>404</h1>
        <h2>Wir konnten diesen Post leider nicht finden.</h2>
      </Layout>
    )
  }
  
  
  
}

