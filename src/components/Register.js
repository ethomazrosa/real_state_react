import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'

//  MUI
import { Box, TextField, Grid, Card, Typography, Button } from '@mui/material';

function Register() {

    const initialState = {
        usernameValue: '',
        emailValue: '',
        passwordValue: '',
        password2Value: '',
        sendRequest: 0,
    }

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen
                break
            case 'catchEmailChange':
                draft.emailValue = action.emailChosen
                break
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen
                break
            case 'catchPassword2Change':
                draft.password2Value = action.password2Chosen
                break
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest + 1
                break
            default:
                break
        }
    }

    const navigate = useNavigate();
    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    function FormSubmit(e) {
        e.preventDefault()
        dispatch({ type: 'changeSendRequest' })
    }

    useEffect(() => {
        if (state.sendRequest) {
            const source = Axios.CancelToken.source()
            async function SignUp() {
                try {
                    const response = await Axios.post(
                        'http://127.0.0.1:8000/api-auth-djoser/users/',
                        {
                            username: state.usernameValue,
                            email: state.emailValue,
                            password: state.passwordValue,
                            re_password: state.password2Value,
                        },
                        { cancelToken: source.token })
                    navigate('/')
                } catch (error) {
                    console.log(error.response)
                }
            }

            SignUp()
            return (() => {
                source.cancel()
            })
        }
    }, [state.sendRequest])

    return (
        <div>
            <Card elevation={10} sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '3rem', padding: '2rem' }}>
                <Box component="form" onSubmit={FormSubmit}>
                    <Grid container rowSpacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h4" sx={{ textAlign: 'center' }}>CREATE AN ACCOUNT</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={state.usernameValue}
                                onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="email"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={state.emailValue}
                                onChange={(e) => dispatch({ type: 'catchEmailChange', emailChosen: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                margin="dense"
                                value={state.passwordValue}
                                onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="password2"
                                label="Confirm Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                margin="dense"
                                value={state.password2Value}
                                onChange={(e) => dispatch({ type: 'catchPassword2Change', password2Chosen: e.target.value })} />
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <Button variant="contained" color="success" fullWidth type="submit">SING UP</Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Box>
                <Grid container item justifyContent="center" sx={{ mt: "0.5rem" }}>
                    <Typography variant="small" sx={{ textAlign: 'center' }}>Already have an account?{" "}
                        <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'green' }}>SIGN IN</span></Typography>
                </Grid>
            </Card>
        </div>
    )
}

export default Register