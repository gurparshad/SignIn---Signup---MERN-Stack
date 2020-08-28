import React from 'react'
import {Link} from 'react-router-dom';
import AuthOptions from '../auth/authOptions';

export default function Header() {

    return (
        <div className = "main">
            <div className="siteTitle">
            <Link to="/">
                <h2>Site Title</h2>
            </Link>
            </div>

              <AuthOptions />
        </div>
    )
}
