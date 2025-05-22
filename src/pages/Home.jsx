import { Link } from 'react-router-dom'

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'

import boat from '../assets/riverboat.jpg'

import {
    Input,
    Textarea,
    Box,
    Button,
    Flex,
    Text,
    Image
  } from 'theme-ui'

function Home() {

	return (
		<div className="container">
			<div className="flex-column center">
					<div style={{paddingTop:'6rem'}}/>
					<div className="flex-center">
						<Image src={boat} sx={{width:'400px'}} />
					</div>
					<h1>riverboat</h1>
					<h2>the decentralized prediction protocol</h2>
					<h2>new update coming soon on </h2>
					<h2>
					<code style={{ marginLeft: '8px', backgroundColor: '#f5f5f5', fontSize: '1rem', padding: '2px 4px', borderRadius: '4px' }}>
					solana devnet
					</code>
					</h2>
					{/*
					<Link to='/dashboard' style={{marginTop:'1rem'}}>
						<Button>Enter</Button>
					</Link>
					*/}
			</div>
		</div>
	);
}

export default Home;