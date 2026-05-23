import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { ToastContainer } from 'react-toastify';

export default function RootLayout() {
  const token = Cookies.get('token'); // token check
  const [sidebarOpen, setSidebarOpen] = useState(false); // state for sidebar

  if (!token) {
    return <Navigate to="/" />; // we navigate user in login page if user is not login
  }

  return (
    <>
      <ToastContainer />
      <section className="w-full h-screen overflow-hidden">

        <div className="flex h-full">

          {/* Sidebar */}
          <Sidebar className="overflow-y-auto"
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Right Side */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            <Header setSidebarOpen={setSidebarOpen} />

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-4">
              <Outlet />
            </main>

            <Footer />

          </div>

        </div>

      </section>
    </>
  );
}
