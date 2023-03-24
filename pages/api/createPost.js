import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { title, content, path } = req.body;
        const client = await clientPromise;
        const collection = client.db("blog").collection("posts");
        
        let date = new Date() 
        date = date.toISOString().split('T')[0]
        date.toString().substring(0,10)

        const post = {
            title: title,
            date: date,
            content: content,
            path, path
        }


        collection.insertOne(post, function(err, res) {
            if (err){
                console.log(err)
                res.status(200).json({message: "database error"})
                throw err;
            } else {
                console.log("Post created");
                
            }
           
        })
        res.status(200).json({ success: true });
    
    } else {
        res.status(405).json({ message: "Nur POST-Anfragen werden unterstützt." });
    }
}