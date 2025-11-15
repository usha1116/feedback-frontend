import { useState, useEffect } from 'react';
import { getSuggestions, upvoteSuggestion, downvoteSuggestion } from '../services/api';
import socket from '../services/socket';
import './SuggestionBoard.css';

function SuggestionBoard() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial suggestions
    fetchSuggestions();

    // Listen for real-time updates
    socket.on('newSuggestion', (newSuggestion) => {
      setSuggestions((prev) => [newSuggestion, ...prev]);
    });

    socket.on('suggestionUpdated', (updatedSuggestion) => {
      setSuggestions((prev) =>
        prev.map((s) =>
          s._id === updatedSuggestion._id ? updatedSuggestion : s
        )
      );
    });

    return () => {
      socket.off('newSuggestion');
      socket.off('suggestionUpdated');
    };
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await getSuggestions();
      setSuggestions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await upvoteSuggestion(id);
      // Socket will handle the real-time update
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleDownvote = async (id) => {
    try {
      await downvoteSuggestion(id);
      // Socket will handle the real-time update
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
  };

  const getNetVotes = (upvotes, downvotes) => {
    return upvotes - downvotes;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchSuggestions}>Retry</button>
      </div>
    );
  }

  return (
    <div className="suggestion-board">
      <div className="board-header">
        <h1>💡 Suggestion Board</h1>
        <p className="subtitle">Share your ideas and vote on suggestions</p>
      </div>

      {suggestions.length === 0 ? (
        <div className="empty-state">
          <p>No suggestions yet. Be the first to share an idea!</p>
        </div>
      ) : (
        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
            <div key={suggestion._id} className="suggestion-card">
              <div className="vote-section">
                <button
                  className="vote-btn upvote"
                  onClick={() => handleUpvote(suggestion._id)}
                  aria-label="Upvote"
                >
                  ▲
                </button>
                <div className="vote-count">
                  <span className="net-votes">
                    {getNetVotes(suggestion.upvotes, suggestion.downvotes)}
                  </span>
                  <span className="vote-details">
                    {suggestion.upvotes}↑ / {suggestion.downvotes}↓
                  </span>
                </div>
                <button
                  className="vote-btn downvote"
                  onClick={() => handleDownvote(suggestion._id)}
                  aria-label="Downvote"
                >
                  ▼
                </button>
              </div>

              <div className="suggestion-content">
                <h3 className="suggestion-title">{suggestion.title}</h3>
                <p className="suggestion-description">{suggestion.description}</p>
                <div className="suggestion-meta">
                  <span className="timestamp">
                    {new Date(suggestion.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuggestionBoard;

