import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'
import Axios from 'axios'

//  MUI
import { Grid, Card, Typography, Button, CircularProgress } from '@mui/material'

// Assets
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";

// Contexts
import StateContext from '../contexts/StateContext'

// Components
import ProfileUpdate from "./ProfileUpdate";

function Profile() {

    const navigate = useNavigate()
    const GlobalState = useContext(StateContext)

    const initialState = {
        userProfile: {
            agencyName: '',
            phoneNumber: '',
            profilePic: '',
            bio: '',
            sellerId: '',
            sellerListings: [],
        },
        dataIsLoading: true,
    }

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case 'catchUserProfileInfo':
                draft.userProfile.agencyName = action.profileObject.agency_name
                draft.userProfile.phoneNumber = action.profileObject.phone_number
                draft.userProfile.profilePic = action.profileObject.profile_picture
                draft.userProfile.bio = action.profileObject.bio
                draft.userProfile.sellerListings = action.profileObject.seller_listings
                draft.userProfile.sellerId = action.profileObject.seller
                break

            case 'loadingDone':
                draft.dataIsLoading = false
                break
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState)

    useEffect(() => {
        async function GetProfileInfo() {
            try {
                const response = await Axios.get(
                    `http://localhost:8000/api/profiles/${GlobalState.userId}/`
                )

                dispatch({
                    type: "catchUserProfileInfo",
                    profileObject: response.data,
                })
                dispatch({ type: "loadingDone" })
            } catch (e) { }
        }
        GetProfileInfo()
    }, [])

    function PropertiesDisplay() {
        if (state.userProfile.sellerListings.length === 0) {
            return (
                <Button
                    onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
                    disabled
                    size="small"
                >
                    No Property
                </Button>
            )
        } else {
            return (
                <Button
                    onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
                    size="small"
                >
                    {state.userProfile.sellerListings.length} Properties
                </Button>
            )
        }
    }

    function WelcomeDisplay() {
        if (state.userProfile.agencyName === null ||
            state.userProfile.agencyName === "" ||
            state.userProfile.phoneNumber === null ||
            state.userProfile.phoneNumber === "") {
            return (
                <Typography variant="h5" style={{ textAlign: "center", marginTop: "1rem" }}>
                    Welcome{" "}
                    <span style={{ color: "green", fontWeight: "bolder" }}>
                        {GlobalState.userUsername}
                    </span>, please submit this form below to update your profile.
                </Typography>
            )
        } else {
            return (
                <Card elevation={10} sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem', padding: '2rem' }}>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={6}>
                            <img
                                style={{ height: "10rem", width: "15rem" }}
                                src={state.userProfile.profilePic !== null
                                    ? state.userProfile.profilePic
                                    : defaultProfilePicture}
                            />
                        </Grid>
                        <Grid item container xs={6} direction="column" justifyContent="center">
                            <Grid item>
                                <Typography variant="h5" style={{ textAlign: "center" }}>
                                    Welcome <span style={{ color: "green", fontWeight: "bolder" }}>{GlobalState.userUsername}</span>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" style={{ textAlign: "center" }}>
                                    You have {PropertiesDisplay()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            )
        }
    }

    if (state.dataIsLoading === true) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
                <CircularProgress />
            </Grid>
        )
    }

    return (
        <>
            {WelcomeDisplay()}
            <ProfileUpdate userProfile={state.userProfile} />
        </>
    )
}

export default Profile