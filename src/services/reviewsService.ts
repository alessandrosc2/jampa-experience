import { Review } from '../types/place';

const STORAGE_REVIEWS_KEY = 'jampa_places_reviews';

class ReviewsService {
  private getCustomReviews(): Record<string, Review[]> {
    const data = localStorage.getItem(STORAGE_REVIEWS_KEY);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  private saveCustomReviews(map: Record<string, Review[]>): void {
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(map));
  }

  public getReviewsForPlace(placeId: string, initialReviews: Review[] = []): Review[] {
    const map = this.getCustomReviews();
    const custom = map[placeId] || [];
    return [...custom, ...initialReviews];
  }

  public addReview(
    placeId: string,
    review: {
      author: string;
      avatar?: string;
      rating: number;
      comment: string;
      isVerifiedBuyer: boolean;
    }
  ): Review {
    const map = this.getCustomReviews();
    const list = map[placeId] || [];

    const newRev: Review = {
      id: 'rev-custom-' + Date.now(),
      author: review.author,
      avatar: review.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.author)}`,
      rating: review.rating,
      date: new Date().toLocaleDateString('pt-BR'),
      comment: review.comment,
      isVerifiedBuyer: review.isVerifiedBuyer
    };

    list.unshift(newRev);
    map[placeId] = list;
    this.saveCustomReviews(map);

    return newRev;
  }
}

export const reviewsService = new ReviewsService();
