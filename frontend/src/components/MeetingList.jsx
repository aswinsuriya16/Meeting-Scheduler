import React from 'react';
import { 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton, 
    Typography,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const MeetingList = ({ meetings, onMeetingDeleted }) => {
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/meetings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onMeetingDeleted(id);
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Scheduled Meetings
            </Typography>
            <List>
                {meetings.length === 0 ? (
                    <Typography color="textSecondary">No meetings scheduled</Typography>
                ) : (
                    meetings.map((meeting) => (
                        <ListItem
                            key={meeting._id}
                            secondaryAction={
                                <IconButton 
                                    edge="end" 
                                    aria-label="delete"
                                    onClick={() => handleDelete(meeting._id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                            sx={{ border: '1px solid #eee', mb: 1, borderRadius: 1 }}
                        >
                            <ListItemText
                                primary={meeting.title}
                                secondary={
                                    <Box>
                                        <Typography variant="body2">
                                            {formatDate(meeting.date)} | {meeting.startTime} - {meeting.endTime}
                                        </Typography>
                                        <Typography variant="body2">
                                            Organizer: {meeting.organizer}
                                        </Typography>
                                        <Typography variant="body2">
                                            Participants: {meeting.participants.join(', ')}
                                        </Typography>
                                        <Typography variant="body2">
                                            {meeting.description}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default MeetingList;
