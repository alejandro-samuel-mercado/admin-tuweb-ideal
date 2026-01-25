import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold font-display text-gradient">Reviews</h1>
          <p class="text-text-secondary mt-2">Manage customer feedback</p>
        </div>
        <button
          (click)="showCreateModal = true"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Review
        </button>
      </div>

      <!-- Create Modal -->
      <div
        *ngIf="showCreateModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="glass-panel bg-surface rounded-xl shadow-2xl w-full max-w-md p-6 border border-border">
          <h3 class="text-xl font-bold text-text-primary mb-4">Create New Review</h3>
          <form (ngSubmit)="createReview()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-text-secondary mb-1"
                  >Customer Name</label
                >
                <input
                  type="text"
                  [(ngModel)]="newReview.name"
                  name="name"
                  required
                  class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-text-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-text-secondary mb-1"
                  >Rating (1-5)</label
                >
                <select
                  [(ngModel)]="newReview.rating"
                  name="rating"
                  required
                  class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-text-primary"
                >
                  <option [ngValue]="5">5 Stars</option>
                  <option [ngValue]="4">4 Stars</option>
                  <option [ngValue]="3">3 Stars</option>
                  <option [ngValue]="2">2 Stars</option>
                  <option [ngValue]="1">1 Star</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-text-secondary mb-1">Comment</label>
                <textarea
                  [(ngModel)]="newReview.comment"
                  name="comment"
                  required
                  rows="3"
                  class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-text-primary"
                ></textarea>
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  [(ngModel)]="newReview.approved"
                  name="approved"
                  id="approved"
                  class="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-surface-highlight/50"
                />
                <label for="approved" class="text-sm font-medium text-text-secondary">Approve immediately</label>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                (click)="showCreateModal = false"
                class="px-4 py-2 bg-surface text-text-secondary border border-border hover:bg-surface-highlight rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                Create Review
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="glass-panel rounded-xl border border-border overflow-hidden shadow-lg shadow-black/5">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-surface-highlight/50 border-b border-border">
                <th class="px-6 py-4 font-bold text-text-muted text-xs uppercase tracking-wider">Customer</th>
                <th class="px-6 py-4 font-bold text-text-muted text-xs uppercase tracking-wider">Rating</th>
                <th class="px-6 py-4 font-bold text-text-muted text-xs uppercase tracking-wider">Comment</th>
                <th class="px-6 py-4 font-bold text-text-muted text-xs uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 font-bold text-text-muted text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let review of reviews" class="hover:bg-surface-highlight/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-text-primary">{{ review.name }}</div>
                  <div class="text-xs text-text-muted">{{ review.createdAt | date : 'short' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex text-yellow-500">
                    <span *ngFor="let star of [1, 2, 3, 4, 5]">
                      {{ star <= review.rating ? '★' : '☆' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-text-secondary max-w-xs truncate" title="{{ review.comment }}">
                  {{ review.comment }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold border"
                    [ngClass]="
                      review.approved
                        ? 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-800'
                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800'
                    "
                  >
                    {{ review.approved ? 'Approved' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button
                    *ngIf="!review.approved"
                    (click)="toggleApproval(review)"
                    class="text-success hover:text-green-700 font-bold text-xs uppercase tracking-wider bg-success/10 px-2 py-1 rounded hover:bg-success/20 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    *ngIf="review.approved"
                    (click)="toggleApproval(review)"
                    class="text-warning hover:text-yellow-700 font-bold text-xs uppercase tracking-wider bg-warning/10 px-2 py-1 rounded hover:bg-warning/20 transition-colors"
                  >
                    Unapprove
                  </button>
                  <button
                    (click)="deleteReview(review.id)"
                    class="text-error hover:text-red-700 font-bold text-xs uppercase tracking-wider bg-error/10 px-2 py-1 rounded hover:bg-error/20 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr *ngIf="reviews.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-text-muted">
                  No reviews found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  showCreateModal = false;
  newReview = {
    name: '',
    rating: 5,
    comment: '',
    approved: true,
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.http
      .get<Review[]>(`${environment.apiUrl}/reviews/all`, { withCredentials: true })
      .subscribe({
        next: (data) => (this.reviews = data),
        error: (err) => console.error('Error loading reviews:', err),
      });
  }

  createReview() {
    this.http
      .post<Review>(`${environment.apiUrl}/reviews`, this.newReview, { withCredentials: true })
      .subscribe({
        next: (review) => {
          this.reviews.unshift(review);
          this.showCreateModal = false;
          this.newReview = { name: '', rating: 5, comment: '', approved: true };
        },
        error: (err) => console.error('Error creating review:', err),
      });
  }

  toggleApproval(review: Review) {
    this.http
      .put(
        `${environment.apiUrl}/reviews/${review.id}`,
        { approved: !review.approved },
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          review.approved = !review.approved;
        },
        error: (err) => console.error('Error updating review:', err),
      });
  }

  deleteReview(id: number) {
    if (confirm('Are you sure?')) {
      this.http
        .delete(`${environment.apiUrl}/reviews/${id}`, { withCredentials: true })
        .subscribe({
          next: () => {
            this.reviews = this.reviews.filter((r) => r.id !== id);
          },
          error: (err) => console.error('Error deleting review:', err),
        });
    }
  }
}
