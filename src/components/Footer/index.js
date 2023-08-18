import React from 'react';
import Link from 'components/Link';
import './index.css';

const Footer = () => (
  <footer className="footer">
    <span className="footer__date">
      {`©${new Date().getFullYear()} `}
    </span>
    <Link className="footer__link" secondary href="/humans.txt">
      Veebor
    </Link>
  </footer>
);

export default Footer;
