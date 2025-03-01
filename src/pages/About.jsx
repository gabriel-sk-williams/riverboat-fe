import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/main.css'
import '../styles/type.css'

function About() { 

    const [content, setContent] = useState('');

    // Fetch markdown content
    useEffect(() => {
        import(/* @vite-ignore */"../support/about.md").then(res => {
        fetch(res.default)
        .then(response => response.text())
        .then(text => setContent(text));
        }) 
    }, []);

    return (
        <article>
            <div className="header-gap"></div>
            <h1>who is gskw?</h1>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}

export default About;