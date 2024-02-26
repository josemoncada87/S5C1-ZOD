const express = require('express');
const cors = require('cors');
const z = require('zod');

const app = express();
app.use(express.json());
app.use(cors());

const users = []; // Replace with your list of users
const messages = []; // Replace with your list of messages
const securedUsers = []; // Replace with your list of messages

app.get('/', (req, res) => {
    res.status(200).send("Hola cliente 👋");    
});

app.post('/users', (req, res) => {
    if (!req.body) {
        return res.status(400).send("Invalid user data");
    }    
    
    const { name, password } = req.body;
    
    const userSchema = z.object({
        name: z.string(),
        password: z.string(),
    });
    
    try {
        userSchema.parse(req.body);
        if (users.some(user => user.name === name)) {
            return res.status(409).send("User already exists");
        }
        users.push({name});
        securedUsers.push({name, password});
        console.log(users, securedUsers);
        return res.status(200).send("User created");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Invalid user data");
    }
});
app.post('/messages', (req, res) => {
    if (!req.body) {
        return res.status(400).send("Invalid message data");
    }

    const { target, message } = req.body;
    const messageSchema = z.object({
        target: z.string(),
        message: z.string(),
    });

    try {
        messageSchema.parse(req.body);

        const authorizationHeader = req.headers.authorization;
        const nameHeader = req.headers.user;
        
        if (!authorizationHeader || !nameHeader) {
            return res.status(400).send("Malformed Request, are you sure? 🤢");
        }

        const user = users.find(user => user.name === nameHeader);    
        if (!user) {
            return res.status(401).send("User not found");
        }

        const targetUser = users.find(user => user.name === target);
        if (!targetUser) {
            return res.status(404).send("Target user not found");
        }

        messages.push({target: targetUser.name, message, sender: user.name});
        console.log(messages);
        return res.status(200).send("Message sent");

    } catch (error) {
        return res.status(400).send("Invalid message data");
    }
});

app.get('/users', (req, res) => {  
    res.status(200).send({users});    
});

app.get('/messages', (req, res) => {
    const authorizationHeader = req.headers.authorization;
    const nameHeader = req.headers.user;    
    if (!authorizationHeader || !nameHeader) {
        return res.status(400).send("Malformed Request, are you sure? 🤢");
    }    

    const user = securedUsers.find(user => user.name === nameHeader &&
        user.password === authorizationHeader);

    if (!user) {
        return res.status(401).send("Do you have an account or what are you doing? 👻");
    }
    console.log("USERS: \n ", user);
    console.log("MESSAGES: \n ",messages);

    const userMessages = messages.filter(message => message.target === user.name);
    console.log(userMessages);
    return res.status(200).send({userMessages});
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
});