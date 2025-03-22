import React from 'react';

const Layout = ({ children }) => {
  return (
    <>
      <head>
        <title>TIts</title>
      </head>
      <body>{children}</body>
    </>
  );
};

export default Layout;
