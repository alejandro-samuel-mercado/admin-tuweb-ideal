import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-bold font-display text-gradient mb-2">Settings</h1>
        <p class="text-text-secondary">General platform configuration</p>
      </div>

      <div class="grid gap-6">
        <!-- Personal Data -->
        <div class="glass-panel rounded-2xl p-6 shadow-lg shadow-black/5">
          <h3 class="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            Contact Information (Public)
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="block text-sm font-medium text-text-secondary mb-2">Contact Email</label>
              <input
                type="email"
                [(ngModel)]="personalData.email"
                class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted"
                placeholder="email@example.com"
              />
            </div>
            <div class="form-group">
              <label class="block text-sm font-medium text-text-secondary mb-2">Phone / WhatsApp</label>
              <input
                type="text"
                [(ngModel)]="personalData.phone"
                class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted"
                placeholder="+1 234 567 890"
              />
            </div>
            <div class="form-group">
              <label class="block text-sm font-medium text-text-secondary mb-2">City / Location</label>
              <input
                type="text"
                [(ngModel)]="personalData.city"
                class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted"
                placeholder="New York"
              />
            </div>
            <div class="form-group">
              <label class="block text-sm font-medium text-text-secondary mb-2">Country</label>
              <input
                type="text"
                [(ngModel)]="personalData.country"
                class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted"
                placeholder="USA"
              />
            </div>
             <div class="form-group md:col-span-2">
              <label class="block text-sm font-medium text-text-secondary mb-2">Address (Optional)</label>
              <input
                type="text"
                [(ngModel)]="personalData.address"
                class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted"
                placeholder="123 Main St, Suite 100"
              />
            </div>
            
            <!-- Social Media Section -->
            <div class="md:col-span-2 mt-4 pt-4 border-t border-border">
               <h4 class="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Social Media</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                      <svg class="w-4 h-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      Instagram URL
                    </label>
                    <input type="text" [(ngModel)]="personalData.instagram" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted" placeholder="https://instagram.com/..." />
                  </div>
                  <div class="form-group">
                    <label class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                      <svg class="w-4 h-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      Facebook URL
                    </label>
                    <input type="text" [(ngModel)]="personalData.facebook" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted" placeholder="https://facebook.com/..." />
                  </div>
                  <div class="form-group">
                    <label class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                      <svg class="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      LinkedIn URL
                    </label>
                    <input type="text" [(ngModel)]="personalData.linkedin" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted" placeholder="https://linkedin.com/..." />
                  </div>
                  <div class="form-group">
                    <label class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                      <svg class="w-4 h-4 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                      Twitter/X URL
                    </label>
                    <input type="text" [(ngModel)]="personalData.twitter" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary placeholder:text-text-muted" placeholder="https://twitter.com/..." />
                  </div>
               </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end">
            <button
              (click)="savePersonalData()"
              class="px-6 py-2.5 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Contact Info
            </button>
          </div>
        </div>

        <!-- Admin Account (Read Only) -->
        <div class="glass-panel rounded-2xl p-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
          <h3 class="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
             <span class="p-1.5 rounded-lg bg-secondary/10 text-secondary">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
             </span>
             Admin Account (Current Session)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="block text-sm font-medium text-text-secondary mb-2">Name</label>
              <input
                type="text"
                [(ngModel)]="adminName"
                disabled
                class="w-full px-4 py-2.5 bg-surface-highlight/30 border border-border rounded-xl text-text-muted cursor-not-allowed"
              />
            </div>
            <div class="form-group">
              <label class="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input
                type="email"
                [(ngModel)]="adminEmail"
                disabled
                class="w-full px-4 py-2.5 bg-surface-highlight/30 border border-border rounded-xl text-text-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  adminName = '';
  adminEmail = '';
  personalData = {
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: '',
  };

  constructor(private authService: AuthService, private http: HttpClient) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.adminName = user.name || '';
        this.adminEmail = user.email || '';
      }
    });
  }

  ngOnInit() {
    this.loadPersonalData();
  }

  loadPersonalData() {
    this.http
      .get<any>(`${environment.apiUrl}/settings/personal-data`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          if (data) this.personalData = data;
        },
        error: (err) => console.error('Error loading personal data:', err),
      });
  }

  savePersonalData() {
    this.http
      .put(`${environment.apiUrl}/settings/personal-data`, this.personalData, {
        withCredentials: true,
      })
      .subscribe({
        next: () => alert('Datos guardados correctamente'),
        error: (err) => console.error('Error saving personal data:', err),
      });
  }
}
