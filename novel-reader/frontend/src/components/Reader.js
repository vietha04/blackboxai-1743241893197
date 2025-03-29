import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Reader() {
  const { id, chapterIndex } = useParams();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/novels/${id}`);
        setNovel(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchNovel();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!novel || !novel.chapters[chapterIndex]) {
    return <Container className="mt-5">Không tìm thấy chương truyện</Container>;
  }

  const chapter = novel.chapters[chapterIndex];

  const handlePrevChapter = () => {
    if (chapterIndex > 0) {
      navigate(`/novel/${id}/chapter/${parseInt(chapterIndex) - 1}`);
    }
  };

  const handleNextChapter = () => {
    if (chapterIndex < novel.chapters.length - 1) {
      navigate(`/novel/${id}/chapter/${parseInt(chapterIndex) + 1}`);
    }
  };

  return (
    <Container className="reader-container">
      <Card>
        <Card.Header>
          <h2>{novel.title} - {chapter.title}</h2>
          <h5>Tác giả: {novel.author}</h5>
        </Card.Header>
        <Card.Body>
          <div className="chapter-content">{chapter.content}</div>
        </Card.Body>
        <Card.Footer className="chapter-nav">
          <Button 
            variant="primary" 
            onClick={handlePrevChapter}
            disabled={chapterIndex <= 0}
          >
            Chương trước
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNextChapter}
            disabled={chapterIndex >= novel.chapters.length - 1}
          >
            Chương sau
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Reader;