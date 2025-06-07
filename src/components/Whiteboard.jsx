import React from 'react';
import { Box } from '@mui/material';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

const Whiteboard = () => {
  return (
    <div>
      <Box sx={{ 
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: 'calc(100% - 64px)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative'
        }}>
          <Tldraw />
        </div>
      </Box>
    </div>
  );
};

export default Whiteboard;


