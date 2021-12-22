const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.quv1r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("employees_data");
    const employeeCollection = database.collection("employeesData");

    // PUT - Add an emplyee in emplyees collection
    app.post("/add-elmployee", async (req, res) => {
      const employeeData = req.body;
      const result = await employeeCollection.insertOne(employeeData);
      res.json(result);
    });

    // GET - Employees
    app.get("/employees", async (req, res) => {
      const cursor = employeeCollection.find({});
      const employees = await cursor.toArray();
      res.json(employees);
    });

    // GET Single Employee Details
    app.get("/employees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleEmployee = await employeeCollection.findOne(query);
      res.json(singleEmployee);
    });

    // Delete - Delete an employee's data
    app.delete("/employees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await employeeCollection.deleteOne(query);
      res.json(result);
    });

    console.log("database connected successfully");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Simple Express Server is Running");
});

app.listen(port, () => {
  console.log("Server has started at port:", port);
});
