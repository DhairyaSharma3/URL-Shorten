import React, { useState } from 'react';
import axios from 'axios';

function ShortenUrl() {
    const [url, setUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [showResponse, setShowResponse] = useState(false);
    const [showRetry, setshowRetry] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem('authToken');  
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        axios.post('http://127.0.0.1:5000/shorten', {
            long_url: url,
            alias: alias
        }, config)
            .then(response => {
                setShortUrl(response.data.short_url); 
            })
            .catch(error => {
                setShortUrl(error.response.data.message); 
                console.error('Shorten error:', error);
                setshowRetry(true)
            });
            setShowResponse(true);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shortUrl);
        alert('Copied to clipboard!');
    };

    const handleRetry = (e) => {
        //e.preventDefault()
        setShortUrl("")
        setShowResponse(false)
        setshowRetry(false)
    }

    return (
        <div style={{ maxWidth: "30rem", margin: "10rem auto" }}>
            <form>
                <div className="mb-3">
                    <label htmlFor="url" className="form-label">URL</label>
                    <input type="text" className="form-control" id="url" onChange={(e) => setUrl(e.target.value)} />
                    <div className="form-text">Enter your favourite link to be shortened.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="alias" className="form-label">Alias</label>
                    <input type="text" className="form-control" id="alias" onChange={(e) => setAlias(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-dark" onClick={handleSubmit} style={{margin:"0 10px"}}>Submit</button>
                {showRetry&&(<button type="submit" className="btn btn-dark" onClick={handleRetry}>Retry</button>)}
            </form>
            {showResponse && (
                <div className="alert alert-success mt-3" role="alert" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Shortened URL: {shortUrl}
                    <button className="btn btn-info float-end" onClick={handleCopy}>Copy</button>
                </div>
            )}
        </div>
    );
}

export default ShortenUrl;
