import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-background text-text-primary transition-colors duration-300 flex">
      
      <!-- Mobile Header -->
      <header class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <button (click)="toggleSidebar()" class="p-2 -ml-2 rounded-lg hover:bg-surface-highlight text-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span class="font-display font-semibold text-xl tracking-tight text-gradient">Admin</span>
        </div>
        <button (click)="themeService.toggleTheme()" class="p-2 rounded-full hover:bg-surface-highlight text-text-secondary transition-colors">
          <ng-container *ngIf="themeService.isDarkMode(); else moonIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </ng-container>
          <ng-template #moonIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </ng-template>
        </button>
      </header>

      <!-- Sidebar -->
      <aside 
        [class.translate-x-0]="isSidebarOpen()"
        [class.-translate-x-full]="!isSidebarOpen()"
        class="fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen flex flex-col pt-16 lg:pt-0">
        
        <!-- Logo (Desktop) -->
        <div class="hidden lg:flex items-center h-16 px-6 border-b border-border">
          <span class="font-display font-bold text-2xl tracking-tighter text-gradient">Ideal Admin</span>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-highlight transition-all group">
            <svg class="w-5 h-5 transition-colors group-hover:text-primary group-[.text-primary]:text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </a>
          
          <a routerLink="/orders" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-highlight transition-all group">
            <svg class="w-5 h-5 transition-colors group-hover:text-primary group-[.text-primary]:text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Orders
          </a>

          <a routerLink="/users" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-highlight transition-all group">
            <svg class="w-5 h-5 transition-colors group-hover:text-primary group-[.text-primary]:text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Customers
          </a>

          <div class="pt-4 pb-2">
            <p class="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Management</p>
          </div>

          <a routerLink="/content" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-highlight transition-all group">
             <svg class="w-5 h-5 transition-colors group-hover:text-primary group-[.text-primary]:text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Content
          </a>
          
           <a routerLink="/reviews" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-highlight transition-all group">
             <svg class="w-5 h-5 transition-colors group-hover:text-primary group-[.text-primary]:text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Reviews
          </a>

          <a routerLink="/settings" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-highlight transition-all group">
            <svg class="w-5 h-5 transition-colors group-hover:text-primary group-[.text-primary]:text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </a>
        </nav>

        <!-- Footer / User Profile -->
        <div class="p-4 border-t border-border bg-surface-highlight/50">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
               {{ (authService.currentUser$ | async)?.name?.charAt(0) || 'A' }}
             </div>
             <div class="flex-1 min-w-0">
               <p class="text-sm font-medium text-text-primary truncate">{{ (authService.currentUser$ | async)?.name || 'Admin User' }}</p>
               <p class="text-xs text-text-muted truncate">{{ (authService.currentUser$ | async)?.email || 'admin@tuweb.com' }}</p>
             </div>
             <div class="hidden lg:block">
               <button (click)="themeService.toggleTheme()" class="p-2 rounded-full hover:bg-surface dark:hover:bg-surface-highlight text-text-secondary transition-colors" aria-label="Toggle Theme">
                  <ng-container *ngIf="themeService.isDarkMode(); else moonIconDesktop">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  </ng-container>
                  <ng-template #moonIconDesktop>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  </ng-template>
               </button>
             </div>
          </div>
          <button (click)="authService.logout()" class="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-error hover:bg-error/10 rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div *ngIf="isSidebarOpen()" (click)="isSidebarOpen.set(false)" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" aria-hidden="true"></div>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 lg:pt-0">
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
           <router-outlet></router-outlet>
        </div>
      </main>

    </div>
  `,
})
export class LayoutComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  isSidebarOpen = signal<boolean>(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}
