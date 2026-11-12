
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';

const QuestionBank = ({ questions, bookmarks, toggleBookmark }) => {
  const [selectedLevels, setSelectedLevels] = useState([1, 2, 3]);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [query, setQuery] = useState('');

  const handleLookupShift = (e) => {
    setQuery(e.target.value);
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((item) => item !== level)
        : [...prev, level]
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchLevel = selectedLevels.includes(q.level);
    const matchBookmark = !onlyBookmarks || bookmarks.includes(q.id);
    const matchSearch = q.question
      .toLowerCase()
      .includes(query.trim().toLowerCase());

    return matchLevel && matchBookmark && matchSearch;
  });

  return (
    <section className="page">
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters">
        <h3>Lọc theo mức độ</h3>

        {[1, 2, 3].map((level) => (
          <label key={level}>
            <input
              type="checkbox"
              checked={selectedLevels.includes(level)}
              onChange={() => toggleLevel(level)}
            />
            {LEVELS[level]}
          </label>
        ))}

        <label>
          <input
            type="checkbox"
            checked={onlyBookmarks}
            onChange={(e) => setOnlyBookmarks(e.target.checked)}
          />
          Chỉ hiện câu đã đánh dấu
        </label>

        <div>
          <input
            type="text"
            placeholder="Tìm kiếm theo nội dung câu hỏi"
            value={query}
            onChange={handleLookupShift}
          />
        </div>
      </div>

      <p>Có {filteredQuestions.length} câu hỏi</p>
      <p>Đã đánh dấu: {bookmarks.length} câu</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Chủ đề</th>
              <th>Mức độ</th>
              <th>Hệ số</th>
              <th>Câu hỏi</th>
              <th>Đánh dấu</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuestions.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.topic}</td>
                <td>{LEVELS[q.level]}</td>
                <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
                <td>
                  <Link to={`/questions/${q.id}`}>
                    {q.question}
                  </Link>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(q.id)}
                    aria-label={`Đánh dấu câu ${q.id}`}
                  >
                    {bookmarks.includes(q.id) ? '★' : '☆'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QuestionBank;
