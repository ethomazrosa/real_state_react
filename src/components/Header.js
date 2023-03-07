import React from 'react'
import { useNavigate } from 'react-router-dom'

// MUI imports
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

function Header() {

    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: 'black' }}>
                    <Toolbar>
                        <div style={{ marginRight: "auto" }}>
                            <Button color="inherit" onClick={() => navigate('/')}>
                                <Typography variant="h5">Home</Typography>
                            </Button>
                        </div>
                        <div>
                            <Button style={{ marginRight: "1rem" }} color="inherit" onClick={() => navigate('listings/')}>
                                <Typography variant="h6">Listings</Typography>
                            </Button>
                            <Button style={{ marginLeft: "1rem" }} color="inherit" onClick={() => navigate('/')}>
                                <Typography variant="h6">Agencies</Typography>
                            </Button>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                            <Button style={{ marginRight: "1rem" }} variant="contained" color="success" size="large" onClick={() => navigate('/')}>
                                Add Property
                            </Button>
                            <Button variant="contained" color="info" size="large" onClick={() => navigate('login/')}>
                                Login
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default Header