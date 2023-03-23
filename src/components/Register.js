import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'

//  MUI
import { Box, TextField, Grid, Card, Typography, Button, Snackbar, Alert } from '@mui/material';

function Register() {

    const initialState = {
        usernameValue: '',
        emailValue: '',
        passwordValue: '',
        password2Value: '',
        sendRequest: 0,
        openSnack: false,
        disabledButton: false,
        usernameErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        emailErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        passwordErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        password2HelperText: '',
        serverMessageUsername: '',
        serverMessageEmail: '',
        serverMessagePassword: '',
    }

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen
                draft.usernameErrors.hasErrors = false
                draft.usernameErrors.errorMessage = ''
                draft.serverMessageUsername = ''
                break
            case 'catchEmailChange':
                draft.emailValue = action.emailChosen
                draft.emailErrors.hasErrors = false
                draft.emailErrors.errorMessage = ''
                draft.serverMessageEmail = ''
                break
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen
                draft.passwordErrors.hasErrors = false
                draft.passwordErrors.errorMessage = ''
                break
            case 'catchPassword2Change':
                draft.password2Value = action.password2Chosen
                if (action.password2Chosen !== draft.passwordValue) {
                    draft.password2HelperText = 'The passwords must match'
                } else if (action.password2Chosen === draft.passwordValue) {
                    draft.password2HelperText = ''
                }
                break
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest + 1
                break
            case 'openTheSnack':
                draft.openSnack = true
                break
            case 'disableTheButton':
                draft.disabledButton = true
                break
            case 'allowTheButton':
                draft.disabledButton = false
                break
            case 'catchUsernameErrors':
                if (action.usernameChosen.length === 0) {
                    draft.usernameErrors.hasErrors = true
                    draft.usernameErrors.errorMessage = 'This field must not me empty'
                } else if (action.usernameChosen.length < 5) {
                    draft.usernameErrors.hasErrors = true
                    draft.usernameErrors.errorMessage = 'This field must be at least 5 characters'
                } else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
                    draft.usernameErrors.hasErrors = true
                    draft.usernameErrors.errorMessage = 'This field must not have special characters'
                }
                break
            case 'catchEmailErrors':
                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(action.emailChosen)) {
                    draft.emailErrors.hasErrors = true
                    draft.emailErrors.errorMessage = 'Please enter a valid email'
                }
                break
            case 'catchPasswordErrors':
                if (action.passwordChosen.length < 8) {
                    draft.passwordErrors.hasErrors = true
                    draft.passwordErrors.errorMessage = 'This field must be at least 8 characters'
                }
                break
            case 'usernameExists':
                draft.serverMessageUsername = 'This username already exists'
                break
            case 'emailExists':
                draft.serverMessageEmail = 'This email already exists'
                break
            case 'passwordError':
                draft.serverMessagePassword = action.passwordErrorMessage
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
        dispatch({ type: 'disableTheButton' })
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
                    dispatch({ type: 'openTheSnack' })
                    dispatch({ type: 'disableTheButton' })
                } catch (error) {
                    dispatch({ type: 'allowTheButton' })
                    if (error.response.data.username) {
                        dispatch({ type: 'usernameExists' })
                    }
                    if (error.response.data.email) {
                        dispatch({ type: 'emailExists' })
                    }
                    if (error.response.data.password) {
                        dispatch({ type: 'passwordError', passwordErrorMessage: error.response.data.password[0] })
                    }
                }
            }

            SignUp()
            return (() => {
                source.cancel()
            })
        }
    }, [state.sendRequest])

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => { navigate('/') }, 1500)
        }
    }, [state.openSnack])

    return (
        <div>
            <Card elevation={10} sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '3rem', padding: '2rem' }}>
                <Box component="form" onSubmit={FormSubmit}>
                    <Grid container rowSpacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h4" sx={{ textAlign: 'center' }}>CREATE AN ACCOUNT</Typography>
                        </Grid>

                        {state.serverMessageUsername ? (<Alert severity='error'>{state.serverMessageUsername}</Alert>) : ''}
                        {state.serverMessageEmail ? (<Alert severity='error'>{state.serverMessageEmail}</Alert>) : ''}
                        {state.serverMessagePassword ? (<Alert severity='error'>{state.serverMessagePassword}</Alert>) : ''}

                        <Grid item xs={12}>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={state.usernameValue}
                                onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })}
                                onBlur={(e) => dispatch({ type: 'catchUsernameErrors', usernameChosen: e.target.value })}
                                error={state.usernameErrors.hasErrors}
                                helperText={state.usernameErrors.errorMessage}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="email"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={state.emailValue}
                                onChange={(e) => dispatch({ type: 'catchEmailChange', emailChosen: e.target.value })}
                                onBlur={(e) => dispatch({ type: 'catchEmailErrors', emailChosen: e.target.value })}
                                error={state.emailErrors.hasErrors}
                                helperText={state.emailErrors.errorMessage}
                            />
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
                                onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })}
                                onBlur={(e) => dispatch({ type: 'catchPasswordErrors', passwordChosen: e.target.value })}
                                error={state.passwordErrors.hasErrors}
                                helperText={state.passwordErrors.errorMessage}
                            />
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
                                onChange={(e) => dispatch({ type: 'catchPassword2Change', password2Chosen: e.target.value })}
                                error={state.password2HelperText !== ''}
                                helperText={state.password2HelperText}
                            />
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                type="submit"
                                disabled={
                                    state.disabledButton ||
                                    state.usernameErrors.hasErrors ||
                                    state.emailErrors.hasErrors ||
                                    state.passwordErrors.hasErrors ||
                                    state.password2HelperText !== ''
                                }>SIGN UP</Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Box>
                <Grid container item justifyContent="center" sx={{ mt: "0.5rem" }}>
                    <Typography variant="small" sx={{ textAlign: 'center' }}>Already have an account?{" "}
                        <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'green' }}>SIGN IN</span></Typography>
                </Grid>
            </Card>
            <Snackbar
                open={state.openSnack}
                message='You have succesfully created an account'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </div>
    )
}

export default Register