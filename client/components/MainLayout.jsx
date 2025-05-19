// MainLayout.jsx
import React from 'react';
import NavbarWithSidebar from './NavbarWithSidebar';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ heading, children }) => {
  return (
    <>
      <NavbarWithSidebar heading={heading} />
      {/* <Toaster position="bottom-center" reverseOrder={false} /> */}
      <div className="">
        {children}
      </div>
    </>
  );
};

export default MainLayout;
