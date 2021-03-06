import React from 'react'

export const Footer = (props) => {
    return(
        <footer className="page-footer blue">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5 className="white-text">Travlr</h5>
                        <p className="grey-text text-lighten-4">Need Help? Email us with your issues</p>
                        <a href="mailto:travlr@gmail.com" className="btn blue-grey darken-3">Email Us</a>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                    ©️2018 Copyright Travlr
                </div>
            </div>
        </footer>
    );
}

export default Footer;