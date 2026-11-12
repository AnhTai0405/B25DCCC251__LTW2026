
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import Supports from '../components/Supports';

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

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const Play = ({ questions, loading, error }) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const lockedRef = useRef(false);

  const playerName = sessionStorage.getItem('playerName');

  const [gameQuestions, setGameQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(MIN_BET);
  const [phase, setPhase] = useState('bet');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);

  const [used, setUsed] = useState({
    preview: false,
    insurance: false,
    hint: false
  });

  const [previewVisible, setPreviewVisible] = useState(false);
  const [insured, setInsured] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    if (!playerName) {
      navigate('/', { replace: true });
    }
  }, [playerName, navigate]);

  useEffect(() => {
    if (questions.length > 0) {
      setGameQuestions(shuffle(questions).slice(0, 12));
    }
  }, [questions]);

  const question = gameQuestions[index];

  const maxAllowedBet =
    Math.floor(Math.min(MAX_BET, score) / BET_STEP) * BET_STEP;

  const finishGame = useCallback((finalScore, finalHistory) => {
    clearInterval(timerRef.current);

    const result = {
      playerName,
      score: finalScore,
      history: finalHistory,
      date: new Date().toISOString()
    };

    sessionStorage.setItem('gameResult', JSON.stringify(result));
    navigate('/result', { replace: true });
  }, [navigate, playerName]);

  const submitAnswer = useCallback((answerIndex) => {
    if (!question || lockedRef.current || phase !== 'answer') {
      return;
    }

    lockedRef.current = true;
    clearInterval(timerRef.current);

    const correct = answerIndex === question.answer;

    const earned = correct
      ? insured
        ? 0
        : Math.round(bet * MULTIPLIERS[question.level])
      : insured
        ? 0
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
      insured,
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

    setPhase('feedback');
  }, [question, phase, insured, bet, score, history]);

  const startAnswer = () => {
    if (phase !== 'bet') return;

    lockedRef.current = false;
    setPhase('answer');
    setTimeLeft(TIME_PER_QUESTION);
  };

  const usePreview = () => {
    if (phase !== 'bet' || used.preview) return;

    setUsed((prev) => ({ ...prev, preview: true }));
    setPreviewVisible(true);
  };

  const useInsurance = () => {
    if (
      used.insurance ||
      !['bet', 'answer'].includes(phase)
    ) {
      return;
    }

    setUsed((prev) => ({ ...prev, insurance: true }));
    setInsured(true);
  };

  const useHint = () => {
    if (phase !== 'answer' || used.hint) return;

    setUsed((prev) => ({ ...prev, hint: true }));
    setHintVisible(true);
  };

  useEffect(() => {
    if (!question || phase !== 'answer') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [question, phase]);

  useEffect(() => {
    if (
      timeLeft === 0 &&
      phase === 'answer' &&
      !lockedRef.current
    ) {
      submitAnswer(null);
    }
  }, [timeLeft, phase, submitAnswer]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tag = event.target?.tagName;

      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      if (phase !== 'bet') return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setBet((prev) =>
          Math.min(maxAllowedBet, prev + BET_STEP)
        );
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setBet((prev) =>
          Math.max(MIN_BET, prev - BET_STEP)
        );
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        startAnswer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

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

    setIndex((prev) => prev + 1);
    setBet(MIN_BET);
    setPhase('bet');
    setTimeLeft(TIME_PER_QUESTION);
    setSelected(null);
    setFeedback(null);
    setPreviewVisible(false);
    setInsured(false);
    setHintVisible(false);
  };

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Không thể tải dữ liệu câu hỏi.</p>;
  if (!question) return <p>Đang chuẩn bị trò chơi...</p>;

  return (
    <section className="page">
      <h2>Đặt cược kiến thức</h2>

      <p><strong>Người chơi:</strong> {playerName}</p>
      <p><strong>Điểm:</strong> {formatScore(score)}</p>
      <p>
        <strong>Câu:</strong> {index + 1}/{gameQuestions.length}
      </p>

      <Supports
        phase={phase}
        used={used}
        onPreview={usePreview}
        onInsurance={useInsurance}
        onHint={useHint}
      />

      {insured && <p>🛡️ Bảo hiểm đang có hiệu lực.</p>}

      {phase === 'bet' && (
        <div className="bet-section">
          <h3>Đặt cược</h3>

          <p>
            {previewVisible
              ? question.question
              : 'Chọn mức cược trước khi xem câu hỏi.'}
          </p>

          <label htmlFor="bet">Mức cược: </label>

          <select
            id="bet"
            value={bet}
            onChange={(event) =>
              setBet(Number(event.target.value))
            }
          >
            {Array.from(
              {
                length: Math.max(
                  0,
                  Math.floor(
                    (maxAllowedBet - MIN_BET) / BET_STEP
                  ) + 1
                )
              },
              (_, i) => MIN_BET + i * BET_STEP
            ).map((value) => (
              <option key={value} value={value}>
                {formatScore(value)} điểm
              </option>
            ))}
          </select>

          <p>Phím ↑ tăng cược, ↓ giảm cược.</p>

          <button type="button" onClick={startAnswer}>
            Xác nhận cược
          </button>
        </div>
      )}

      {(phase === 'answer' || phase === 'feedback') && (
        <>
          <p>
            <strong>Thời gian:</strong> {timeLeft} giây
          </p>

          <h3>{question.question}</h3>

          <p>
            <strong>Mức cược:</strong> {formatScore(bet)} điểm
          </p>

          {hintVisible && (
            <p className="hint">
              <strong>Gợi ý:</strong> {question.hint}
            </p>
          )}

          <div className="answer-list">
            {question.options.map((option, i) => (
              <button
                key={i}
                type="button"
                disabled={phase === 'feedback'}
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
        </>
      )}

      {feedback && (
        <div className="feedback">
          <h3>
            {feedback.correct
              ? 'Chính xác!'
              : 'Chưa chính xác hoặc hết thời gian!'}
          </h3>

          {insured && <p>Đã bảo hiểm: không thay đổi điểm.</p>}

          <p>
            {feedback.earned > 0 ? '+' : ''}
            {formatScore(feedback.earned)} điểm
          </p>

          <button type="button" onClick={nextQuestion}>
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
