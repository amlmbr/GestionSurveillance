import React from 'react';

const Message = ({ content, type, timestamp }) => {
  // Ajout de la fonction formatTime
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatText = (text) => {
    // Remplacer les segments encadrés par ** par des balises <strong>
    const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return boldText.split('\n').map((line, index) => {
      // Titres
      if (line.includes('DÉTAILS DE LA SURVEILLANCE') || line.includes('SURVEILLANTS') || line.includes('RECOMMANDATIONS')) {
        return (
          <div key={index} className="font-bold mb-2" dangerouslySetInnerHTML={{ __html: line }} />
        );
      }

      // Éléments avec emoji au début
      if (/^\p{Emoji}/u.test(line)) {
        return (
          <div key={index} className="my-1" dangerouslySetInnerHTML={{ __html: line }} />
        );
      }

      // Éléments de liste
      if (line.startsWith('-') || line.startsWith('•')) {
        return (
          <div key={index} className="ml-4 my-1" dangerouslySetInnerHTML={{ __html: line }} />
        );
      }

      // Lignes normales
      return (
        <React.Fragment key={index}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          {index < boldText.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className={`message-wrapper ${
        type === 'user' ? 'user-message' : 'bot-message'
      }`}
    >
      <div className="message-bubble">
        {formatText(content)}
        <span className="timestamp">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
};

export default Message;
