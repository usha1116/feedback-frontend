import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSuggestion } from '../services/api';
import './SubmitSuggestion.css';

function SubmitSuggestion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    if (formData.description.length > 1000) {
      setError('Description must be 1000 characters or less');
      return;
    }

    try {
      setLoading(true);
      await createSuggestion(formData);
      setSuccess(true);
      setFormData({ title: '', description: '' });
      
      // Redirect to board after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-suggestion">
      <div className="submit-header">
        <h1>💡 Submit a Suggestion</h1>
        <p className="subtitle">Share your ideas with the community</p>
      </div>

      <div className="submit-form-container">
        {success && (
          <div className="success-message">
            ✅ Suggestion submitted successfully! Redirecting to board...
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="suggestion-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a clear, concise title for your suggestion"
              maxLength={200}
              required
            />
            <span className="char-count">
              {formData.title.length}/200
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your suggestion in detail..."
              rows={8}
              maxLength={1000}
              required
            />
            <span className="char-count">
              {formData.description.length}/1000
            </span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitSuggestion;

