import React, { useEffect, useState } from 'react'
import axios from 'axios'

function UrlTable() {
    const [urls,setUrls] = useState([])
    const dummyUrls = [
        {
            "click_count": 0,
            "id": 1,
            "long_url": "https://github.com/Ekansh25/URL-Shorten/settings#danger-zone",
            "short_url": "http://127.0.0.1:5000/akshat15"
        },
        {
            "click_count": 0,
            "id": 2,
            "long_url": "https://github.com/Ekansh25/URL-Shorten/settings#danger-zone",
            "short_url": "http://127.0.0.1:5000/akshat5"
        },
        {
            "click_count": 1,
            "id": 3,
            "long_url": "https://github.com/Ekansh25/URL-Shorten/settings#danger-zone",
            "short_url": "http://127.0.0.1:5000/akshat75"
        }
    ];
    useEffect(() => {
        //setUrls(dummyUrls)
        const token = sessionStorage.getItem('authToken'); 
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        axios.get('http://127.0.0.1:5000/urls',config)
            .then(response => {
                setUrls(response.data);
            })
            .catch(error => {
                console.error('Error fetching URLs:', error);
            });
    },[]);

    return (
        <div style={{maxWidth:"70rem", margin:"5rem auto"}}>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Long Url</th>
                        <th scope="col">Short Url</th>
                        <th scope="col">Click count</th>
                    </tr>
                </thead>
                <tbody>
                {urls.map((url, index) => (
                    <tr key={url.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{url.long_url}</td>
                        <td>{url.short_url}</td>
                        <td>{url.click_count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default UrlTable