const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');

// Get all meetings
router.get('/', auth, async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching meetings' });
    }
});

// Create a new meeting
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, date, startTime, endTime, participants } = req.body;
        
        const meeting = new Meeting({
            title,
            description,
            date,
            startTime,
            endTime,
            participants,
            organizer: req.user.username // Use the authenticated user's username
        });

        const savedMeeting = await meeting.save();
        res.status(201).json(savedMeeting);
    } catch (error) {
        res.status(400).json({ error: 'Error creating meeting' });
    }
});

// Delete a meeting
router.delete('/:id', auth, async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        // Only allow the organizer to delete the meeting
        if (meeting.organizer !== req.user.username) {
            return res.status(403).json({ error: 'Not authorized to delete this meeting' });
        }

        await meeting.remove();
        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting meeting' });
    }
});

module.exports = router;
