import React, { useState } from 'react';
import { Row, Col, Container, Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Add this import

const Home = () => {
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  
  // State for Error Modal
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!password) return;
    
    setIsLoggingIn(true);
    try {
      // Update this URL to your specific Login Lambda endpoint
      const response = await fetch('https://1juz8ik4ll.execute-api.eu-west-2.amazonaws.com/prod/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password }),
      });

      if (response.status === 404) {
        setShowError(true);
      } else if (response.ok) {
        const eventsData = await response.json();
        console.log("Login Successful! Event Access:", eventsData);
        // You can now store eventsData in state or context to show specific events
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

  

  return (
    <Container className="p-2 mt-3 pt-4" style={{ fontFamily: 'SwirlyCanalope' }}>
      <div className="mb-5">
        <h1 style={{ fontSize: "75px", color: "#6b505f" }}>Kaylan Weds Nikita</h1>
      </div>

      <div className="mt-5 d-flex flex-column">
        <p style={{ fontSize: "24px", color: "#6b505f" }}>Please enter the secret word from your invitation:</p>
        
        <Row className="w-100" style={{ maxWidth: '500px' }}>
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
              style={{ backgroundColor: "#6b505f", borderColor: "#6b505f" }}
            >
              {isLoggingIn ? '...' : 'Enter'}
            </Button>
          </Col>
        </Row>

      </div>

      {/* Error Modal for Incorrect Password */}
      <Modal show={showError} onHide={() => setShowError(false)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <h4 className="text-danger">Oops!</h4>
          <p>That password doesn't look right. Please check your invitation and try again.</p>
          <Button variant="dark" onClick={() => setShowError(false)}>
            Try Again
          </Button>
        </Modal.Body>
      </Modal>

      
    </Container>
  );
};

export default Home;