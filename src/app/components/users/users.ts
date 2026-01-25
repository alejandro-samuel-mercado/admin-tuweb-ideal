import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div>
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold font-display text-gradient">Users</h1>
          <p class="text-text-secondary mt-1">Manage all registered users</p>
        </div>
        <div class="flex flex-wrap gap-4">
          <button
            (click)="loadUsers()"
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
            class="bg-surface rounded-xl border border-border px-4 py-2 flex items-center gap-2 shadow-sm flex-1 md:flex-none"
          >
            <svg
              class="w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Search by name or email..."
              class="outline-none text-sm w-full md:w-64 bg-transparent text-text-primary placeholder:text-text-muted border-none focus:ring-0 p-0"
            />
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div
        *ngIf="!loading"
        class="glass-panel rounded-2xl border border-white/20 overflow-hidden shadow-lg shadow-black/5"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-surface-highlight/50 border-b border-border">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Orders
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Joined
                </th>
                <th
                  class="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let user of users" class="hover:bg-surface-highlight/30 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-secondary/20"
                    >
                      {{ user.name?.charAt(0) || 'U' }}
                    </div>
                    <div>
                      <p class="font-medium text-text-primary group-hover:text-primary transition-colors">{{ user.name || 'No Name' }}</p>
                      <p class="text-xs text-text-muted">ID: {{ user.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-text-secondary">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <button
                    (click)="viewUserOrders(user.id)"
                    class="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium hover:bg-secondary/20 transition-colors"
                  >
                    {{ user._count?.orders || 0 }} Orders
                  </button>
                </td>
                <td class="px-6 py-4 text-sm text-text-secondary">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    (click)="deleteUser(user.id, user.name)"
                    class="text-error hover:text-red-700 font-medium text-sm hover:bg-error/10 px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="users.length === 0" class="p-12 text-center">
          <div
            class="w-16 h-16 bg-surface-highlight rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-text-muted"
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
          <h3 class="text-lg font-bold text-text-primary mb-2">No users found</h3>
          <p class="text-text-secondary">Try a different search term</p>
        </div>
      </div>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  searchTerm = '';
  private searchTimeout: any;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  onSearch() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadUsers();
    }, 300);
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers(this.searchTerm).subscribe({
      next: (res) => {
        this.users = res.users;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  viewUserOrders(userId: number) {
    this.router.navigate(['/orders'], { queryParams: { userId } });
  }

  deleteUser(id: number, name: string) {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
