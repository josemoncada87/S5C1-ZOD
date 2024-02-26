import express from "express";
import { z as zod } from 'zod';
import cors from 'cors';
import { fromZodError } from 'zod-validation-error';

const app = express();

app.use(cors());    
app.use(express.json());

const userSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    age: zod.number().int().positive()
});

app.post('/users', (req, res) => {
    try {
        const user = userSchema.parse(req.body);
        res.json(user);
    } catch (err) {
        const validationError = fromZodError(err);
        console.log(validationError.toString());
        res.status(400).json({ Response : validationError.toString() });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
