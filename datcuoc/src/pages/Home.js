
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();

    const name = playerName.trim();

    if (!name) {
      alert('Vui lòng nhập tên người chơi!');
      return;
    }

    sessionStorage.setItem('playerName', name);
    navigate('/play');
  };

  return (
    <section className="page">
      <h2>Chào mừng đến với Đặt cược kiến thức!</h2>

      <p>
        Thử thách kiến thức Lập trình Web qua
        12 câu hỏi trắc nghiệm.
      </p>

      <form onSubmit={handleStart}>
        <label htmlFor="playerName">
          <strong>Tên người chơi:</strong>
        </label>

        <div style={{ margin: '15px 0' }}>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
            maxLength={40}
            style={{
              padding: '12px',
              width: '300px',
              maxWidth: '100%'
            }}
          />
        </div>

        <button type="submit">
          Bắt đầu chơi
        </button>
      </form>

      <h3>Luật chơi</h3>

      <ul>
        <li>Bắt đầu với 1.000 điểm.</li>
        <li>Có 12 câu hỏi thuộc 3 mức độ.</li>
        <li>Mỗi câu cược từ 100 đến 500 điểm.</li>
        <li>Mỗi câu có 25 giây để trả lời.</li>
        <li>Trả lời đúng được thưởng theo hệ số.</li>
        <li>Trả lời sai hoặc hết giờ bị trừ điểm cược.</li>
        <li>Điểm dưới 100 sẽ kết thúc trò chơi.</li>
      </ul>

      <Link to="/questions" className="btn">
        Xem ngân hàng câu hỏi
      </Link>
    </section>
  );
};

export default Home;
