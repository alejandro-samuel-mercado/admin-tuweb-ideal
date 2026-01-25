import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-bold font-display text-gradient mb-2">Dashboard</h1>
        <p class="text-text-secondary mt-2">Platform overview</p>
      </div>

      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Stats Cards -->
      <div *ngIf="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="glass-panel rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-primary/10 rounded-lg">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span class="text-xs font-bold text-success bg-success/10 border border-success/20 px-2 py-1 rounded-full"
              >+12%</span
            >
          </div>
          <h3 class="text-2xl font-bold text-text-primary">{{ stats.totalUsers }}</h3>
          <p class="text-sm text-text-secondary mt-1">Total Users</p>
        </div>

        <div
          class="glass-panel rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-secondary/10 rounded-lg">
              <svg
                class="w-6 h-6 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span class="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full"
              >+5%</span
            >
          </div>
          <h3 class="text-2xl font-bold text-text-primary">{{ stats.totalOrders }}</h3>
          <p class="text-sm text-text-secondary mt-1">Total Orders</p>
        </div>

        <div
          class="glass-panel rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-warning/10 rounded-lg">
              <svg
                class="w-6 h-6 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-text-primary">{{ stats.pendingOrders }}</h3>
          <p class="text-sm text-text-secondary mt-1">Pending Orders</p>
        </div>

        <div
          class="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-sm p-6 text-white border border-primary/20"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 class="text-2xl font-bold">\${{ stats?.totalRevenue || 0 | number }}</h3>
          <p class="text-sm text-white/80 mt-1">Total Revenue</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Monthly Sales Chart (New) -->
        <div class="glass-panel rounded-xl shadow-sm border border-border p-6">
             <h3 class="text-lg font-bold text-text-primary mb-6">Monthly Sales</h3>
             <div class="h-64 flex items-end gap-2">
                 <div *ngFor="let item of stats.salesChartData" class="flex-1 flex flex-col items-center gap-2 group">
                      <div class="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/40 transition-colors border-t border-x border-primary/30" [style.height.%]="(item.value / maxSales) * 100">
                           <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface text-text-primary border border-border text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                \${{ item.value }}
                           </div>
                      </div>
                      <span class="text-xs text-text-muted font-medium rotate-45 origin-left translate-y-2">{{ item.name }}</span>
                 </div>
                 <div *ngIf="!stats.salesChartData?.length" class="w-full h-full flex items-center justify-center text-text-muted">
                    No data available
                 </div>
             </div>
        </div>

        <!-- Orders by Status -->
        <div class="glass-panel rounded-xl shadow-sm border border-border p-6">
          <h3 class="text-lg font-bold text-text-primary mb-6">Order Status</h3>
          <div class="space-y-4">
            <div
              *ngFor="let status of stats.ordersByStatus"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-3 h-3 rounded-full"
                  [ngClass]="{
                    'bg-warning': status.status === 'PENDING',
                    'bg-blue-500': status.status === 'ACCEPTED',
                    'bg-primary': status.status === 'IN_PROGRESS',
                    'bg-success': status.status === 'FINISHED'
                  }"
                ></div>
                <span class="text-sm font-medium text-text-secondary">{{
                  getStatusLabel(status.status)
                }}</span>
              </div>
              <span class="text-2xl font-bold text-text-primary">{{ status._count.status }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="glass-panel rounded-xl shadow-sm border border-border p-6">
          <h3 class="text-lg font-bold text-text-primary mb-6">Recent Activity</h3>
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-2 h-2 rounded-full bg-success mt-2"></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-text-primary">New user registered</p>
                <p class="text-xs text-text-muted">5 minutes ago</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-text-primary">Order #23 accepted</p>
                <p class="text-xs text-text-muted">1 hour ago</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-text-primary">Project #15 finished</p>
                <p class="text-xs text-text-muted">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  loading = true;
  maxSales = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.maxSales = Math.max(...(data.salesChartData?.map((d: any) => d.value) || [1]));
        if (this.maxSales === 0) this.maxSales = 1; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching stats', err);
        this.loading = false;
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      PENDING: 'Pending',
      ACCEPTED: 'Accepted',
      IN_PROGRESS: 'In Progress',
      FINISHED: 'Finished',
    };
    return labels[status] || status;
  }
}
