import React from 'react';

import Link from '../../Link';

import './style.css';

const Footer = () => (
  <div className="Footer">
    <div>
      <small>
        <span className="Footer-text">Built based on</span>{' '}
        <Link
          className="Footer-link"
          href="https://www.robinwieruch.de/react-graphql-apollo-tutorial/"
        >
          Robin Wieruch
        </Link>{' '}
        <span className="Footer-text">tutorial</span>
      </small>
    </div>
  </div>
);

export default Footer;