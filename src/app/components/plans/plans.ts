import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold font-display text-gradient mb-2">Plans Management</h1>
          <p class="text-text-secondary">Configure your service offerings and pricing structure</p>
        </div>
        <button
          (click)="openPlanModal()"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span>+</span> Create New Plan
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          *ngFor="let plan of plans"
          class="glass-panel rounded-3xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 border border-border group"
        >
          <div class="p-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="font-black text-2xl text-text-primary tracking-tight group-hover:text-primary transition-colors">{{ plan.name }}</h3>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mt-1 block">{{ plan.slug }}</span>
              </div>
              <div *ngIf="plan.popular" class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-wider border border-primary/20">
                PROMOTED
              </div>
            </div>

            <div class="bg-surface-highlight/40 rounded-2xl p-6 border border-border/50 mb-6">
              <div class="flex items-baseline gap-1 mb-1">
                <span class="text-2xl font-black text-text-primary">$ {{ plan.setupPrice }}</span>
                <span class="text-xs font-bold text-text-muted">Set-up</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span class="text-xs font-bold text-text-secondary">+ $ {{ plan.monthlyPrice }}/mo maintenance</span>
              </div>
              <p *ngIf="plan.price_detail" class="mt-3 text-[10px] text-text-muted italic leading-relaxed">* {{ plan.price_detail }}</p>
            </div>

            <div class="space-y-4 mb-8">
               <div class="flex items-start gap-3">
                  <span class="p-1 px-2 bg-success/10 text-success text-[10px] font-bold rounded">FEATURES</span>
                  <p class="text-xs text-text-secondary line-clamp-2">{{ plan.features.join(', ') }}</p>
               </div>
               <div class="flex items-start gap-3">
                  <span class="p-1 px-2 bg-secondary/10 text-secondary text-[10px] font-bold rounded">IDEAL FOR</span>
                  <p class="text-xs text-text-secondary line-clamp-2">{{ plan.useCases.join(', ') }}</p>
               </div>
            </div>

            <div class="flex gap-3">
              <button
                (click)="editPlan(plan)"
                class="flex-1 px-4 py-3 bg-surface text-text-primary rounded-xl text-sm font-bold hover:bg-surface-highlight transition-all border border-border"
              >
                Configure
              </button>
              <button
                (click)="deletePlan(plan.id)"
                class="px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-all border border-transparent hover:border-error/20"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div>
              <label class="block text-xs font-bold text-text-muted uppercase mb-1">Delivery Time</label>
              <input 
                  *ngIf="activeLang === 'es'"
                  type="text" 
                  [(ngModel)]="plan.deliveryTime" 
                  class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted" 
                  placeholder="Ej. 2 a 3 semanas..."
              />
              <input 
                  *ngIf="activeLang === 'en'"
                  type="text" 
                  [(ngModel)]="plan.deliveryTime_en" 
                  class="w-full text-sm bg-surface-highlight/50 border-border rounded-lg focus:ring-primary focus:border-primary text-text-primary placeholder:text-text-muted" 
                  placeholder="e.g. 2 to 3 weeks..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Plan Modal -->
      <div
        *ngIf="showModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
      >
        <div class="glass-panel bg-surface rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-border animate-scale-up">
          <div class="p-8 border-b border-border flex justify-between items-center bg-surface-highlight/30">
            <div>
              <h3 class="text-2xl font-black text-text-primary tracking-tight">
                {{ editingPlan ? 'Editing Plan' : 'Add New Plan' }}
              </h3>
              <p class="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold">Configure details & pricing</p>
            </div>
            <button (click)="closeModal()" class="p-2 text-text-muted hover:text-text-primary hover:bg-surface-highlight rounded-full transition-all">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <!-- Language Selection -->
            <div class="flex space-x-1 bg-surface-highlight p-1.5 rounded-2xl w-fit border border-border/50">
               <button 
                  class="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  [class.bg-surface]="activeLang === 'es'"
                  [class.text-primary]="activeLang === 'es'"
                  [class.shadow-lg]="activeLang === 'es'"
                  [class.text-text-muted]="activeLang !== 'es'"
                  (click)="activeLang = 'es'"
               >Spanish</button>
               <button 
                  class="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  [class.bg-surface]="activeLang === 'en'"
                  [class.text-primary]="activeLang === 'en'"
                  [class.shadow-lg]="activeLang === 'en'"
                  [class.text-text-muted]="activeLang !== 'en'"
                  (click)="activeLang = 'en'"
               >English</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Display Name</label>
                <input [(ngModel)]="form.name" type="text" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-text-primary font-bold" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">URL Slug</label>
                <input [(ngModel)]="form.slug" type="text" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-text-primary font-bold" placeholder="e.g. ecommerce-plan" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Set-up Fee ($)</label>
                <input [(ngModel)]="form.setupPrice" type="number" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-text-primary font-black text-lg" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Monthly Fee ($)</label>
                <input [(ngModel)]="form.monthlyPrice" type="number" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-text-primary font-black text-lg" />
              </div>
              <div class="flex items-center pt-6">
                <label class="flex items-center gap-3 cursor-pointer group bg-surface-highlight/30 px-6 py-3 rounded-2xl border border-border hover:border-primary transition-all">
                  <input [(ngModel)]="form.popular" type="checkbox" class="w-5 h-5 rounded border-border text-primary focus:ring-primary bg-surface" />
                  <span class="text-xs font-black text-text-secondary group-hover:text-primary transition-colors uppercase tracking-widest">Mark Popular</span>
                </label>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Pricing Detail (Small Print)</label>
              <input [(ngModel)]="form.price_detail" type="text" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl outline-none text-text-primary text-sm italic" placeholder="e.g. Includes hosting and support..." />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Marketing Tagline</label>
              <textarea *ngIf="activeLang === 'es'" [(ngModel)]="form.tagline" rows="2" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-primary" placeholder="Una frase que impacte..."></textarea>
              <textarea *ngIf="activeLang === 'en'" [(ngModel)]="form.tagline_en" rows="2" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-primary" placeholder="Catchy phrase... (EN)"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Main Features (One per line)</label>
                <textarea (input)="updateTextArray($event, 'features')" [value]="featuresText" rows="6" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-primary text-sm leading-relaxed"></textarea>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Ideal For (One per line)</label>
                <textarea (input)="updateTextArray($event, 'useCases')" [value]="useCasesText" rows="6" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-primary text-sm leading-relaxed"></textarea>
              </div>
            </div>

          </div>

          <div class="p-8 border-t border-border bg-surface-highlight/30 flex gap-4">
            <button (click)="closeModal()" class="flex-1 px-8 py-4 bg-surface border border-border text-text-secondary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-surface-highlight transition-all">Cancel</button>
            <button (click)="savePlan()" class="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">Confirm Configuration</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-primary); }
      .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    `,
  ],
})
export class PlansComponent implements OnInit {
  plans: any[] = [];
  activeLang: 'es' | 'en' = 'es';
  showModal = false;
  editingPlan: any = null;

  form: any = {
    name: '',
    slug: '',
    tagline: '',
    tagline_en: '',
    description: '',
    description_en: '',
    detailedDescription: '',
    detailedDescription_en: '',
    price: 0,
    setupPrice: 0,
    monthlyPrice: 0,
    price_detail: '',
    features: [],
    useCases: [],
    popular: false,
  };

  featuresText = '';
  useCasesText = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.adminService.getPlans().subscribe((res: any) => {
      this.plans = res;
    });
  }

  openPlanModal() {
    this.editingPlan = null;
    this.resetForm();
    this.showModal = true;
  }

  editPlan(plan: any) {
    this.editingPlan = plan;
    this.form = JSON.parse(JSON.stringify(plan));
    this.featuresText = (plan.features || []).join('\n');
    this.useCasesText = (plan.useCases || []).join('\n');
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  resetForm() {
    this.form = {
      name: '', slug: '', tagline: '', tagline_en: '', description: '', description_en: '',
      detailedDescription: '', detailedDescription_en: '', price: 0,
      setupPrice: 0, monthlyPrice: 0, price_detail: '',
      features: [], useCases: [], popular: false,
    };
    this.featuresText = '';
    this.useCasesText = '';
  }

  updateTextArray(e: any, field: string) {
    const text = e.target.value;
    if (field === 'features') this.featuresText = text;
    if (field === 'useCases') this.useCasesText = text;
    this.form[field] = text.split('\n').filter((s: string) => s.trim());
  }

  savePlan() {
    // Sync price for legacy if needed (using setupPrice as base)
    this.form.price = this.form.setupPrice;

    if (this.editingPlan) {
      this.adminService.updatePlan(this.editingPlan.id, this.form).subscribe(() => {
        this.loadPlans();
        this.closeModal();
      });
    } else {
      this.adminService.createPlan(this.form).subscribe(() => {
        this.loadPlans();
        this.closeModal();
      });
    }
  }

  deletePlan(id: any) {
    if (confirm('Are you sure you want to delete this plan? This cannot be undone.')) {
      this.adminService.deletePlan(Number(id)).subscribe(() => this.loadPlans());
    }
  }
}

