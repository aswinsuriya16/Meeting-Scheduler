import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Link, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PersonOutline, EmailOutlined, LockOutlined } from '@mui/icons-material';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const result = await register(formData.username, formData.email, formData.password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <>
            <div className="interactive-bg" />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 4,
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                            }
                        }}
                    >
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography 
                                variant="h4" 
                                component="h1"
                                sx={{
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Create Account
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary"
                                sx={{ opacity: 0.8 }}
                            >
                                Join us to start scheduling meetings
                            </Typography>
                        </Box>

                        {error && (
                            <Box 
                                className="error-message"
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: 'error.light',
                                    color: 'error.dark',
                                    border: 1,
                                    borderColor: 'error.main',
                                }}
                            >
                                <Typography variant="body2" align="center">
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        <Box 
                            component="form" 
                            onSubmit={handleSubmit}
                            sx={{
                                '& .MuiTextField-root': {
                                    mb: 2
                                }
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <PersonOutline sx={{ color: 'primary.main', mr: 1 }} />
                                    ),
                                }}
                                sx={{
                                    '& .MuiFormLabel-asterisk': {
                                        display: 'none'
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <EmailOutlined sx={{ color: 'primary.main', mr: 1 }} />
                                    ),
                                }}
                                sx={{
                                    '& .MuiFormLabel-asterisk': {
                                        display: 'none'
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <LockOutlined sx={{ color: 'primary.main', mr: 1 }} />
                                    ),
                                }}
                                sx={{
                                    '& .MuiFormLabel-asterisk': {
                                        display: 'none'
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <LockOutlined sx={{ color: 'primary.main', mr: 1 }} />
                                    ),
                                }}
                                sx={{
                                    '& .MuiFormLabel-asterisk': {
                                        display: 'none'
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                className="ripple"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1976D2 30%, #1565C0 90%)',
                                        boxShadow: '0 6px 10px 2px rgba(33, 150, 243, .4)',
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                            <Typography 
                                variant="body2" 
                                align="center"
                                sx={{
                                    mt: 2,
                                    color: 'text.secondary',
                                    '& a': {
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        transition: 'color 0.2s ease',
                                        '&:hover': {
                                            color: 'primary.dark'
                                        }
                                    }
                                }}
                            >
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#2196F3',
                                        textDecoration: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Login
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default Register;
