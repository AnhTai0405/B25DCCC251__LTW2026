
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LEVELS,
  MULTIPLIERS,
  LETTERS,
  formatMultiplier
} from '../data';

const QuestionDetail = ({
  questions,
  bookmarks,
  toggleBookmark
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionId = Number(id);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return (
      <section className="page">
        <h2>Không tìm thấy câu hỏi</h2>
        <button onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </section>
    );
  }

  const isBookmarked = bookmarks.includes(question.id);

  return (
    <section className="page">
      <h2>
        Câu hỏi số {question.id} – {question.topic} ·{' '}
        {LEVELS[question.level]} (
        {formatMultiplier(MULTIPLIERS[question.level])})
      </h2>

      <h3>{question.question}</h3>

      <div className="answer-list">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={
              index === question.answer
                ? 'answer correct-answer'
                : 'answer'
            }
          >
            {LETTERS[index]}. {option}
            {index === question.answer && ' (Đáp án đúng)'}
          </div>
        ))}
      </div>

      <p>
        <strong>Gợi ý:</strong> {question.hint}
      </p>

      <button
        onClick={() => toggleBookmark(question.id)}
      >
        {isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
      </button>

      <button
        onClick={() => navigate(-1)}
        style={{ marginLeft: '10px' }}
      >
        Quay lại
      </button>
    </section>
  );
};

export default QuestionDetail;
