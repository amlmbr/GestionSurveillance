import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';

const LoginHandler = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('access_token', data.access_token);
      navigate('/bonjour');
    } catch (error) {
      setErrorMessage('Identifiants invalides. Veuillez réessayer.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8082/oauth2/authorization/google';
  };

  return (
    <div style={{
      backgroundImage: 'url(/ensajbg.png)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative',
    }}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          padding: '40px 30px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          margin: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '35px'
          }}>
            <h1 style={{
              fontSize: '28px',
              color: '#1e3c72',
              marginBottom: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>Surveillance des Examens</h1>
            <p style={{
              color: '#666',
              fontSize: '15px',
              letterSpacing: '0.3px'
            }}>Système de Gestion des Examens</p>
          </div>

          <form onSubmit={handleLogin} style={{
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#1e3c72',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                Email institutionnel
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e1e5ee',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
                required
                placeholder="nom@institution.fr"
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#1e3c72',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    paddingRight: '90px',
                    border: '2px solid #e1e5ee',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    color: '#1e3c72',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '5px'
                  }}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div style={{
                color: '#e74c3c',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'center',
                padding: '10px',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderRadius: '6px'
              }}>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1e3c72',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '15px',
                boxShadow: '0 4px 6px rgba(30, 60, 114, 0.2)',
              }}
            >
              Se connecter
            </button>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
                --- ou ---
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'white',
                  color: '#757575',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <img 
                  src="https://static-00.iconduck.com/assets.00/google-icon-512x512-wk1c10qc.png"
                  alt="Google Logo"
                  style={{ width: '18px', height: '18px' }}
                />
                Se connecter avec Google
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center' }}>
            <a
              href="/reset-password"
              style={{
                color: '#1e3c72',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s ease',
              }}
            >
              Mot de passe oublié ?
            </a>
            <p style={{
              marginTop: '25px',
              color: '#666',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span role="img" aria-label="lock" style={{ fontSize: '16px' }}>🔒</span>
              Accès sécurisé aux données d'examination
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHandler;