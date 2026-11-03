import React, { useState } from 'react';
import { Row, Col, Container, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!password) return;

    setIsLoggingIn(true);
    try {
      const response = await fetch(
        'https://1juz8ik4ll.execute-api.eu-west-2.amazonaws.com/prod/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password }),
        }
      );

      if (response.status === 404) {
        setShowError(true);
      } else if (response.ok) {
        const eventsData = await response.json();
        console.log("Login Successful! Event Access:", eventsData);
        navigate('/landing', { state: { events: eventsData } });
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const images = [
    '/assets/1000090543.jpg',
    '/assets/1000090541.jpg',
    '/assets/1000090542.jpg',
  ];

  return (
    <>
      <style>
        {`
          .mobile-portrait-layout {
            display: none !important;
          }
          .desktop-landscape-layout {
            display: none !important;
          }

          @media (max-width: 767.98px) and (orientation: portrait) {
            .mobile-portrait-layout {
              display: block !important;
            }
          }

          @media (min-width: 768px), (orientation: landscape) {
            .desktop-landscape-layout {
              display: flex !important;
            }
          }
        `}
      </style>

      {/* MOBILE PORTRAIT LAYOUT */}
      <div className="mobile-portrait-layout w-100 min-vh-100 position-relative overflow-hidden" style={{ fontFamily: 'SwirlyCanalope' }}>
        {/* Top 80% Viewport Background Image */}
        <div
          style={{
            height: '80vh',
            width: '100%',
            backgroundImage: `url(${images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Bottom 20% Viewport - Title & Password Input */}
        <div
          className="d-flex flex-column justify-content-center align-items-center px-3"
          style={{
            height: '20vh',
            backgroundColor: '#fff',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 6vw, 40px)',
              color: '#6b505f',
              margin: '0 0 8px 0',
            }}
          >
            Tom & Shivani
          </h1>

          <Row className="w-100 justify-content-center" style={{ maxWidth: '350px' }}>
            <Col xs={8} className="pe-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secret word"
                className="form-control h-100"
                style={{ textAlign: 'center', fontSize: '14px' }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </Col>
            <Col xs={4} className="ps-1">
              <Button
                className="w-100 h-100"
                onClick={handleLogin}
                disabled={isLoggingIn}
                style={{
                  backgroundColor: '#6b505f',
                  borderColor: '#6b505f',
                }}
              >
                {isLoggingIn ? '...' : 'Enter'}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* DESKTOP & LANDSCAPE LAYOUT */}
      <Container
        fluid
        className="desktop-landscape-layout px-3 py-4 min-vh-100 flex-column align-items-center justify-content-between"
        style={{
          fontFamily: 'SwirlyCanalope',
          backgroundColor: 'transparent',
        }}
      >
        {/* Top Header */}
        <div className="text-center mt-2 mb-1">
          <h1
            style={{
              fontSize: 'clamp(35px, 6vw, 75px)',
              color: '#6b505f',
              margin: 0,
            }}
          >
            Tom & Shivani
          </h1>
        </div>

        {/* Password Prompt & Input Field */}
        <div className="text-center d-flex flex-column align-items-center mb-3 w-100">
          <p className="mb-2" style={{ fontSize: '18px', color: '#6b505f' }}>
            Please enter the secret word from your invitation:
          </p>

          <Row className="w-100 justify-content-center" style={{ maxWidth: '450px' }}>
            <Col xs={8} className="pe-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-control h-100"
                style={{ textAlign: 'center' }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </Col>
            <Col xs={4} className="ps-1">
              <Button
                className="w-100 h-100"
                onClick={handleLogin}
                disabled={isLoggingIn}
                style={{
                  backgroundColor: '#6b505f',
                  borderColor: '#6b505f',
                }}
              >
                {isLoggingIn ? '...' : 'Enter'}
              </Button>
            </Col>
          </Row>
        </div>

        {/* 3-Column Horizontal Grid View */}
        <div className="w-100 my-auto pb-3" style={{ maxWidth: '900px' }}>
          <Row className="g-2 g-md-3 justify-content-center align-items-center flex-row">
            {images.map((src, index) => (
              <Col key={index} xs={4} md={4} className="d-flex justify-content-center">
                <div
                  style={{
                    width: '100%',
                    maxWidth: '240px',
                    aspectRatio: '3 / 4',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  <img
                    src={src}
                    alt={`Tom and Shivani ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* Shared Error Modal */}
      <Modal show={showError} onHide={() => setShowError(false)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <h4 className="text-danger">Oops!</h4>
          <p>That password doesn't look right. Please check your invitation and try again.</p>
          <Button variant="dark" onClick={() => setShowError(false)}>
            Try Again
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Home;