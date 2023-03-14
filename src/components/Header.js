import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'

// Contexts
import StateContext from '../contexts/StateContext'
import DispatchContext from '../contexts/DispatchContext'

// MUI imports
import { AppBar, Box, Button, Toolbar, Typography, Menu, MenuItem } from '@mui/material';

function Header() {

    const navigate = useNavigate();
    const GlobalState = useContext(StateContext)
    const GlobalDispatch = useContext(DispatchContext)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleProfile = () => {
        setAnchorEl(null)
        navigate('/profile')
    }

    async function handleLogout() {
        setAnchorEl(null)
        const confirmLogout = window.confirm('Are you sure you want to logout?')
        if (confirmLogout) {
            try {
                const response = await Axios.post(
                    'http://127.0.0.1:8000/api-auth-djoser/token/logout/',
                    GlobalState.userToken,
                    {
                        headers: { Authorization: 'Token '.concat(GlobalState.userToken) }
                    },
                )
                GlobalDispatch({ type: 'usersSignsOut' })
                navigate('/')
            } catch (error) {
                console.log(error.response)
            }
        }
    }

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
                            <Button style={{ marginLeft: "1rem" }} color="inherit" onClick={() => navigate('agencies/')}>
                                <Typography variant="h6">Agencies</Typography>
                            </Button>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                            <Button
                                style={{ marginRight: "1rem" }}
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={() => navigate('property/')}>
                                Add Property
                            </Button>

                            {GlobalState.userIsLogged ? (
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="large"
                                    onClick={handleClick}
                                >
                                    {GlobalState.userUsername}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="large"
                                    onClick={() => navigate('login/')}
                                >Login</Button>
                            )}

                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem style={{ width: '9.6rem' }} onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default Header