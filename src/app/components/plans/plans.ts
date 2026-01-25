import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold font-display text-gradient mb-6">Plans Management</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let plan of plans"
          class="glass-panel p-6 rounded-xl shadow-sm border border-border flex flex-col h-full hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-4">
             <h3 class="font-bold text-xl text-text-primary">{{ plan.name }}</h3>
             <span class="px-2 py-1 bg-surface-highlight text-text-secondary rounded text-xs border border-border">{{ plan.slug }}</span>
          </div>

          <!-- Tabs for Language -->
          <div class="flex space-x-1 bg-surface-highlight p-1 rounded-lg mb-4 text-xs font-medium border border-border/50">
             <button 
                class="flex-1 py-1.5 rounded-md transition-all"
                [class.bg-surface]="activeLang === 'es'"
                [class.shadow-sm]="activeLang === 'es'"
                [class.text-text-primary]="activeLang === 'es'"
                [class.text-text-muted]="activeLang !== 'es'"
                (click)="activeLang = 'es'"
             >Español</button>
             <button 
                class="flex-1 py-1.5 rounded-md transition-all"
                [class.bg-surface]="activeLang === 'en'"
                [class.shadow-sm]="activeLang === 'en'"
                [class.text-text-primary]="activeLang === 'en'"
                [class.text-text-muted]="activeLang !== 'en'"
                (click)="activeLang = 'en'"
             >English</button>
          </div>

          <div class="space-y-4 flex-grow">
             <div>
                <label class="block text-xs font-bold text-text-muted uppercase mb-1">Tagline</label>
                <input 
                    *ngIf="activeLang === 'es'"
                    type="text" 
                    [(ngModel)]="plan.tagline" 
                    class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted" 
                    placeholder="Frase corta (ES)..."
                />
                <input 
                    *ngIf="activeLang === 'en'"
                    type="text" 
                    [(ngModel)]="plan.tagline_en" 
                    class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted" 
                    placeholder="Short tagline (EN)..."
                />
             </div>
             
             <div>
                <label class="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
                <textarea 
                    *ngIf="activeLang === 'es'"
                    [(ngModel)]="plan.description" 
                    rows="3"
                    class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted"
                    placeholder="Descripción principal (ES)..."
                ></textarea>
                <textarea 
                    *ngIf="activeLang === 'en'"
                    [(ngModel)]="plan.description_en" 
                    rows="3"
                    class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted"
                    placeholder="Main description (EN)..."
                ></textarea>
             </div>

             <div>
                <label class="block text-xs font-bold text-text-muted uppercase mb-1">Detailed</label>
                <textarea 
                    *ngIf="activeLang === 'es'"
                    [(ngModel)]="plan.detailedDescription" 
                    rows="4"
                    class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted"
                    placeholder="Descripción detallada (ES)..."
                ></textarea>
                <textarea 
                    *ngIf="activeLang === 'en'"
                    [(ngModel)]="plan.detailedDescription_en" 
                    rows="4"
                    class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted"
                    placeholder="Detailed description (EN)..."
                ></textarea>
             </div>

             <div>
            <label class="block text-xs font-bold text-text-muted uppercase mb-1">Price</label>
            <input type="number" [(ngModel)]="plan.price" class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary" />
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-border">
             <button
                (click)="updatePlan(plan)"
                class="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-bold text-sm shadow-lg shadow-primary/20"
            >
                Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PlansComponent implements OnInit {
  plans: any[] = [];
  activeLang: 'es' | 'en' = 'es';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.adminService.getPlans().subscribe((res) => (this.plans = res.plans));
  }

  updatePlan(plan: any) {
    this.adminService.updatePlan(plan.id, plan).subscribe(() => alert('Plan updated'));
  }

}
