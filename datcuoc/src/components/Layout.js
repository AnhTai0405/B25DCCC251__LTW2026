
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Đặt cược kiến thức</h1>
        <p>Trò chơi trắc nghiệm Lập trình Web</p>
      </header>

      <NavBar />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>TH02 – Lập trình Web</p>
      </footer>
    </div>
  );
};

export default Layout;
