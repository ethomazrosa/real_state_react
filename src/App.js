import './App.css'
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'

// Components
import Home from './components/Home'
import Login from './components/Login'
import Listings from './components/Listings'
import Header from './components/Header'
import Register from './components/Register'
import AddProperty from './components/AddProperty'
import Profile from './components/Profile'
import Agencies from './components/Agencies'
import AgencyDetail from './components/AgencyDetail'
import ListingDetail from './components/ListingDetail'

// Contexts
import DispatchContext from './contexts/DispatchContext'
import StateContext from './contexts/StateContext'

function App() {

  const initialState = {
    userUsername: localStorage.getItem('theUserUsername'),
    userEmail: localStorage.getItem('theUserEmail'),
    userId: localStorage.getItem('theUserId'),
    userToken: localStorage.getItem('theUserToken'),
    userIsLogged: localStorage.getItem('theUserUsername') ? true : false,
  }

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case 'catchToken':
        draft.userToken = action.tokenValue
        break
      case 'usersSignsIn':
        draft.userUsername = action.usernameInfo
        draft.userEmail = action.emailInfo
        draft.userId = action.idInfo
        draft.userIsLogged = true
        break
      case 'usersSignsOut':
        draft.userIsLogged = false
        break
      default:
        break
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem('theUserUsername', state.userUsername)
      localStorage.setItem('theUserEmail', state.userEmail)
      localStorage.setItem('theUserId', state.userId)
      localStorage.setItem('theUserToken', state.userToken)
    } else {
      localStorage.removeItem('theUserUsername')
      localStorage.removeItem('theUserEmail')
      localStorage.removeItem('theUserId')
      localStorage.removeItem('theUserToken')
    }
  }, [state.userIsLogged])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='login/' element={<Login />} />
            <Route path='register/' element={<Register />} />
            <Route path='property/' element={<AddProperty />} />
            <Route path='profile/' element={<Profile />} />
            <Route path='agencies/' element={<Agencies />} />
            <Route path='agencies/:id' element={<AgencyDetail />} />
            <Route path='listings/' element={<Listings />} />
            <Route path='listings/:id' element={<ListingDetail />} />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
