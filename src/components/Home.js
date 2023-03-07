import React from 'react';

// MUI imports
import { Button, Typography } from '@mui/material';

// Assets
import city from '../assets/city.jpg'

function Home() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <img src={city} style={{ width: '100%', height: '92vh' }} alt="" />
        <div style={{ position: 'absolute', zIndex: '100', top: '100px', left: '20px', textAlign: 'center' }}>
          <Typography style={{ color: 'white', fontWeight: 'bolder' }} variant="h1">FIND YOUR <span style={{ color: 'green' }}>NEXT PROPERTY</span> HERE!</Typography>
          <Button style={{ fontSize: '3.5rem', borderRadius: '15px' }} variant="contained" color="success">SEE ALL PROPERTIES</Button>
        </div>
      </div>
    </>
  )
}

export default Home