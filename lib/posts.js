import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { MongoClient, ServerApiVersion } from "mongodb";
import clientPromise from "./mongodb";

const dbPass = "9haxS97IBkiRWGt1";
const uri =
  "mongodb+srv://rakimon:" +
  dbPass +
  "@cluster0.ubcr8wz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const postsDirectory = path.join(process.cwd(), "posts");

// export async function database() {
//   const client = new MongoClient(uri);
//   try {
//     await client.connect();
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await client.close();
//   }
// }

// export async function getPosts() {

//   await client.connect();
//   const collection = await client.db("blog").collection("posts");
//   const sort = {date: 1}
//   const allDocs = await collection.find({}).sort(sort);
//   let results = [];
//   await allDocs.forEach(doc => {
//     const id = doc.path;
//     const title = doc.title;
//     const date = doc.date;
//     const data = matter(doc.content)
//     results.push({id,
//       title,
//       date,
//       ...data.data});
//   })
//   console.log(results);
//   await client.close();
//   return results;
// }

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}


export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}


