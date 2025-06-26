const express = require("express");
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

//Route 1 : Fetch all the notes using GET /api/notes/fetchallnotes. LOGIN required
router.get('/fetchallnotes',fetchuser,async(req, res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

//Route 1 : Add a new note using POST /api/notes/addnote. LOGIN required
router.post('/addnote',fetchuser,[
    body('title', 'Enter a valid name').isLength({ min: 3 }),
    body('description', 'Enter a valid email').isLength({ min: 5 }),
    ],async(req, res)=>{
        try {
            const {title, description, tag }=req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            };

            const note = new Notes({
                title, description, tag, user: req.user.id
            });
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
        
});

module.exports = router