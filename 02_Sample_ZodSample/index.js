const express = require('express');
const z = require('zod');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


const userSchema = z.object(
    { 
        name: z.string(),
        email: z.string().email(),
        age: z.number().int().positive()
    }
);

app.post('/users', (req, res) => {
    try {
        const user = userSchema.parse(req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
