import React, { useState } from 'react';
import { sendResetCode } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const generateRandomCode = () => {
    return Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
  };
  
  const handleSendCode = async (event) => {
    event.preventDefault();
    const verificationCodeenvoyer = generateRandomCode();
    
    try {
      await sendResetCode(email, "Code de verification", `Votre code de vérification est : ${verificationCodeenvoyer}`);
      setSuccessMessage('Un code de réinitialisation a été envoyé à votre adresse e-mail.');
      navigate('/verifycode', { state: { verificationCodeenvoyer,email } });
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite. Veuillez vérifier votre adresse e-mail et réessayer.');
    }
  };
  

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
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
          }}>Réinitialiser le mot de passe</h1>
          <p style={{
            color: '#666',
            fontSize: '15px',
            letterSpacing: '0.3px'
          }}>Entrez votre adresse e-mail pour recevoir un code de réinitialisation</p>
        </div>

        <form onSubmit={handleSendCode} style={{
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

          {successMessage && (
            <div style={{
              color: '#2ecc71',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center',
              padding: '10px',
              backgroundColor: 'rgba(46, 204, 113, 0.1)',
              borderRadius: '6px'
            }}>
              {successMessage}
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
            Envoyer le code de réinitialisation
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
  <a
    href="/"
    style={{
      color: '#1e3c72',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.3s ease',
    }}
  >
    Retour à la page de connexion
  </a>
</div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;