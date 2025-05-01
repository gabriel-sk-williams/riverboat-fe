import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Wager() {
  const { id } = useParams(); // Get ID from URL
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);


    /*
    // Find matching post
    const post = posts.find(post => post.id === id);

    async function fetchMarkdown(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error("Failed to load markdown file");
            return await response.text();
        } catch (error) {
            console.error("Error loading markdown:", error);
            return "Error loading content.";
        }
    }

    // Fetch markdown content
    useEffect(() => {

    if (post) {
        fetchMarkdown(post.path).then(text => setContent(text));
    }
    }, [post]);

    if (!post) {
        return <div>Post not found</div>;
    }

    if (error) {
        return <div>Error loading post: {error}</div>;
    }
    */

  return (
    <article>
      <div className="header-gap"></div>
      <h1>{id}</h1>
    </article>
  );
}

export default Wager;
