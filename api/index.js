require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Post = require('./models/Post');

const salt = bcrypt.genSaltSync(10);
const secret = 'yuyihjh7y3i3ejrw893j#yyyi777iti9t'

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
        const userDoc = await User.create({ 
            username,
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json({ error: e.message });
    }
    });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
        jwt.sign({username,id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).json({
                id: userDoc._id,
                username,
            });
            });
        } else {
            res.status(400).json('Incorrect password');
            }
        });    

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.sendStatus(401); // Unauthorized
        } 
        res.json(info);
    });
});
app.post('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0) }).json('ok');
});


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { token } = req.cookies; // Get the token from the cookies

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            console.error(err);
            return res.sendStatus(401); // Unauthorized if token verification fails
        }

        const { title, summary, content } = req.body;
        const coverPath = req.file ? req.file.path : ''; // Ensure you handle file uploads correctly
        
        try {
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: coverPath, // Include path of uploaded cover image
                author: info.id // Set author to the ID from the decoded token
            });

            return res.json(postDoc); // Return the newly created post document
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to create post." });
        }
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.sendStatus(401); // Handle unauthorized access

        const {title, summary, content, id} = req.body;
        const postDoc = await Post.findById(id);
        if (!postDoc) return res.status(404).json({ message: 'Post not found' });

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('Not the author');
        }
         // Update the post's fields
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover; // Use the new cover path if provided

        // Save the updated post
        await postDoc.save();

        res.json({postDoc});
        });
});

app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username') // Populate author and include only username
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching posts." });
    }
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is required' });
        }

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) return res.sendStatus(401); // Unauthorized

            const postDoc = await Post.findById(id);
            if (!postDoc) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the user is the author
            if (postDoc.author.toString() !== info.id) {
                return res.status(403).json({ message: 'Not authorized to delete this post' });
            }

            // Delete the post
            await Post.findByIdAndDelete(id);
            res.status(200).json({ message: 'Post deleted successfully' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.listen(4000);

