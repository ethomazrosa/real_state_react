import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import { useImmerReducer } from "use-immer"

// Assets
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg"

// MUI
import { Grid, Typography, Card, CardMedia, CardContent, CircularProgress, IconButton, CardActions, } from "@mui/material"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"

function AgencyDetail() {
    const navigate = useNavigate()

    const params = useParams()

    const initialState = {
        userProfile: {
            agencyName: "",
            phoneNumber: "",
            profilePic: "",
            bio: "",
            sellerListings: [],
        },
        dataIsLoading: true,
    }

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case "catchUserProfileInfo":
                draft.userProfile.agencyName = action.profileObject.agency_name
                draft.userProfile.phoneNumber = action.profileObject.phone_number
                draft.userProfile.profilePic = action.profileObject.profile_picture
                draft.userProfile.bio = action.profileObject.bio
                draft.userProfile.sellerListings = action.profileObject.seller_listings
                break

            case "loadingDone":
                draft.dataIsLoading = false
                break
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState)

    useEffect(() => {
        async function GetProfileInfo() {
            try {
                const response = await Axios.get(
                    `http://localhost:8000/api/profiles/${params.id}/`
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

    if (state.dataIsLoading === true) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
                <CircularProgress />
            </Grid>
        )
    }

    return (
        <div>
            <Card elevation={10} sx={{ width: '50%', mx: 'auto', my: '1rem', padding: '2rem' }}>
                <Grid container>
                    <Grid item xs={6}>
                        <img
                            style={{ height: "10rem", width: "15rem" }}
                            src={
                                state.userProfile.profilePic !== null
                                    ? state.userProfile.profilePic
                                    : defaultProfilePicture
                            }
                        />
                    </Grid>
                    <Grid item container direction="column" justifyContent="center" xs={6}>
                        <Grid item>
                            <Typography variant="h5" style={{ textAlign: "center", color: "green", fontWeight: "bolder" }}>
                                {state.userProfile.agencyName}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" style={{ textAlign: "center" }}>
                                <IconButton>
                                    <LocalPhoneIcon /> {state.userProfile.phoneNumber}
                                </IconButton>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item style={{ padding: "5px" }}>
                        {state.userProfile.bio}
                    </Grid>
                </Grid>
            </Card>

            <Grid container justifyContent="flex-start" spacing={2} style={{ padding: "10px" }}>
                {state.userProfile.sellerListings.map((listing) => {
                    return (
                        <Grid key={listing.id} item style={{ width: "20rem" }}>
                            <Card elevation={5}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={
                                        listing.picture1 ? `http://localhost:8000${listing.picture1}` : defaultProfilePicture
                                    }
                                    alt="Listing Picture"
                                    onClick={() => navigate(`/listings/${listing.id}`)}
                                    style={{ cursor: "pointer" }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {listing.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {listing.description.substring(0, 100)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {listing.property_status === "Sale"
                                        ? `${listing.listing_type}: $${listing.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                        : `${listing.listing_type}: $${listing.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${listing.rental_frequency
                                        }`}
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
}

export default AgencyDetail