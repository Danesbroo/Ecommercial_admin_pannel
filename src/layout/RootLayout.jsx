import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { ToastContainer } from 'react-toastify';

export default function RootLayout() {
  const token = Cookies.get('token'); // token check

  if (!token) {
    return <Navigate to="/"/>; // we navigate user in login page if user is not login
  }

  return (
    <>
      <ToastContainer />
      <section className="w-full">
        <div className="grid grid-cols-[16.5%_auto]">
          <div>
            <Sidebar />
          </div>
          <div>
            <Header />
            <Outlet />
            <Footer />
          </div>
        </div>
      </section>
    </>
  );
}
