import React, { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import { useImmerReducer } from "use-immer"

// Contexts
import StateContext from "../contexts/StateContext"

// Assets
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg"

// MUI
import { Grid, Typography, Button, Card, CardMedia, CardContent, CircularProgress, CardActions, } from "@mui/material"

function Agencies() {

    const navigate = useNavigate()
    
    const initialState = {
        dataIsLoading: true,
        agenciesList: [],
    }

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case "catchAgencies":
                draft.agenciesList = action.agenciesArray
                break

            case "loadingDone":
                draft.dataIsLoading = false
                break
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState)

    useEffect(() => {
        async function GetAgencies() {
            try {
                const response = await Axios.get(
                    `http://localhost:8000/api/profiles/`
                )

                dispatch({
                    type: "catchAgencies",
                    agenciesArray: response.data,
                })
                dispatch({ type: "loadingDone" })
            } catch (e) { }
        }
        GetAgencies()
    }, [])

    if (state.dataIsLoading === true) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
                <CircularProgress />
            </Grid>
        )
    }

    return (
        <Grid container justifyContent="flex-start" spacing={2} style={{ padding: "10px" }}>
            {state.agenciesList.map((agency) => {
                function PropertiesDisplay() {
                    if (agency.seller_listings.length === 0) {
                        return (
                            <Button disabled size="small">
                                No Property
                            </Button>
                        )
                    } else {
                        return (
                            <Button size="small" onClick={() => navigate(`/agencies/${agency.seller}`)}>
                                {agency.seller_listings.length} Properties
                            </Button>
                        )
                    }
                }

                if (agency.agency_name && agency.phone_number)
                    return (
                        <Grid key={agency.id} item style={{ marginTop: "1rem", width: "20rem" }}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={
                                        agency.profile_picture
                                            ? agency.profile_picture
                                            : defaultProfilePicture
                                    }
                                    alt="Profile Picture"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {agency.agency_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {agency.bio.substring(0, 100)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>{PropertiesDisplay()}</CardActions>
                            </Card>
                        </Grid>
                    )
            })}
        </Grid>
    )
}

export default Agencies