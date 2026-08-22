import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, Sparkles, Send, UserCheck } from 'lucide-react';
import { Review } from '../../types/place';
import { reviewsService } from '../../services/reviewsService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { User } from '../../types/user';

interface ReviewSectionProps {
  placeId: string;
  initialReviews: Review[];
  currentUser: User | null;
  isVipMode: boolean;
  onRequireAuth: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  placeId,
  initialReviews,
  currentUser,
  isVipMode,
  onRequireAuth
}) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    return reviewsService.getReviewsForPlace(placeId, initialReviews);
  });

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const handleToggleLike = (id: string) => {
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!comment.trim()) return;

    const newRev = reviewsService.addReview(placeId, {
      author: currentUser.name,
      avatar: currentUser.avatarUrl,
      rating,
      comment: comment.trim(),
      isVerifiedBuyer: isVipMode
    });

    setReviews([newRev, ...reviews]);
    setComment('');
    setShowForm(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="reviews-interactive-section">
      <div className="reviews-top-bar">
        <div className="reviews-summary-left">
          <h4 className="reviews-title">
            <MessageSquare size={18} color="#00B4D8" />
            <span>Avaliações & Comentários ({reviews.length})</span>
          </h4>
          <div className="reviews-avg-pill glass-panel">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span className="avg-num">{averageRating}</span>
            <span className="avg-max">/ 5.0</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          iconLeft={<Sparkles size={14} />}
          onClick={() => {
            if (!currentUser) {
              onRequireAuth();
            } else {
              setShowForm(!showForm);
            }
          }}
        >
          {showForm ? 'Cancelar' : 'Escrever Avaliação'}
        </Button>
      </div>

      {/* Formulário de Envio de Avaliação */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="review-form-box glass-panel">
          <span className="form-legend">Sua Avaliação para este Local</span>
          
          <div className="star-picker-row">
            <span className="star-picker-label">Nota:</span>
            <div className="stars-group">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="star-pick-btn"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={22}
                    fill={(hoverRating || rating) >= star ? '#F59E0B' : 'transparent'}
                    color={(hoverRating || rating) >= star ? '#F59E0B' : '#64748B'}
                  />
                </button>
              ))}
            </div>
            <span className="rating-text-hint">{rating} de 5 estrelas</span>
          </div>

          <textarea
            required
            rows={3}
            placeholder="Compartilhe o que você mais gostou, dicas de horários, pratos ou experiências..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="review-textarea"
          />

          <div className="review-form-footer">
            <div className="author-signed">
              <UserCheck size={14} color="#10B981" />
              <span>Publicando como <strong>{currentUser?.name || 'Membro'}</strong></span>
            </div>

            <Button type="submit" variant="gold" size="sm" iconLeft={<Send size={14} />}>
              Publicar Avaliação
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Avaliações */}
      <div className="reviews-cards-list">
        {reviews.map((rev) => {
          const isLiked = !!likedReviews[rev.id];
          return (
            <div key={rev.id} className="review-card glass-panel">
              <div className="review-header">
                <img src={rev.avatar} alt={rev.author} className="rev-avatar" />
                <div className="rev-author-col">
                  <span className="rev-name">{rev.author}</span>
                  <div className="rev-stars-row">
                    <div className="stars-fill">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < rev.rating ? '#F59E0B' : 'transparent'}
                          color={i < rev.rating ? '#F59E0B' : '#64748B'}
                        />
                      ))}
                    </div>
                    <span className="rev-date">{rev.date}</span>
                  </div>
                </div>

                {rev.isVerifiedBuyer && (
                  <Badge variant="emerald" size="sm" icon={<CheckCircle2 size={12} />}>
                    Turista VIP
                  </Badge>
                )}
              </div>

              <p className="rev-comment">{rev.comment}</p>

              <div className="rev-footer-row">
                <button
                  className={`like-helpful-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => handleToggleLike(rev.id)}
                  title="Marcar como útil"
                >
                  <ThumbsUp size={13} />
                  <span>{isLiked ? 'Útil (1)' : 'Útil'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .reviews-interactive-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-lg);
        }

        .reviews-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .reviews-summary-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .reviews-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.05rem;
          color: #F8FAFC;
        }

        .reviews-avg-pill {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.6rem;
          background: rgba(12, 20, 31, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .avg-num {
          color: #F4A261;
        }

        .avg-max {
          color: #64748B;
        }

        .review-form-box {
          padding: var(--space-md);
          background: rgba(8, 14, 22, 0.95);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          animation: fadeIn 0.2s ease;
        }

        .form-legend {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .star-picker-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .star-picker-label {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .stars-group {
          display: flex;
          gap: 0.2rem;
        }

        .star-pick-btn {
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .star-pick-btn:hover {
          transform: scale(1.2);
        }

        .rating-text-hint {
          font-size: 0.75rem;
          color: #F4A261;
          font-weight: 600;
          margin-left: 0.35rem;
        }

        .review-textarea {
          width: 100%;
          padding: 0.65rem 0.85rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #F8FAFC;
          font-family: inherit;
          font-size: 0.875rem;
          outline: none;
          resize: vertical;
        }

        .review-textarea:focus {
          border-color: #00B4D8;
        }

        .review-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .author-signed {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .author-signed strong {
          color: #F8FAFC;
        }

        .reviews-cards-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .review-card {
          padding: var(--space-md);
          background: rgba(12, 20, 31, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .review-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .rev-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border-medium);
        }

        .rev-author-col {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .rev-name {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .rev-stars-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars-fill {
          display: flex;
          gap: 1px;
        }

        .rev-date {
          font-size: 0.6875rem;
          color: #64748B;
        }

        .rev-comment {
          font-size: 0.875rem;
          color: #CBD5E1;
          line-height: 1.5;
        }

        .rev-footer-row {
          display: flex;
          justify-content: flex-end;
        }

        .like-helpful-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.6875rem;
          color: #94A3B8;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .like-helpful-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #F8FAFC;
        }

        .like-helpful-btn.liked {
          background: rgba(0, 180, 216, 0.2);
          border-color: #00B4D8;
          color: #38BDF8;
        }
      `}</style>
    </div>
  );
};
