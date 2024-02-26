const express = require('express');
const cors = require('cors');
const z = require('zod');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/users', (req, res) => {
    console.log("Query: ", req.query);
    console.log("Headers: ", req.headers);
    res.send({users});
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    res.send({id});
});

app.post('/users', (req, res) => {    
        const {name, last, email} = req.body;
        if (!name || !last || !email) {
            return res.status(400).send({error: "Invalid data"});
        }
        const user = {
            name,
            last,
            email
        };
        users.push(user);
        res.send({user});
});

app.post('/tasks', (req, res) => {
    const taskSchema = z.object({
        name: z.string(),
        description: z.string().emoji(),
        email: z.string().email(),
        priority: z.enum(["low", "medium", "high"]),
        done: z.boolean()
    });
    const task = taskSchema.safeParse(req.body);
    res.send({task});
});

// El API se quede esperando solicitudes
app.listen(3000, () => {    
    console.log("Server is running on port 3000")
});