import PropTypes from "prop-types";
import { useState } from "react";

import { useAuth } from "../contexts/AuthContext.jsx";
import { C } from "../utils/designTokens";
import { Label, Mono } from "../utils/sharedComponents";

const initialForm = {
  email: "",
  username: "",
  password: "",
  full_name: "",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  background: C.surface,
  border: `1px solid ${C.border}`,
  color: C.white,
  borderRadius: 3,
  fontFamily: C.mono,
  fontSize: 12,
  transition: "all 0.2s",
};

const focusInput = (event) => {
  event.target.style.borderColor = C.cyan;
  event.target.style.boxShadow = "0 0 12px rgba(0, 229, 255, 0.15)";
};

const blurInput = (event) => {
  event.target.style.borderColor = C.border;
  event.target.style.boxShadow = "none";
};

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const { login, register, loading, error } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      onClose();
    } catch (submitError) {
      console.error("Auth error:", submitError);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData(initialForm);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5, 5, 8, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: C.surfaceAlt,
          border: `1px solid ${C.borderMid}`,
          borderRadius: 3,
          padding: "32px",
          maxWidth: 400,
          width: "calc(100% - 32px)",
          boxShadow: "0 0 32px rgba(0, 229, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Mono
            size={20}
            color={C.cyan}
            style={{ letterSpacing: "0.1em", fontWeight: "bold" }}
          >
            {isLogin ? "LOGIN" : "REGISTER"}
          </Mono>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: C.muted,
              fontSize: 24,
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(event) => (event.target.style.color = C.cyan)}
            onMouseLeave={(event) => (event.target.style.color = C.muted)}
          >
            x
          </button>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              background: "rgba(255, 64, 96, 0.1)",
              border: `1px solid ${C.coral}`,
              borderRadius: 3,
              color: C.coral,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <Label style={{ marginBottom: 8 }}>Email</Label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your@email.com"
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          {!isLogin && (
            <div>
              <Label style={{ marginBottom: 8 }}>Username</Label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="username"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <Label style={{ marginBottom: 8 }}>Full Name (Optional)</Label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
          )}

          <div>
            <Label style={{ marginBottom: 8 }}>Password</Label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="********"
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: C.cyan,
              color: C.bg,
              border: "none",
              borderRadius: 3,
              fontFamily: C.mono,
              fontSize: 12,
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              transition: "all 0.2s",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Mono size={11} color={C.muted} style={{ marginRight: 4 }}>
            {isLogin ? "New here?" : "Have an account?"}
          </Mono>
          <button
            onClick={toggleMode}
            style={{
              background: "transparent",
              border: "none",
              color: C.cyan,
              cursor: "pointer",
              fontFamily: C.mono,
              fontSize: 11,
              textDecoration: "underline",
            }}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;
