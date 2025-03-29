// MainLayout.jsx
import React from 'react';
import NavbarWithSidebar from './NavbarWithSidebar';

const MainLayout = ({ heading, children }) => {
  return (
    <>
      <NavbarWithSidebar heading={heading} />
      <div className="p-4">
        {children}
      </div>
    </>
  );
};

export default MainLayout;
