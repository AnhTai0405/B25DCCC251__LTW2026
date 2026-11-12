
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="page">
      <h2>404 - Không tìm thấy trang</h2>

      <p>Đường dẫn bạn truy cập không tồn tại.</p>

      <Link to="/" className="btn">
        Về trang chủ
      </Link>
    </section>
  );
};

export default NotFound;
