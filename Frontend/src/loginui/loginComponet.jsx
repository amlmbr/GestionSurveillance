import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginComp = () => {
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
        maxWidth: '380px',  // Réduit la largeur maximale
        padding: '40px 30px', // Ajusté le padding horizontal
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
          maxWidth: '320px', // Largeur fixe pour le formulaire
          margin: '0 auto'   // Centre le formulaire
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
                padding: '12px 15px', // Ajusté le padding
                border: '2px solid #e1e5ee',
                borderRadius: '8px',
                fontSize: '14px',     // Légèrement réduit
                outline: 'none',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                boxSizing: 'border-box' // Assure que le padding est inclus dans la largeur
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
                  padding: '12px 15px', // Ajusté le padding
                  paddingRight: '90px',  // Espace pour le bouton Afficher/Masquer
                  border: '2px solid #e1e5ee',
                  borderRadius: '8px',
                  fontSize: '14px',     // Légèrement réduit
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  boxSizing: 'border-box' // Assure que le padding est inclus dans la largeur
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
              marginBottom: '25px',
              boxShadow: '0 4px 6px rgba(30, 60, 114, 0.2)',
              '&:hover': {
                backgroundColor: '#2a5298',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 8px rgba(30, 60, 114, 0.3)'
              }
            }}
          >
            Se connecter
          </button>
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
              '&:hover': {
                color: '#2a5298',
                textDecoration: 'underline'
              }
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

export default LoginComp;