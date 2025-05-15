import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Paper, Typography, Grid } from '@mui/material';
import { EventAvailable, Person } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MeetingForm = ({ onMeetingCreated }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        participants: '',
        organizer: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                organizer: user.username
            }));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/meetings',
                {
                    ...formData,
                    participants: formData.participants.split(',').map(p => p.trim())
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            onMeetingCreated(response.data);
            setFormData({
                title: '',
                description: '',
                date: '',
                startTime: '',
                endTime: '',
                participants: '',
                organizer: user ? user.username : ''
            });
        } catch (error) {
            console.error('Error creating meeting:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 4,
                borderRadius: 2,
                background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
                textAlign: 'center'
            }}
        >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EventAvailable sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Schedule New Meeting
                </Typography>
            </Box>

            <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto'
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiFormLabel-asterisk': {
                                    display: 'none'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiFormLabel-asterisk': {
                                    display: 'none'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiFormLabel-asterisk': {
                                    display: 'none'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiFormLabel-asterisk': {
                                    display: 'none'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="End Time"
                            name="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiFormLabel-asterisk': {
                                    display: 'none'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Participants (comma-separated)"
                            name="participants"
                            value={formData.participants}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiFormLabel-asterisk': {
                                    display: 'none'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Organizer"
                            name="organizer"
                            value={formData.organizer}
                            InputProps={{
                                readOnly: true,
                                startAdornment: <Person sx={{ color: 'primary.main', mr: 1 }} />,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 3,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
                        boxShadow: '0 3px 15px rgba(33, 150, 243, 0.3)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
                        }
                    }}
                >
                    Schedule Meeting
                </Button>
            </Box>
        </Paper>
    );
};

export default MeetingForm;
