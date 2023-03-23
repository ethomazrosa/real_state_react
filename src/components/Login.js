import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'

// Contexts
import DispatchContext from '../contexts/DispatchContext'

//  MUI
import { Box, TextField, Grid, Card, Typography, Button, Snackbar, Alert } from '@mui/material';


function Login() {

  const initialState = {
    usernameValue: '',
    passwordValue: '',
    sendRequest: 0,
    token: '',
    openSnack: false,
    disabledButton: false,
    serverError: false,
  }

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case 'catchUsernameChange':
        draft.usernameValue = action.usernameChosen
        draft.serverError = false
        break
      case 'catchPasswordChange':
        draft.passwordValue = action.passwordChosen
        draft.serverError = false
        break
      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest + 1
        break
      case 'catchToken':
        draft.token = action.tokenValue
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
      case 'catchServerError':
        draft.serverError = true
      default:
        break
    }
  }

  const navigate = useNavigate();
  const GlobalDispatch = useContext(DispatchContext)
  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

  function FormSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'changeSendRequest' })
    dispatch({ type: 'disableTheButton' })
  }

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source()
      async function SignIn() {
        try {
          const response = await Axios.post(
            'http://127.0.0.1:8000/api-auth-djoser/token/login/',
            {
              username: state.usernameValue,
              password: state.passwordValue,
            },
            { cancelToken: source.token })
          dispatch({ type: 'catchToken', tokenValue: response.data.auth_token, })
          GlobalDispatch({ type: 'catchToken', tokenValue: response.data.auth_token, })
        } catch (error) {
          dispatch({ type: 'allowTheButton' })
          dispatch({ type: 'catchServerError' })
        }
      }

      SignIn()
      return (() => {
        source.cancel()
      })
    }
  }, [state.sendRequest])

  useEffect(() => {
    if (state.token !== "") {
      const source = Axios.CancelToken.source()
      async function GetUserInfo() {
        try {
          const response = await Axios.get(
            'http://127.0.0.1:8000/api-auth-djoser/users/me/',
            {
              headers: { Authorization: 'Token '.concat(state.token) }
            },
            { cancelToken: source.token })
          GlobalDispatch({
            type: 'usersSignsIn',
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            idInfo: response.data.id
          })
          dispatch({ type: 'openTheSnack' })
        } catch (error) {
          dispatch({ type: 'allowTheButton' })
        }
      }

      GetUserInfo()
      return (() => {
        source.cancel()
      })
    }
  }, [state.token])

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
              <Typography variant="h4" sx={{ textAlign: 'center' }}>SIGN IN</Typography>
            </Grid>

            {state.serverError ? (
              <Alert severity="error">Incorrect username or password</Alert>
            ) : ''}

            <Grid item xs={12}>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                fullWidth
                margin="dense"
                value={state.usernameValue}
                onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })}
                error={state.serverError}
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
                error={state.serverError}
              />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <Button variant="contained" color="success" fullWidth type="submit" disabled={state.disabledButton}>SIGN IN</Button>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </Box>
        <Grid container item justifyContent="center" sx={{ mt: "0.5rem" }}>
          <Typography variant="small" sx={{ textAlign: 'center' }}>Don't have an account yet? {" "}
            <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'green' }}>SIGN UP</span></Typography>
        </Grid>
      </Card>
      <Snackbar
        open={state.openSnack}
        message='You have succesfully logged in'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  )
}

export default Login