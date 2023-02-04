const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');

//ROUTE 1:Get All the notes using:GET "/api/auth/getuser".Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured")
    }
})

//ROUTE 2:Add a new note using: POST "/api/auth/addnote".Login Required
router.post('/addnote', fetchuser,
    [body('title', 'Add a Title').isLength({ min: 3 }),
    body('description', 'Please provide a description').isLength({ min: 5 }),],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const note = new Notes({ title, description, tag, user: req.user.id })
            const savedNote = await note.save()
            res.json(savedNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured")
        }
    })

// ROUTE 3:Update an existing note using:PUT "/api/auth/updatenote".Login Requied
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(200).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured")
    }

})

//ROUTE 4:Delete an existing Note using:DELETE "api/notes/deletenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        //allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(200).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured")
    }

})

module.exports = router