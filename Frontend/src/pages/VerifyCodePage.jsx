import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updatePassword } from '../services/authService';


const VerifyCodePage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { verificationCodeenvoyer, email } = location.state || {};
  const handleVerifyCode = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    if(verificationCode!=verificationCodeenvoyer)
    {
        setErrorMessage('Le code de vérification est incorrect.');
        return
    }


    await updatePassword(email,newPassword)
    setErrorMessage('');
    setSuccessMessage('Votre mot de passe a été changé avec succès.'); // à remplacer par la logique réelle
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
          }}>Vérifier le Code</h1>
          <p style={{
            color: '#666',
            fontSize: '15px',
            letterSpacing: '0.3px'
          }}>Entrez le code de vérification que vous avez reçu par e-mail</p>
        </div>

        <form onSubmit={handleVerifyCode} style={{
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
              Code de Vérification
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
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
              placeholder="Entrez le code de vérification"
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
              Nouveau Mot de Passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              placeholder="Entrez le nouveau mot de passe"
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
              Confirmer le Mot de Passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              placeholder="Confirmez le mot de passe"
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
              <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={navigate("/")}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#1e3c72',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px'
                    }}
                  >
                    Retour à la page de connexion
                  </button>
                </div>
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
            Vérifier et Changer le Mot de Passe
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCodePage;
