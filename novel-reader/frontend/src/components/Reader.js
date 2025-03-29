import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Offcanvas } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faArrowRight,
  faSun,
  faMoon,
  faList
} from '@fortawesome/free-solid-svg-icons';

function Reader() {
  const { id, chapterIndex } = useParams();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  // Reader preferences state
  const [darkMode, setDarkMode] = useState(false);
  const [showChapters, setShowChapters] = useState(false);

  // Fetch novel data
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/novels/${id}`);
        setNovel(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNovel();
  }, [id]);

  // Handle chapter navigation
  const handlePrevChapter = () => {
    if (chapterIndex > 0) {
      history.push(`/novel/${id}/chapter/${parseInt(chapterIndex) - 1}`);
    }
  };

  const handleNextChapter = () => {
    if (novel && chapterIndex < novel.chapters.length - 1) {
      history.push(`/novel/${id}/chapter/${parseInt(chapterIndex) + 1}`);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevChapter();
      } else if (e.key === 'ArrowRight') {
        handleNextChapter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevChapter, handleNextChapter]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <div>Error: {error}</div>;
  if (!novel || !novel.chapters[chapterIndex]) return <div>Chapter not found</div>;

  const currentChapter = novel.chapters[chapterIndex];

  return (
    <div className={`reader-container ${darkMode ? 'dark-mode' : ''}`}>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>{novel.title}</h3>
          <div className="reader-controls">
            <Button variant="link" onClick={() => setShowChapters(true)}>
              <FontAwesomeIcon icon={faList} /> Chapters
            </Button>
            <Button variant="link" onClick={() => setDarkMode(!darkMode)}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body>
          <div className="chapter-navigation d-flex justify-content-between mb-3">
            <Button 
              variant="outline-primary" 
              onClick={handlePrevChapter}
              disabled={chapterIndex <= 0}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
            </Button>
            <h4 className="chapter-title">{currentChapter.title}</h4>
            <Button 
              variant="outline-primary" 
              onClick={handleNextChapter}
              disabled={chapterIndex >= novel.chapters.length - 1}
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>

          <div className="chapter-content">
            {currentChapter.content}
          </div>
        </Card.Body>
      </Card>

      <Offcanvas show={showChapters} onHide={() => setShowChapters(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Chapters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="chapters-list">
            {novel.chapters.map((chap, idx) => (
              <div 
                key={idx}
                className={`chapter-item ${idx === chapterIndex ? 'active' : ''}`}
                onClick={() => {
                  history.push(`/novel/${id}/chapter/${idx}`);
                  setShowChapters(false);
                }}
              >
                <div className="chapter-title">{chap.title}</div>
              </div>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Reader;