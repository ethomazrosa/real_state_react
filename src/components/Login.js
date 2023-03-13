import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'

// Contexts
import DispatchContext from '../contexts/DispatchContext'

//  MUI
import { Box, TextField, Grid, Card, Typography, Button } from '@mui/material';


function Login() {

  const initialState = {
    usernameValue: '',
    passwordValue: '',
    sendRequest: 0,
    token: '',
  }

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case 'catchUsernameChange':
        draft.usernameValue = action.usernameChosen
        break
      case 'catchPasswordChange':
        draft.passwordValue = action.passwordChosen
        break
      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest + 1
        break
      case 'catchToken':
        draft.token = action.tokenValue
        break
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
          console.log(error.response)
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
          navigate('/')
        } catch (error) {
          console.log(error.response)
        }
      }

      GetUserInfo()
      return (() => {
        source.cancel()
      })
    }
  }, [state.token])

  return (
    <div>
      <Card elevation={10} sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '3rem', padding: '2rem' }}>
        <Box component="form" onSubmit={FormSubmit}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ textAlign: 'center' }}>SIGN IN</Typography>
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
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="dense"
                value={state.passwordValue}
                onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })} />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <Button variant="contained" color="success" fullWidth type="submit">SIGN IN</Button>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </Box>
        <Grid container item justifyContent="center" sx={{ mt: "0.5rem" }}>
          <Typography variant="small" sx={{ textAlign: 'center' }}>Don't have an account yet? {" "}
            <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'green' }}>SIGN UP</span></Typography>
        </Grid>
      </Card>
    </div>
  )
}

export default Login