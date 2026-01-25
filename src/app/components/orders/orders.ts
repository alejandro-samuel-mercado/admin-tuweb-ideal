import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div>
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold font-display text-gradient">Orders</h1>
          <p class="text-text-secondary mt-1">Manage all platform orders</p>
        </div>
        <div class="flex flex-wrap gap-3 items-center">
          <button
            (click)="loadOrders()"
            class="p-2.5 bg-surface rounded-xl border border-border hover:bg-surface-highlight text-text-secondary transition-colors shadow-sm"
            title="Refresh"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <div
            class="flex items-center gap-2 bg-surface rounded-xl border border-border px-4 py-2 shadow-sm"
          >
            <span class="text-xs font-bold text-text-muted uppercase tracking-wider">Date:</span>
            <input
              type="date"
              [(ngModel)]="dateFilter"
              (change)="loadOrders()"
              class="outline-none text-sm bg-transparent text-text-primary border-none focus:ring-0 p-0"
            />
          </div>

          <select
            [(ngModel)]="statusFilter"
            (change)="loadOrders()"
            class="px-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FINISHED">Finished</option>
          </select>

          <button
            *ngIf="userIdFilter || statusFilter || dateFilter"
            (click)="clearFilters()"
            class="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div
        *ngIf="!loading && orders.length === 0"
        class="glass-panel rounded-2xl p-12 text-center"
      >
        <div
          class="w-16 h-16 bg-surface-highlight rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-text-primary mb-2">No orders found</h3>
        <p class="text-text-secondary">
          {{
            userIdFilter || statusFilter || dateFilter
              ? 'No orders match the current filters'
              : 'Orders will appear here when customers make requests'
          }}
        </p>
      </div>

      <div class="grid gap-4">
        <div
          *ngFor="let order of orders"
          [routerLink]="['/order-detail', order.id]"
          class="glass-panel rounded-2xl overflow-hidden hover:translate-y-[-2px] transition-all duration-300 cursor-pointer group border border-white/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3
                    class="text-lg font-bold text-text-primary group-hover:text-primary transition-colors font-display"
                  >
                    Order #{{ order.id }}
                  </h3>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold border"
                    [ngClass]="{
                      'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900': order.status === 'PENDING',
                      'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900': order.status === 'ACCEPTED',
                      'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900': order.status === 'PAYMENT_PENDING',
                      'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900': order.status === 'IN_PROGRESS',
                      'bg-green-500/10 text-green-600 border-green-200 dark:border-green-900': order.status === 'FINISHED'
                    }"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
                <div class="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
                  <span class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-bold text-text-secondary ring-2 ring-white dark:ring-gray-700"
                    >
                      {{ order.user.name.charAt(0) }}
                    </div>
                    {{ order.user.name }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ formatDate(order.createdAt) }}
                  </span>
                  <span
                    class="px-2 py-1 bg-surface-highlight text-text-primary rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Plan {{ order.plan }}
                  </span>
                </div>
              </div>
              <div class="text-text-muted group-hover:text-primary transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  statusFilter = '';
  dateFilter = '';
  userIdFilter: string | null = null;

  constructor(private adminService: AdminService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userIdFilter = params['userId'] || null;
      this.loadOrders();
    });
  }

  loadOrders() {
    this.loading = true;
    const filters: any = {};
    if (this.statusFilter) filters.status = this.statusFilter;
    if (this.dateFilter) filters.date = this.dateFilter;
    if (this.userIdFilter) filters.userId = this.userIdFilter;

    this.adminService.getOrders(filters).subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  clearFilters() {
    this.statusFilter = '';
    this.dateFilter = '';
    this.userIdFilter = null;
    this.loadOrders();
  }

  updateStatus(id: number, status: string) {
    this.adminService.updateOrder(id, { status }).subscribe(() => {
      this.loadOrders();
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      PENDING: 'Pending',
      ACCEPTED: 'Accepted',
      PAYMENT_PENDING: 'Payment Pending',
      IN_PROGRESS: 'In Progress',
      FINISHED: 'Finished',
    };
    return labels[status] || status;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
