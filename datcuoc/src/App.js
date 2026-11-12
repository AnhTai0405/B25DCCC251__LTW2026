
/* eslint-disable import/first */
const BUILD_TAG = "dc-2964";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import Play from './pages/Play';
import Result from './pages/Result';

import './App.css';

const App = () => {
  useEffect(() => {
    document.title = `Đặt cược kiến thức - ${BUILD_TAG}`;
  }, []);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get('/data/questions.json', {
        signal: controller.signal
      })
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }

        setError(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        <Route
          path="questions"
          element={
            loading ? (
              <p>Đang tải câu hỏi...</p>
            ) : error ? (
              <p>Không tải được câu hỏi.</p>
            ) : (
              <QuestionBank
                questions={questions}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            )
          }
        />

        <Route
          path="questions/:id"
          element={
            loading ? (
              <p>Đang tải câu hỏi...</p>
            ) : error ? (
              <p>Không tải được câu hỏi.</p>
            ) : (
              <QuestionDetail
                questions={questions}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            )
          }
        />

        <Route
          path="play"
          element={
            <Play
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />

        <Route
          path="result"
          element={<Result />}
        />

        <Route
          path="history"
          element={<h2>Lịch sử</h2>}
        />

        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
};

export default App;
