import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold font-display text-gradient">Projects</h1>
          <p class="text-text-secondary mt-2">Manage project tracking and deliverables</p>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-text-muted"
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
          </div>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Search by name, client, ID or date..."
            class="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-surface-highlight/50 placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out text-text-primary"
          />
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-1 rounded-xl bg-surface-highlight p-1 mb-6 w-fit border border-border/50">
        <button
          (click)="setStatusFilter('IN_PROGRESS')"
          [class.bg-surface]="statusFilter === 'IN_PROGRESS'"
          [class.shadow-sm]="statusFilter === 'IN_PROGRESS'"
          [class.text-text-primary]="statusFilter === 'IN_PROGRESS'"
          [class.text-text-muted]="statusFilter !== 'IN_PROGRESS'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          In Progress
        </button>
        <button
          (click)="setStatusFilter('FINISHED')"
          [class.bg-surface]="statusFilter === 'FINISHED'"
          [class.shadow-sm]="statusFilter === 'FINISHED'"
          [class.text-text-primary]="statusFilter === 'FINISHED'"
          [class.text-text-muted]="statusFilter !== 'FINISHED'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          Finished
        </button>
      </div>

      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div
        *ngIf="!loading && filteredProjects.length === 0"
        class="glass-panel rounded-xl shadow-sm border border-border p-12 text-center"
      >
        <div
          class="w-16 h-16 bg-surface-highlight rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">
          {{ searchTerm ? 'No projects found' : 'No projects in this section' }}
        </h3>
        <p class="text-text-secondary">
          {{
            searchTerm
              ? 'Try different search terms'
              : statusFilter === 'IN_PROGRESS'
              ? 'Projects will appear here when orders are accepted and paid'
              : 'Projects marked as finished will appear here'
          }}
        </p>
      </div>

      <!-- Projects Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        *ngIf="!loading && filteredProjects.length > 0"
      >
        <div
          *ngFor="let project of filteredProjects"
          class="glass-panel rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
          <div class="p-6 border-b border-border bg-gradient-to-br from-surface-highlight/30 to-surface">
            <div class="flex justify-between items-start mb-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-bold border"
                [ngClass]="
                  project.order.status === 'FINISHED'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-info/10 text-info border-info/20'
                "
              >
                {{ project.order.status }}
              </span>
              <span class="text-sm text-text-muted">#{{ project.order.id }}</span>
            </div>
            <h3 class="text-lg font-bold text-text-primary mb-1">
              {{ project.name || 'Unnamed Project' }}
            </h3>
            <p class="text-sm text-text-secondary mb-2">{{ project.order.user.name }}</p>
            <p class="text-primary font-medium text-xs uppercase tracking-wider">
              {{ project.order.plan }}
            </p>
          </div>

          <div class="p-6 flex-grow">
            <div class="space-y-3 text-sm text-text-secondary">
              <div class="flex items-center gap-2">
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span class="truncate">{{ project.url || 'URL not set' }}</span>
              </div>
              <div class="flex items-center gap-2">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span class="truncate">{{
                  project.documentationUrl ? 'Documentation available' : 'No documentation'
                }}</span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-surface-highlight/30 border-t border-border mt-auto">
            <button
              (click)="openEditModal(project)"
              class="w-full py-2 bg-surface border border-border text-text-secondary rounded-lg hover:bg-surface-highlight hover:text-primary hover:border-primary/50 transition-all font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Manage Project
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        *ngIf="selectedProject"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="glass-panel bg-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
          <div
            class="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-surface/95 backdrop-blur z-10"
          >
            <div>
              <h3 class="text-xl font-bold text-text-primary">
                Manage Project #{{ selectedProject.order.id }}
              </h3>
              <p class="text-sm text-text-secondary">
                {{ selectedProject.order.user.name }} - {{ selectedProject.order.plan }}
              </p>
            </div>
            <button (click)="closeEditModal()" class="text-text-muted hover:text-text-primary">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-text-secondary mb-2"
                  >Project Name</label
                >
                <input
                  type="text"
                  [(ngModel)]="selectedProject.name"
                  placeholder="Ex: Shoe E-commerce"
                  class="w-full px-4 py-2 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder:text-text-muted"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-2">Site URL</label>
                <input
                  type="url"
                  [(ngModel)]="selectedProject.url"
                  placeholder="https://example.com"
                  class="w-full px-4 py-2 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder:text-text-muted"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-2"
                  >Admin Panel URL</label
                >
                <input
                  type="url"
                  [(ngModel)]="selectedProject.adminPanelUrl"
                  placeholder="https://admin.example.com"
                  class="w-full px-4 py-2 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder:text-text-muted"
                />
              </div>

              <!-- Credentials Section -->
              <div class="md:col-span-2 bg-surface-highlight/30 p-4 rounded-lg border border-border">
                <h4 class="text-sm font-bold text-text-primary mb-3">Access Credentials</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-text-muted mb-1"
                      >Admin User</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="selectedProject.adminUsername"
                      placeholder="admin"
                      class="w-full px-3 py-2 bg-surface border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-text-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-text-muted mb-1"
                      >Admin Password</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="selectedProject.adminPassword"
                      placeholder="********"
                      class="w-full px-3 py-2 bg-surface border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-text-primary"
                    />
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-text-secondary mb-2">Description</label>
                <textarea
                  [(ngModel)]="selectedProject.description"
                  rows="3"
                  placeholder="Delivered project description..."
                  class="w-full px-4 py-2 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder:text-text-muted"
                ></textarea>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-text-secondary mb-2"
                  >Documentation URL (PDF)</label
                >
                <input
                  type="url"
                  [(ngModel)]="selectedProject.documentationUrl"
                  placeholder="https://example.com/docs.pdf"
                  class="w-full px-4 py-2 bg-surface-highlight/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>
          </div>

          <div
            class="p-6 border-t border-border bg-surface-highlight/30 flex justify-between items-center sticky bottom-0 backdrop-blur"
          >
            <button
              *ngIf="selectedProject.order.status !== 'FINISHED'"
              (click)="markAsFinished(selectedProject.order.id)"
              class="px-4 py-2 text-success hover:bg-success/10 rounded-lg font-medium transition-colors border border-transparent hover:border-success/20"
            >
              Mark as Finished
            </button>
            <div *ngIf="selectedProject.order.status === 'FINISHED'"></div>
            <!-- Spacer -->

            <div class="flex gap-3">
              <button
                (click)="closeEditModal()"
                class="px-4 py-2 text-text-secondary hover:bg-surface-highlight rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                (click)="updateProject(selectedProject)"
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm shadow-primary/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = true;
  selectedProject: any = null;
  searchTerm: string = '';
  statusFilter: string = 'IN_PROGRESS';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadProjects();
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.loadProjects();
  }

  get filteredProjects() {
    if (!this.searchTerm) return this.projects;

    const term = this.searchTerm.toLowerCase();
    return this.projects.filter(
      (project) =>
        (project.name && project.name.toLowerCase().includes(term)) ||
        project.order.user.name.toLowerCase().includes(term) ||
        project.order.id.toString().includes(term) ||
        new Date(project.order.createdAt).toLocaleDateString().includes(term)
    );
  }

  loadProjects() {
    this.loading = true;
    this.adminService.getOrders({ status: this.statusFilter }).subscribe({
      next: (res) => {
        this.projects = res.orders.map((order: any) => ({
          order,
          name: order.project?.name || '',
          url: order.project?.url || '',
          adminPanelUrl: order.project?.adminPanelUrl || '',
          adminUsername: order.project?.adminUsername || '',
          adminPassword: order.project?.adminPassword || '',
          description: order.project?.description || '',
          documentationUrl: order.project?.documentationUrl || '',
        }));
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openEditModal(project: any) {
    this.selectedProject = { ...project };
  }

  closeEditModal() {
    this.selectedProject = null;
  }

  updateProject(project: any) {
    this.adminService
      .updateProject(project.order.id, {
        name: project.name,
        url: project.url,
        adminPanelUrl: project.adminPanelUrl,
        adminUsername: project.adminUsername,
        adminPassword: project.adminPassword,
        description: project.description,
        documentationUrl: project.documentationUrl,
      })
      .subscribe(() => {
        const index = this.projects.findIndex((p) => p.order.id === project.order.id);
        if (index !== -1) {
          this.projects[index] = { ...project };
        }
        alert('Project updated successfully');
        this.closeEditModal();
      });
  }

  markAsFinished(orderId: number) {
    if (confirm('Mark this project as finished?')) {
      this.adminService.updateOrder(orderId, { status: 'FINISHED' }).subscribe(() => {
        alert('Project finished');
        this.loadProjects();
        this.closeEditModal();
      });
    }
  }
}
