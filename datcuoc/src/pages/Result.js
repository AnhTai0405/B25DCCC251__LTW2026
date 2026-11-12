
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { START_SCORE, formatScore } from '../data';

const Result = () => {
  const navigate = useNavigate();

  let result = null;

  try {
    result = JSON.parse(sessionStorage.getItem('gameResult'));
  } catch (error) {
    result = null;
  }

  if (!result) {
    return (
      <section className="page">
        <h2>Chưa có kết quả</h2>
        <p>Bạn cần hoàn thành trò chơi trước.</p>
        <Link to="/" className="btn">Về trang chủ</Link>
      </section>
    );
  }

  const history = result.history || [];
  const correctCount = history.filter(item => item.correct).length;
  const wrongCount = history.length - correctCount;
  const win = result.score > START_SCORE;

  const playAgain = () => {
    sessionStorage.removeItem('gameResult');
    navigate('/');
  };

  return (
    <section className="page">
      <h2>Kết quả trò chơi</h2>

      <h3>Người chơi: {result.playerName}</h3>

      <h2>{win ? 'Chiến thắng!' : 'Kết thúc trò chơi!'}</h2>

      <p>Điểm ban đầu: {formatScore(START_SCORE)}</p>
      <p>Điểm cuối: {formatScore(result.score)}</p>
      <p>Số câu đã chơi: {history.length}</p>
      <p>Số câu đúng: {correctCount}</p>
      <p>Số câu sai hoặc hết giờ: {wrongCount}</p>

      <h3>Biểu đồ kết quả</h3>

      <div style={{ maxWidth: 500 }}>
        <p>Trả lời đúng: {correctCount}</p>
        <div style={{ background: '#e5e7eb', height: 25 }}>
          <div style={{
            background: '#16a34a',
            width: `${history.length ? correctCount / history.length * 100 : 0}%`,
            height: '100%'
          }} />
        </div>

        <p>Trả lời sai hoặc hết giờ: {wrongCount}</p>
        <div style={{ background: '#e5e7eb', height: 25 }}>
          <div style={{
            background: '#dc2626',
            width: `${history.length ? wrongCount / history.length * 100 : 0}%`,
            height: '100%'
          }} />
        </div>
      </div>

      <h3>Chi tiết từng câu</h3>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Câu</th>
              <th>Kết quả</th>
              <th>Điểm cược</th>
              <th>Thay đổi</th>
              <th>Điểm sau câu</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.questionId}</td>
                <td>{item.correct ? 'Đúng' : 'Sai / Hết giờ'}</td>
                <td>{formatScore(item.bet)}</td>
                <td>{formatScore(item.earned)}</td>
                <td>{formatScore(item.scoreAfter)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 25 }}>
        <button onClick={playAgain}>Chơi lại</button>
        {' '}
        <Link to="/questions" className="btn">
          Ngân hàng câu hỏi
        </Link>
      </div>
    </section>
  );
};

export default Result;
