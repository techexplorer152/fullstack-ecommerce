import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import "./Footer.css";
import LINKS from './new_config';

function Footer({ user }) {
    const year = new Date().getFullYear();
    const isAdmin = user?.role === 'admin';

    return (
        <footer className="footerBox">
            <div className="footerContainer">
                <div className="footerSection">
                    <h2 className="footer_brand">My Shop.</h2>
                    <p className="footer_tagline">Got a project? Let’s make it happen.</p>
                </div>

                <div className="footerSection">
                    <h3 className="sectionTitle">Navigation</h3>
                    <nav className="navLinks">
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/cart">Cart</Link>
                        <Link to="/orders">Orders</Link>
                        {isAdmin && (
                            <Link to="/admin" className="adminLink">
                                Admin Panel
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="footerSection">
                    <h3 className="sectionTitle">Connect</h3>
                    <div className="socialIcons">
                        <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram size={22} />
                        </a>
                        <a href={`mailto:${LINKS.mail}`}>
                            <Mail size={22} />
                        </a>
                        <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin size={22} />
                        </a>
                        <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
                            <Github size={22} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footerBottom">
                <p>© {year} My Shop. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;