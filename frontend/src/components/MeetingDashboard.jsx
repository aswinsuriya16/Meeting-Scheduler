import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, AppBar, Toolbar, Zoom, Grid, Paper } from '@mui/material';
import { LogoutOutlined, EventNoteOutlined } from '@mui/icons-material';
import MeetingForm from './MeetingForm';
import MeetingList from './MeetingList';
import scheduleIllustration from '../assets/schedule-illustration.svg';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MeetingDashboard = () => {
    const [meetings, setMeetings] = useState([]);
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/meetings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMeetings(response.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    const handleMeetingCreated = (newMeeting) => {
        setMeetings([...meetings, newMeeting]);
    };

    const handleMeetingDeleted = (deletedId) => {
        setMeetings(meetings.filter(meeting => meeting._id !== deletedId));
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventNoteOutlined sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                Meeting Scheduler
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Welcome, {user?.username}!
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={logout}
                                startIcon={<LogoutOutlined />}
                                sx={{
                                    borderRadius: 2,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    }
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container 
                maxWidth="xl" 
                sx={{ 
                    py: 4,
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex'
                }}
            >
                <Grid container spacing={4} alignItems="flex-start">
                    <Grid item xs={12} lg={8}>
                        <Box sx={{ width: '100%' }}>
                            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                                <Box sx={{ mb: 4 }}>
                                    <MeetingForm onMeetingCreated={handleMeetingCreated} />
                                </Box>
                            </Zoom>
                            
                            <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                                <Box>
                                    <MeetingList 
                                        meetings={meetings} 
                                        onMeetingDeleted={handleMeetingDeleted}
                                    />
                                </Box>
                            </Zoom>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} lg={4}>
                        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                            <Paper
                                elevation={0}
                                sx={{ 
                                    position: 'sticky',
                                    top: 24,
                                    display: { xs: 'none', lg: 'block' },
                                    textAlign: 'center',
                                    p: 4,
                                    borderRadius: 2,
                                    bgcolor: 'transparent'
                                }}
                            >
                                <img 
                                    src={scheduleIllustration} 
                                    alt="Schedule Illustration" 
                                    style={{ 
                                        width: '100%',
                                        maxWidth: '500px',
                                        height: 'auto',
                                        marginBottom: '2rem',
                                        filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))'
                                    }}
                                />
                                <Typography 
                                    variant="h5" 
                                    color="primary"
                                    sx={{ 
                                        fontWeight: 'bold',
                                        mb: 2
                                    }}
                                >
                                    Organize Your Meetings
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    color="text.secondary"
                                    sx={{ 
                                        px: 2,
                                        fontSize: '1.1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Schedule, manage, and track your meetings efficiently with our intuitive interface.
                                    Stay organized and never miss an important meeting again.
                                </Typography>
                            </Paper>
                        </Zoom>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default MeetingDashboard;
