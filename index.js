const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlhglrm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const run = async () => {
    try {
        await client.connect();
        const courseCollection = client.db('contentManagement').collection('courses');


        app.get('/courses', async (req, res) => {
            const query = {};
            const cursor = courseCollection.find(query);
            const course = await cursor.toArray();
            res.send(course)
        });

        app.post('/course', async (req, res) => {
            const course = req.body;
            const result = await courseCollection.insertOne(course);
            res.send(result)
        });

        app.get('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await courseCollection.findOne(query);
            res.send(result);
        });

        app.put('/course/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCourse = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    title: updatedCourse.title,
                    price: updatedCourse.price,
                    image: updatedCourse.image,
                    desc: updatedCourse.desc
                }
            };
            const result = await courseCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        app.delete('/course/:id', async (req, res) => {
            const id = req.params.id;
            const result = await courseCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });


    } finally {

    }
}

run().catch((err) => console.log(err));





app.get('/', (req, res) => {
    res.send('App is running')
});

app.listen(port, (req, res) => {
    console.log("App listening to port", port);
});