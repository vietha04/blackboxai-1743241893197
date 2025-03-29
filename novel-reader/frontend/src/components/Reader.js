import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Form, Offcanvas } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookmark, 
  faShare, 
  faMoon, 
  faSun, 
  faList,
  faSearch,
  faFont,
  faTextHeight
} from '@fortawesome/free-solid-svg-icons';

function Reader() {
  const { id, chapterIndex } = useParams();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Reader preferences state
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showChapters, setShowChapters] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('readerFontSize');
    const savedDarkMode = localStorage.getItem('readerDarkMode');
    const savedLineHeight = localStorage.getItem('readerLineHeight');
    
    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('readerFontSize', fontSize.toString());
    localStorage.setItem('readerDarkMode', darkMode.toString());
    localStorage.setItem('readerLineHeight', lineHeight.toString());
  }, [fontSize, darkMode, lineHeight]);

  // Fetch novel data
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/novels/${id}`);
        setNovel(res.data);
        
        // Check if chapter exists
        if (!res.data.chapters[chapterIndex]) {
          setError('Chapter not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load novel');
        setLoading(false);
      }
    };
    fetchNovel();
  }, [id, chapterIndex]);

  // Handle chapter navigation
  const handlePrevChapter = () => {
    if (chapterIndex > 0) {
      navigate(`/novel/${id}/chapter/${parseInt(chapterIndex) - 1}`);
    }
  };

  const handleNextChapter = () => {
    if (novel && chapterIndex < novel.chapters.length - 1) {
      navigate(`/novel/${id}/chapter/${parseInt(chapterIndex) + 1}`);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevChapter();
      if (e.key === 'ArrowRight') handleNextChapter();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterIndex, novel]);

  // Search within chapter
  const handleSearch = () => {
    if (!novel || !searchQuery) return;
    
    const currentChapter = novel.chapters[chapterIndex];
    const results = [];
    
    // Simple search implementation
    const lines = currentChapter.content.split('\n');
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({
          line: index + 1,
          text: line
        });
      }
    });
    
    setSearchResults(results);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading novel...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">{error}</div>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!novel || !novel.chapters[chapterIndex]) {
    return (
      <Container className="mt-5">
        <div className="alert alert-warning">Chapter not found</div>
        <Button variant="primary" onClick={() => navigate(`/novel/${id}`)}>
          Back to Novel
        </Button>
      </Container>
    );
  }

  const chapter = novel.chapters[chapterIndex];
  const progress = ((parseInt(chapterIndex) + 1) / novel.chapters.length * 100).toFixed(1);

  return (
    <div className={`reader-container ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        {/* Reader Controls */}
        <div className="reader-controls d-flex justify-content-between mb-3">
          <div>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowChapters(true)}
              className="me-2"
            >
              <FontAwesomeIcon icon={faList} /> Chapters
            </Button>
            
            <Button 
              variant={bookmarked ? 'warning' : 'outline-secondary'} 
              onClick={() => setBookmarked(!bookmarked)}
              className="me-2"
            >
              <FontAwesomeIcon icon={faBookmark} />
            </Button>
          </div>
          
          <div className="d-flex align-items-center">
            <div className="me-3">
              <FontAwesomeIcon icon={faFont} className="me-2" />
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setFontSize(f => Math.max(f - 1, 12))}
                className="me-1"
              >
                A-
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setFontSize(f => Math.min(f + 1, 24))}
              >
                A+
              </Button>
            </div>
            
            <div className="me-3">
              <FontAwesomeIcon icon={faTextHeight} className="me-2" />
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setLineHeight(l => Math.max(l - 0.1, 1.2))}
                className="me-1"
              >
                -
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setLineHeight(l => Math.min(l + 0.1, 2.0))}
              >
                +
              </Button>
            </div>
            
            <Button 
              variant="outline-secondary" 
              onClick={() => setDarkMode(!darkMode)}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress mb-3">
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
        
        {/* Chapter Content */}
        <Card className="mb-3">
          <Card.Header>
            <h2>{novel.title} - {chapter.title}</h2>
            <h5>Author: {novel.author}</h5>
          </Card.Header>
          <Card.Body>
            <div 
              className="chapter-content"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight
              }}
            >
              {chapter.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between">
            <Button 
              variant="primary" 
              onClick={handlePrevChapter}
              disabled={chapterIndex <= 0}
            >
              Previous Chapter
            </Button>
            <span>Chapter {parseInt(chapterIndex) + 1} of {novel.chapters.length}</span>
            <Button 
              variant="primary" 
              onClick={handleNextChapter}
              disabled={chapterIndex >= novel.chapters.length - 1}
            >
              Next Chapter
            </Button>
          </Card.Footer>
        </Card>
        
        {/* Search Section */}
        <Card className="mb-3">
          <Card.Header>
            <h5><FontAwesomeIcon icon={faSearch} /> Search in Chapter</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search in this chapter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
            
            {searchResults.length > 0 && (
              <div className="mt-3">
                <h6>Search Results:</h6>
                <ul className="search-results">
                  {searchResults.map((result, i) => (
                    <li key={i}>
                      <small>Line {result.line}:</small> {result.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* Chapters Drawer */}
      <Offcanvas show={showChapters} onHide={() => setShowChapters(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Chapters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="chapters-list">
            {novel.chapters.map((chap, idx) => (
              <div 
                key={idx}
                className={`chapter-item ${idx == chapterIndex ? 'active' : ''}`}
                onClick={() => {
                  navigate(`/novel/${id}/chapter/${idx}`);
                  setShowChapters(false);
                }}
              >
                <div className="chapter-title">{chap.title}</div>
                {idx == chapterIndex && <small>(Current)</small>}
              </div>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Reader;
