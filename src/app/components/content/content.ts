import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin';

@Component({
    selector: 'app-content',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold font-display text-gradient mb-2">Website Content</h1>
        <p class="text-text-secondary mt-2">
          Manage plans and example projects visible to clients
        </p>
      </div>

      <div class="space-y-12">
        <!-- Example Projects Section -->

        <section>
          <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold text-text-primary flex items-center gap-2">
              <span class="p-2 bg-secondary/10 text-secondary rounded-lg">🚀</span>
              Example Projects
            </h2>
            <button
              (click)="openProjectModal()"
              class="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2"
            >
              <span>+</span> New Project
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let project of projects"
              class="glass-panel rounded-2xl overflow-hidden hover:translate-y-[-2px] transition-transform duration-300 group"
            >
              <div class="aspect-video bg-surface-highlight relative overflow-hidden">
                <img
                  [src]="project.imageUrl"
                  [alt]="project.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div class="absolute top-3 left-3">
                  <span
                    class="px-3 py-1 bg-surface/90 backdrop-blur-md text-text-primary text-xs font-bold rounded-full shadow-sm border border-border"
                    >{{ project.category }}</span
                  >
                </div>
              </div>
              <div class="p-6">
                <h3 class="font-bold text-lg text-text-primary mb-2 line-clamp-1">{{ project.title }}</h3>
                <p class="text-text-secondary text-sm mb-6 line-clamp-2 min-h-[2.5rem]">{{ project.description }}</p>
                <div class="flex gap-3">
                  <button
                    (click)="editProject(project)"
                    class="flex-1 px-4 py-2 bg-surface-highlight text-text-primary rounded-lg text-sm font-bold hover:bg-opacity-80 transition-colors border border-border"
                  >
                    Edit
                  </button>
                  <button
                    (click)="deleteProject(project.id)"
                    class="px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors border border-transparent hover:border-error/20"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Project Modal -->

      <div
        *ngIf="showProjectModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div
          class="glass-panel bg-surface rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden duration-200 border border-border"
        >
          <div class="p-6 border-b border-border flex justify-between items-center bg-surface-highlight/30">
            <h3 class="text-xl font-bold text-text-primary">
              {{ editingProject ? 'Edit Project' : 'New Project' }}
            </h3>
            <button
              (click)="closeProjectModal()"
              class="text-text-muted hover:text-text-primary transition-colors"
            >
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
          <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            
            <!-- Language Tabs (Same as Plan Modal) -->
            <div class="flex space-x-1 bg-surface-highlight p-1 rounded-lg mb-4 text-xs font-medium w-fit border border-border">
               <button 
                  class="flex-1 px-3 py-1.5 rounded-md transition-all"
                  [class.bg-surface]="activeLang === 'es'"
                  [class.text-primary]="activeLang === 'es'"
                  [class.shadow-sm]="activeLang === 'es'"
                  [class.text-text-muted]="activeLang !== 'es'"
                  (click)="activeLang = 'es'"
               >Español</button>
               <button 
                  class="flex-1 px-3 py-1.5 rounded-md transition-all"
                  [class.bg-surface]="activeLang === 'en'"
                  [class.text-primary]="activeLang === 'en'"
                  [class.shadow-sm]="activeLang === 'en'"
                  [class.text-text-muted]="activeLang !== 'en'"
                  (click)="activeLang = 'en'"
               >English</button>
            </div>

            <!-- Project Fields (Refactored to Theme) -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="col-span-2">
                <label class="block text-sm font-bold text-text-secondary mb-1.5">Associated Plan</label>
                <select [(ngModel)]="projectForm.planId" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary">
                  <option [ngValue]="null">-- No Plan Associated --</option>
                  <option *ngFor="let plan of plans" [ngValue]="plan.id">{{ plan.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-text-secondary mb-1.5">Title</label>
                <input [(ngModel)]="projectForm.title" type="text" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary" />
              </div>
              <div>
                <label class="block text-sm font-bold text-text-secondary mb-1.5">Slug</label>
                <input [(ngModel)]="projectForm.slug" type="text" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary" placeholder="my-project" />
              </div>
            </div>
            
            <!-- ... (Other fields follow same pattern) ... -->
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-text-secondary mb-1.5">Category</label>
                <input [(ngModel)]="projectForm.category" type="text" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary" />
              </div>
               <div>
                <label class="block text-sm font-bold text-text-secondary mb-1.5">Image URL</label>
                <input [(ngModel)]="projectForm.imageUrl" type="text" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-bold text-text-secondary mb-1.5">Project Link (URL)</label>
                <input [(ngModel)]="projectForm.url" type="url" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary" placeholder="https://..." />
              </div>
               <div>
                <label class="block text-sm font-bold text-text-secondary mb-1.5">Client</label>
                <input [(ngModel)]="projectForm.client" type="text" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary" />
              </div>
            </div>

            <div class="mb-4">
               <label class="block text-sm font-bold text-text-secondary mb-1.5">Associated Plan (Optional)</label>
               <select [(ngModel)]="projectForm.planId" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary">
                 <option [ngValue]="null">-- No Plan Selected --</option>
                 <option *ngFor="let plan of plans" [ngValue]="plan.id">{{ plan.name }} ($ {{ plan.setupPrice }})</option>
               </select>
               <p class="text-[10px] text-text-muted mt-1">If selected, this project will appear as an example in the "{{ activeLang === 'es' ? 'Planes' : 'Plans' }}" page detail.</p>
            </div>

             <div>
              <label class="block text-sm font-bold text-text-secondary mb-1.5">Short Description</label>
              <textarea *ngIf="activeLang === 'es'" [(ngModel)]="projectForm.description" rows="2" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary"></textarea>
              <textarea *ngIf="activeLang === 'en'" [(ngModel)]="projectForm.description_en" rows="2" class="w-full px-4 py-2.5 bg-surface-highlight/50 border border-border rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-text-primary"></textarea>
            </div>

          </div>
          <div class="p-6 border-t border-border bg-surface-highlight/30 flex gap-3">
             <button
              (click)="closeProjectModal()"
              class="flex-1 px-4 py-3 bg-surface border border-border text-text-secondary rounded-xl font-bold hover:bg-surface-highlight transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="saveProject()"
              class="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
            >
              Save Project
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [
        `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: var(--color-primary);
      }
    `,
    ],
})
export class ContentComponent implements OnInit {
    projects: any[] = [];
    plans: any[] = [];

    activeLang: 'es' | 'en' = 'es';

    showProjectModal = false;
    editingProject: any = null;
    projectForm = {
        title: '',
        slug: '',
        tagline: '',
        tagline_en: '',
        description: '',
        description_en: '',
        detailedDescription: '',
        detailedDescription_en: '',
        imageUrl: '',
        category: '',
        url: '',
        features: [] as string[],
        technologies: [] as string[],
        client: '',
        completionDate: '',
        testimonial: { text: '', author: '', role: '' },
        gallery: [] as string[],
        planId: null as number | null,
    };
    projectFeaturesText = '';
    projectTechnologiesText = '';
    projectGalleryText = '';

    constructor(private adminService: AdminService) { }

    ngOnInit() {
        this.loadProjects();
        this.loadPlans();
    }

    loadProjects() {
        this.adminService.getProjects().subscribe((res: any) => {
            this.projects = res;
        });
    }

    loadPlans() {
        this.adminService.getPlans().subscribe((res: any) => {
            this.plans = res;
        });
    }

    addItem(list: any[], item: any) { list.push({ ...item }); }
    removeItem(list: any[], index: number) { list.splice(index, 1); }

    openProjectModal() {

        console.log('Opening Project Modal');
        this.editingProject = null;
        this.resetProjectForm();
        this.showProjectModal = true;
    }

    editProject(project: any) {
        this.editingProject = project;
        this.projectForm = { ...project, testimonial: project.testimonial || { text: '', author: '', role: '' } };
        this.projectFeaturesText = project.features.join('\n');
        this.projectTechnologiesText = project.technologies.join('\n');
        const gallery = project.gallery || [];
        this.projectGalleryText = gallery.join('\n');
        this.showProjectModal = true;
    }

    closeProjectModal() { this.showProjectModal = false; }

    resetProjectForm() {
        this.projectForm = {
            title: '', slug: '', tagline: '', tagline_en: '', description: '', description_en: '', detailedDescription: '', detailedDescription_en: '',
            imageUrl: '', category: '', url: '', features: [], technologies: [], client: '', completionDate: '', testimonial: { text: '', author: '', role: '' }, gallery: [], planId: null
        };
        this.projectFeaturesText = '';
        this.projectTechnologiesText = '';
        this.projectGalleryText = '';
    }

    updateProjectFeatures(e: any) { this.projectFeaturesText = e.target.value; this.projectForm.features = this.projectFeaturesText.split('\n').filter(s => s.trim()); }
    updateProjectTechnologies(e: any) { this.projectTechnologiesText = e.target.value; this.projectForm.technologies = this.projectTechnologiesText.split('\n').filter(s => s.trim()); }
    updateProjectGallery(e: any) { this.projectGalleryText = e.target.value; this.projectForm.gallery = this.projectGalleryText.split('\n').filter(s => s.trim()); }

    saveProject() {
        if (this.editingProject) {
            this.adminService.updateContentProject(this.editingProject.id, this.projectForm).subscribe(() => {
                this.loadProjects();
                this.closeProjectModal();
            });
        } else {
            this.adminService.createProject(this.projectForm).subscribe(() => {
                this.loadProjects();
                this.closeProjectModal();
            });
        }
    }

    deleteProject(id: any) {
        if (confirm('Are you sure?')) {
            this.adminService.deleteProject(Number(id)).subscribe(() => this.loadProjects());
        }
    }
}
