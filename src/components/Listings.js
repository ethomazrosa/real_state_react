import React from 'react';

// Leaflet
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
//  MUI
import { Grid, AppBar, Typography, Button, Card, CardHeader, CardMedia, CardContent } from '@mui/material';
// Map icons
import houseIconPng from '../assets/Mapicons/house.png';
import apartmentIconPng from '../assets/Mapicons/apartment.png';
import officeIconPng from '../assets/Mapicons/office.png';
// Assets
import myListings from '../assets/Data/Dummydata'

function Listings() {

  const houseIcon = new Icon({ iconUrl: houseIconPng, iconSize: [40, 40] })
  const apartmentIcon = new Icon({ iconUrl: apartmentIconPng, iconSize: [40, 40] })
  const officeIcon = new Icon({ iconUrl: officeIconPng, iconSize: [40, 40] })

  // const [latitude, setLatitude] = useState(51.505)
  // const [longitude, setLongitude] = useState(-0.09)

  const polyOne = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ]

  return (
    <Grid container>
      <Grid item xs={4}>
        {myListings.map((listing) => {
          return (
            <Card key={listing.id} style={{ margin: '0.5rem', paddingRight: '1rem', paddingLeft: '1rem', position: 'relative' }}>
              <CardHeader
                // action={
                //   <IconButton aria-label="settings">
                //     <MoreVertIcon />
                //   </IconButton>
                // }
                title={listing.title}
              />
              <CardMedia
                component="img"
                image={listing.picture1}
                alt={listing.title}
                style={{ borderRadius: '5px' }}
              />
              <CardContent>
                <Typography variant="body2">
                  {listing.description.substring(0, 200)}...
                </Typography>
              </CardContent>
              <Typography
                style={{
                  position: 'absolute',
                  backgroundColor: 'green',
                  zIndex: '1000',
                  color: 'white',
                  top: '100px',
                  left: '20px',
                  padding: '5px'
                }}>
                {listing.listing_type}
                : ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.property_status === 'Sale' ? '' : ' / ' + listing.rental_frequency}</Typography>
              {/* <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions> */}
            </Card>
          )
        })}
      </Grid>
      <Grid item xs={8} style={{ marginTop: '0.5rem' }}>
        <AppBar position='sticky'>
          <div style={{ height: '100vh' }}>
            <MapContainer center={[51.505, -0.09]} zoom={16} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline positions={polyOne} weight={10} color="green" />

              {myListings.map((listing) => {
                function IconDisplay() {
                  if (listing.listing_type === 'House') {
                    return houseIcon
                  } else if (listing.listing_type === 'Apartment') {
                    return apartmentIcon
                  } else if (listing.listing_type === 'Office') {
                    return officeIcon
                  }
                }
                return (
                  <Marker
                    key={listing.id}
                    position={[listing.location.coordinates[0], listing.location.coordinates[1]]}
                    icon={IconDisplay()}>
                    <Popup>
                      <Typography variant="h5">{listing.title}</Typography>
                      <img src={listing.picture1} style={{ height: '14rem', width: '18rem' }} alt="" />
                      <Typography variant="body1">{listing.description.substring(0, 150)}...</Typography>
                      <Button variant="contained" fullWidth>Details</Button>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  )
}

export default Listings