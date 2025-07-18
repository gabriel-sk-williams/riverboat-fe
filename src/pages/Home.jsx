import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'

import casino from '../assets/based_casino.png';

import {
    Input,
    Textarea,
    Box,
    Button,
    Flex,
    Text,
    Image
  } from 'theme-ui'

  // marginTop:'2rem', marginBottom:'0 auto', 

function Home() {

	useEffect(() => {
    // Set body background when component mounts
    document.body.style.backgroundColor = 'var(--color-platinum)';
    
    // Clean up when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

	return (
		<div className="container" style={{backgroundColor:'var(--color-platinum)', minHeight:'100vh'}}>
			<h1 className="splash" style={{marginTop:'4rem'}}>riverboat</h1>
			<h6 className="splash">the decentralized prediction market protocol</h6>
			{/*<h6>coming soon</h6>*/}
			{/*<h6>pre-alpha is live on</h6>*/}
			
			<div className="flex-column center">
				<div className="flex-center" style={{marginTop:'-2rem'}}>
					<Image className="splash-image" src={casino} sx={{width:'780px'}} />
				</div>
			</div>
		</div>
	);
}

export default Home;

/*
	<Link to='/dashboard' style={{marginTop:'1rem'}}>
		<Button>Enter</Button>
	</Link>
*/

/*
	<h2>
	<code style={{ marginLeft: '8px', backgroundColor: '#f5f5f5', fontSize: '1rem', padding: '2px 4px', borderRadius: '4px' }}>
	solana devnet
	</code>
	</h2>
*/