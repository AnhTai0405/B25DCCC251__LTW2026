
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  BET_STEP,
  TIME_PER_QUESTION,
  MULTIPLIERS,
  LETTERS,
  formatScore
} from '../data';

const Play = ({ questions, loading, error }) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const lockedRef = useRef(false);

  const [gameQuestions, setGameQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(MIN_BET);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);

  const playerName = sessionStorage.getItem('playerName');

  useEffect(() => {
    if (!playerName) {
      navigate('/', { replace: true });
    }
  }, [playerName, navigate]);

  useEffect(() => {
    if (questions.length > 0) {
      setGameQuestions(
        [...questions].sort(() => Math.random() - 0.5).slice(0, 12)
      );
    }
  }, [questions]);

  const question = gameQuestions[index];

  const finishGame = (finalScore, finalHistory) => {
    clearInterval(timerRef.current);

    const result = {
      playerName,
      score: finalScore,
      history: finalHistory,
      date: new Date().toISOString()
    };

    sessionStorage.setItem('gameResult', JSON.stringify(result));
    navigate('/result', { replace: true });
  };

  const submitAnswer = (answerIndex) => {
    if (!question || lockedRef.current) return;

    lockedRef.current = true;
    clearInterval(timerRef.current);

    const correct = answerIndex === question.answer;
    const earned = correct
      ? Math.round(bet * MULTIPLIERS[question.level])
      : -bet;

    const newScore = Math.max(0, score + earned);

    const record = {
      questionId: question.id,
      question: question.question,
      selected: answerIndex,
      correctAnswer: question.answer,
      correct,
      bet,
      earned,
      scoreAfter: newScore
    };

    const newHistory = [...history, record];

    setSelected(answerIndex);
    setScore(newScore);
    setHistory(newHistory);

    setFeedback({
      correct,
      earned,
      correctAnswer: question.answer
    });
  };

  useEffect(() => {
    if (!question || feedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [question, feedback]);

  useEffect(() => {
    if (timeLeft === 0 && !feedback && question) {
      submitAnswer(null);
    }
  }, [timeLeft, feedback, question]);

  const nextQuestion = () => {
    if (!feedback) return;

    if (
      score < MIN_BET ||
      index + 1 >= gameQuestions.length
    ) {
      finishGame(score, history);
      return;
    }

    lockedRef.current = false;
    setIndex((previous) => previous + 1);
    setBet(MIN_BET);
    setTimeLeft(TIME_PER_QUESTION);
    setSelected(null);
    setFeedback(null);
  };

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Không thể tải dữ liệu câu hỏi.</p>;
  if (!question) return <p>Đang chuẩn bị trò chơi...</p>;

  const maxAllowedBet = Math.min(MAX_BET, score);

  return (
    <section className="page">
      <h2>Đặt cược kiến thức</h2>

      <p><strong>Người chơi:</strong> {playerName}</p>
      <p><strong>Điểm:</strong> {formatScore(score)}</p>
      <p>
        <strong>Câu:</strong> {index + 1}/{gameQuestions.length}
      </p>
      <p><strong>Thời gian:</strong> {timeLeft} giây</p>

      <h3>{question.question}</h3>

      <div className="bet-section">
        <label htmlFor="bet">
          Mức cược:
        </label>

        <select
          id="bet"
          value={bet}
          disabled={!!feedback}
          onChange={(e) => setBet(Number(e.target.value))}
        >
          {Array.from(
            { length: Math.floor((maxAllowedBet - MIN_BET) / BET_STEP) + 1 },
            (_, i) => MIN_BET + i * BET_STEP
          ).map((value) => (
            <option key={value} value={value}>
              {formatScore(value)} điểm
            </option>
          ))}
        </select>
      </div>

      <div className="answer-list">
        {question.options.map((option, i) => (
          <button
            key={i}
            type="button"
            disabled={!!feedback}
            onClick={() => submitAnswer(i)}
            style={{
              background: feedback
                ? i === question.answer
                  ? '#16a34a'
                  : i === selected
                    ? '#dc2626'
                    : '#64748b'
                : '#15803d',
              textAlign: 'left',
              padding: '18px'
            }}
          >
            {LETTERS[i]}. {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="feedback">
          <h3>
            {feedback.correct
              ? 'Chính xác!'
              : 'Chưa chính xác hoặc hết thời gian!'}
          </h3>

          <p>
            {feedback.earned > 0 ? '+' : ''}
            {formatScore(feedback.earned)} điểm
          </p>

          <button onClick={nextQuestion}>
            {score < MIN_BET ||
            index + 1 >= gameQuestions.length
              ? 'Xem kết quả'
              : 'Câu tiếp theo'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Play;
