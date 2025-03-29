import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Card, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Reader from './components/Reader';

function Home() {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/novels');
        setNovels(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNovels();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Danh sách truyện</h2>
      <Row>
        {novels.map(novel => (
            <Col md={4} key={novel._id} className="mb-4">
              <Card className="novel-card">
              <Card.Img variant="top" src={novel.coverImage || 'https://via.placeholder.com/150'} />
              <Card.Body>
                <Card.Title>{novel.title}</Card.Title>
                <Card.Text>{novel.author}</Card.Text>
                <Link 
                  to={`/novel/${novel._id}/chapter/0`} 
                  className="btn btn-primary"
                >
                  Đọc truyện
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Web Đọc Truyện</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novel/:id/chapter/:chapterIndex" element={<Reader />} />
      </Routes>
    </Router>
  );
}

export default App;