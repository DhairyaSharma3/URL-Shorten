import React from 'react'

function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Url Shortner</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-link" href="/shorten-url">Shorten Url</a>
                            <a className="nav-link" aria-current="page" href="/table-url">Table</a>
                            {/* <a className="nav-link" href="#">Pricing</a>
                            <a className="nav-link disabled">Disabled</a> */}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar