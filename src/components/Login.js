import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import "./Login.css";

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/users/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login successful, token received:", data.token);
      login(data.token); // This will handle navigation internally
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Login failed");
      setUserInfo({ username: "", password: "" });
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({
        username: userInfo.username,
        password: userInfo.password,
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="login-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">Admin Dashboard</h2>
                  <p className="login-subtitle">Sign in to your account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleFormSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={userInfo.username}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, username: e.target.value });
                        setError("");
                      }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={userInfo.password}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, password: e.target.value });
                        setError("");
                      }}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 login-btn"
                    disabled={
                      loginMutation.isPending ||
                      !userInfo.username ||
                      !userInfo.password
                    }>
                    {loginMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    © 2024 Admin Dashboard. All rights reserved.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
