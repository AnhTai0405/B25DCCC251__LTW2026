
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        Trang chủ
      </NavLink>

      <NavLink
        to="/questions"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        Ngân hàng câu hỏi
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        Lịch sử
      </NavLink>
    </nav>
  );
};

export default NavBar;
