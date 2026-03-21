import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin';
import { environment } from '../../../environments/environment';

export const dynamic = 'force-dynamic';

export const revalidate = 0;

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="order" class="max-w-6xl mx-auto pb-20">
      <!-- Header Section -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <a routerLink="/orders" class="p-2 hover:bg-surface-highlight rounded-full transition-colors text-text-secondary">
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </a>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold font-display text-text-primary">Order #{{ order.id }}</h1>
              <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                [ngClass]="{
                  'bg-warning/10 text-warning border-warning/20': order.status === 'PENDING',
                  'bg-blue-500/10 text-blue-500 border-blue-500/20': order.status === 'ACCEPTED',
                  'bg-orange-500/10 text-orange-500 border-orange-500/20': order.status === 'PAYMENT_PENDING',
                  'bg-purple-500/10 text-purple-500 border-purple-500/20': order.status === 'IN_PROGRESS',
                  'bg-success/10 text-success border-success/20': order.status === 'FINISHED'
                }"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <p class="text-text-muted text-sm mt-1">
              Created on {{ order.createdAt | date : 'longDate' }}
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            (click)="loadOrder(order.id)"
            class="p-2.5 bg-surface rounded-xl shadow-sm border border-border hover:bg-surface-highlight transition-all text-text-secondary"
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
          <button
            (click)="deleteOrder()"
            class="px-4 py-2 bg-error/10 text-error rounded-xl text-sm font-semibold hover:bg-error/20 transition-all flex items-center gap-2 border border-transparent hover:border-error/30"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Project Details & Timeline -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Requirements Card -->
          <div
            class="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div
              class="p-6 border-b border-border bg-surface-highlight/30 flex justify-between items-center cursor-pointer transition-colors"
            >
              <div class="flex items-center gap-2" (click)="toggleSection('details')">
                  <svg
                    class="w-5 h-5 text-primary"
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
                  <h2 class="text-lg font-bold text-text-primary">Project Details</h2>
              </div>
              <div class="flex items-center gap-3">
                 <button *ngIf="expandedSections['details'] && !isEditingDetails" (click)="startEditDetails($event)" class="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">Edit</button>
                 <button *ngIf="expandedSections['details'] && isEditingDetails" (click)="saveOrderDetails($event)" class="text-xs font-bold text-white bg-success px-3 py-1.5 rounded-lg hover:bg-success/90 transition-colors shadow-md">Save</button>
                 <button *ngIf="expandedSections['details'] && isEditingDetails" (click)="cancelEditDetails($event)" class="text-xs font-bold text-text-secondary bg-surface border border-border px-3 py-1.5 rounded-lg hover:bg-surface-highlight transition-colors">Cancel</button>

                 <svg
                    (click)="toggleSection('details')"
                    class="w-5 h-5 text-text-muted transform transition-transform duration-300 ml-2"
                    [class.rotate-180]="expandedSections['details']"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
              </div>
            </div>
            <div class="p-6 space-y-6" *ngIf="expandedSections['details']">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col justify-center">
                  <label class="text-xs text-primary uppercase font-bold tracking-wider"
                    >Plan</label
                  >
                  <p *ngIf="!isEditingDetails" class="text-xl font-bold text-text-primary capitalize">{{ order.plan }}</p>
                  <input *ngIf="isEditingDetails" [(ngModel)]="editForm.plan" class="w-full mt-1 px-3 py-2 bg-surface text-text-primary border border-primary/30 rounded-lg focus:outline-none" />
                </div>
                <div class="p-4 bg-secondary/10 rounded-xl border border-secondary/20 flex flex-col justify-center">
                  <label class="text-xs text-secondary uppercase font-bold tracking-wider"
                    >Price</label
                  >
                  <p *ngIf="!isEditingDetails" class="text-xl font-bold text-text-primary"><span *ngIf="order.price !== null && order.price !== undefined">$</span>{{ order.price !== null && order.price !== undefined ? order.price : 'N/A' }}</p>
                  <div *ngIf="isEditingDetails" class="flex items-center mt-1">
                      <span class="text-text-primary font-bold mr-2">$</span>
                      <input type="number" [(ngModel)]="editForm.price" class="w-full px-3 py-2 bg-surface text-text-primary border border-secondary/30 rounded-lg focus:outline-none" />
                  </div>
                </div>
                <div class="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 flex flex-col justify-center">
                  <label class="text-xs text-purple-500 uppercase font-bold tracking-wider"
                    >Delivery Date</label
                  >
                  <p *ngIf="!isEditingDetails" class="text-lg font-bold text-text-primary">
                      {{ order.deliveryDate ? (order.deliveryDate | date : 'mediumDate') : 'Not Set' }}
                  </p>
                  <input *ngIf="isEditingDetails" type="date" [(ngModel)]="editForm.deliveryDate" class="w-full mt-1 px-3 py-2 bg-surface text-text-primary border border-purple-500/30 rounded-lg focus:outline-none text-sm" />
                </div>
              </div>

              <!-- Requirements Section -->
              <div>
                <h3 class="text-sm font-bold text-text-secondary mb-4 flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-primary"
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
                  Client Requirements
                </h3>
                <div class="space-y-3">
                  <div *ngFor="let item of getRequirementsList(order.requirements)" 
                       class="bg-surface-highlight/30 p-3 rounded-lg border border-border">
                    <label class="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">
                      {{ item.label }}
                    </label>
                    <p class="text-text-primary whitespace-pre-wrap">{{ item.value }}</p>
                  </div>
                </div>
              </div>

              <!-- Reference Images -->
              <div *ngIf="order.referenceImages && order.referenceImages.length > 0">
                <h3 class="text-sm font-bold text-text-secondary mb-3 flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Reference Images
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div *ngFor="let imageUrl of order.referenceImages" class="relative group">
                    <img
                      [src]="getApiUrl(imageUrl)"
                      alt="Reference"
                      class="w-full h-32 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                      (click)="openImage(getApiUrl(imageUrl))"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stepper Timeline -->
          <div class="glass-panel rounded-2xl overflow-hidden shadow-lg shadow-black/5">
            <div class="p-6 border-b border-border bg-surface-highlight/30 flex justify-between items-center text-text-primary">
              <h2 class="text-lg font-bold">Progress Tracking</h2>
              <button
                (click)="addTimelineStep()"
                class="px-4 py-2 bg-surface border border-border text-text-secondary rounded-lg text-sm font-bold hover:bg-surface-highlight transition-all"
              >
                + Step
              </button>
            </div>
            
            <div class="p-4 md:p-8">
              <div class="relative">
                <!-- Vertical Line -->
                <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-border/50 hidden md:block"></div>
                <!-- Show line on mobile but maybe center it differently? Or hide? Let's keep it but adjust if needed.
                     Actually, indicator is w-16, centered at 32px. left-8 is 32px. It aligns.
                -->
                 <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-border/50 md:hidden"></div> 
                 <!-- Mobile line at left-6 (24px) for w-12 (48px) indicator centered? -->

                <div class="space-y-8 relative">
                  <div *ngFor="let step of order.timeline?.steps; let i = index" class="flex gap-4 md:gap-6 group">
                   
                    <!-- Step Indicator -->
                    <div class="relative z-10 w-12 md:w-16 flex flex-col items-center shrink-0">
                       <button
                         (click)="toggleStepStatus(i)"
                         class="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm transition-all border-2 text-sm md:text-lg"
                         [ngClass]="{
                           'bg-success border-success text-white': step.status === 'completed',
                           'bg-surface border-primary text-primary': step.status === 'current',
                           'bg-surface-highlight border-border text-text-muted': step.status === 'pending'
                         }"
                       >
                          <svg *ngIf="step.status === 'completed'" class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                          <span *ngIf="step.status !== 'completed'" class="font-bold">{{ i + 1 }}</span>
                       </button>
                    </div>

                    <!-- Step Content -->
                    <div class="flex-1">
                      <div class="bg-surface-highlight/30 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors group-hover:shadow-md">
                        <div class="flex flex-col md:flex-row gap-4 mb-3">
                          <input
                            [(ngModel)]="step.title"
                            class="flex-1 bg-transparent border-none p-0 font-bold text-text-primary focus:ring-0 text-lg placeholder:text-text-muted w-full"
                            placeholder="Step name"
                          />
                        
                        </div>

                        <!-- Step Actions -->
                        <div class="flex gap-2 flex-wrap">
                            <button 
                                (click)="setStepStatus(i, 'pending')"
                                class="px-3 py-1 rounded-lg text-xs font-bold transition-colors border"
                                [ngClass]="step.status === 'pending' ? 'bg-surface-highlight text-text-secondary border-border' : 'bg-transparent border-transparent text-text-muted hover:bg-surface-highlight'"
                            >
                                Pending
                            </button>
                            <button 
                                (click)="setStepStatus(i, 'current')"
                                class="px-3 py-1 rounded-lg text-xs font-bold transition-colors border"
                                [ngClass]="step.status === 'current' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-transparent border-transparent text-text-muted hover:bg-surface-highlight'"
                            >
                                In Progress
                            </button>
                            <button 
                                (click)="setStepStatus(i, 'completed')"
                                class="px-3 py-1 rounded-lg text-xs font-bold transition-colors border"
                                [ngClass]="step.status === 'completed' ? 'bg-success/20 text-success border-success/30' : 'bg-transparent border-transparent text-text-muted hover:bg-surface-highlight'"
                            >
                                Completed
                            </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            
             <div class="p-4 bg-surface-highlight/50 border-t border-border flex justify-end">
                <button
                (click)="saveTimeline()"
                class="px-6 py-2 bg-text-primary text-surface rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
             </div>
            <!-- Publish to Portfolio Card -->
            <div *ngIf="order.status === 'FINISHED'" class="glass-panel rounded-2xl overflow-hidden shadow-xl border border-success/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="p-6 border-b border-success/20 bg-success/5 flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-success/10 rounded-lg text-success">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                  <h2 class="text-lg font-black text-text-primary tracking-tight uppercase">Publish to Showcase</h2>
                </div>
                <span class="px-3 py-1 bg-success/10 text-success text-[10px] font-black rounded-full border border-success/20 tracking-widest uppercase">Action Required</span>
              </div>
              <div class="p-8 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Project Title</label>
                    <input [(ngModel)]="portfolioForm.title" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-xl focus:ring-4 focus:ring-success/10 focus:border-success transition-all outline-none text-text-primary font-bold" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Category</label>
                    <input [(ngModel)]="portfolioForm.category" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-xl focus:ring-4 focus:ring-success/10 focus:border-success transition-all outline-none text-text-primary font-bold" placeholder="e.g. E-Commerce, Corporate..." />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showcase Description</label>
                  <textarea [(ngModel)]="portfolioForm.description" rows="4" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-xl focus:ring-4 focus:ring-success/10 transition-all outline-none text-text-primary text-sm leading-relaxed" placeholder="Write a compelling description for the gallery..."></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Main Image URL</label>
                    <input [(ngModel)]="portfolioForm.imageUrl" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-xl outline-none text-text-primary text-sm" placeholder="https://..." />
                  </div>
                   <div class="space-y-2">
                    <label class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Live Website URL</label>
                    <input [(ngModel)]="portfolioForm.url" class="w-full px-5 py-3 bg-surface-highlight/50 border border-border rounded-xl outline-none text-text-primary text-sm" placeholder="https://..." />
                  </div>
                </div>

                <div class="p-6 bg-surface-highlight/20 rounded-2xl border border-dashed border-border text-center">
                  <button (click)="publishProject()" [disabled]="!portfolioForm.title || !portfolioForm.description" class="px-8 py-4 bg-success text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-success/90 transition-all shadow-xl shadow-success/20 disabled:opacity-50">
                    Create Portal Entry & Feature Project
                  </button>
                  <p class="text-[10px] text-text-muted mt-4 uppercase font-bold tracking-widest">This will add the project to the public gallery section</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Right Column: Client & Status -->
        <div class="space-y-8">
          <!-- Status Actions Card -->
          <div class="glass-panel rounded-2xl overflow-hidden border border-border bg-surface shadow-lg">
            <div class="p-6 border-b border-border bg-surface-highlight/30">
              <h3 class="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Management Actions</h3>
            </div>
            <div class="p-6 space-y-4">
              <!-- Pending State -->
              <div *ngIf="order.status === 'PENDING'" class="space-y-3">
                <button (click)="updateStatus('ACCEPTED')" class="w-full py-3 bg-success text-white rounded-xl font-bold hover:bg-success/90 transition-all shadow-lg shadow-success/20 flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Accept & Review
                </button>
                <button (click)="updateStatus('REJECTED')" class="w-full py-3 bg-error/10 text-error rounded-xl font-bold hover:bg-error/20 transition-all flex items-center justify-center gap-2">
                  Reject Order
                </button>
              </div>

              <!-- Accepted State -->
              <div *ngIf="order.status === 'ACCEPTED'" class="space-y-3">
                <div class="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-4">
                  <p class="text-xs text-blue-500 font-bold leading-tight">Order accepted. Please review details with the client before requesting payment.</p>
                </div>
                <button (click)="updateStatus('PAYMENT_PENDING')" class="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                  Request Payment
                </button>
              </div>

              <!-- Payment Pending State -->
              <div *ngIf="order.status === 'PAYMENT_PENDING'" class="space-y-3">
                <div class="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 mb-4 text-center">
                  <p class="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1">Waiting for payment</p>
                  <p class="text-xs text-text-secondary">Client has been notified. You can start once payment is confirmed.</p>
                </div>
                <button (click)="updateStatus('IN_PROGRESS')" class="w-full py-4 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                   Start Project
                </button>
              </div>

              <!-- In Progress State -->
              <div *ngIf="order.status === 'IN_PROGRESS'" class="space-y-3">
                <div class="flex items-center gap-2 mb-4">
                  <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                  <span class="text-xs font-bold text-purple-500 uppercase tracking-widest">Project in development</span>
                </div>
                <button (click)="updateStatus('FINISHED')" class="w-full py-4 bg-success text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-success/90 transition-all shadow-xl shadow-success/30 flex items-center justify-center gap-2">
                   Mark as Finished
                </button>
              </div>

              <!-- Finished State -->
              <div *ngIf="order.status === 'FINISHED'" class="space-y-4">
                <div class="p-4 bg-success/10 rounded-2xl border border-success/20 text-center">
                  <svg class="w-12 h-12 text-success mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                  <p class="text-sm font-black text-success uppercase tracking-widest">Project Completed</p>
                  <p class="text-xs text-text-secondary mt-1">Fill in the final project details to deliver to the client.</p>
                </div>

                <!-- Project Delivery Form -->
                <div class="p-5 bg-surface-highlight/30 rounded-2xl border border-border">
                  <h4 class="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Delivery Details</h4>
                  <form (submit)="deliverProject($event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-xs text-text-muted mb-1 font-medium">Project Name</label>
                          <input type="text" [(ngModel)]="projectForm.name" name="projectName" class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label class="block text-xs text-text-muted mb-1 font-medium">Live URL</label>
                          <input type="url" [(ngModel)]="projectForm.url" name="projectUrl" class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label class="block text-xs text-text-muted mb-1 font-medium">Admin Panel URL</label>
                          <input type="url" [(ngModel)]="projectForm.adminPanelUrl" name="adminPanelUrl" class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label class="block text-xs text-text-muted mb-1 font-medium">Documentation URL</label>
                          <input type="url" [(ngModel)]="projectForm.documentationUrl" name="docUrl" class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label class="block text-xs text-text-muted mb-1 font-medium">Admin Username</label>
                          <input type="text" [(ngModel)]="projectForm.adminUsername" name="adminUser" class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label class="block text-xs text-text-muted mb-1 font-medium">Admin Password</label>
                          <input type="text" [(ngModel)]="projectForm.adminPassword" name="adminPass" class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                    <div>
                      <label class="block text-xs text-text-muted mb-1 font-medium">Short Description / Delivery Note</label>
                      <textarea [(ngModel)]="projectForm.description" name="projectDesc" class="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary h-20 focus:outline-none focus:border-primary"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-success text-white rounded-xl font-bold hover:bg-success/90 transition-all shadow-md">
                      Save Delivery Options
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Card -->
          <div
            class="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div
              class="p-6 border-b border-border bg-surface-highlight/30 flex justify-between items-center cursor-pointer hover:bg-surface-highlight/50 transition-colors"
              (click)="toggleSection('client')"
            >
              <h3 class="text-sm font-bold text-text-muted uppercase tracking-widest">Client</h3>
              <svg
                class="w-5 h-5 text-text-muted transform transition-transform duration-300"
                [class.rotate-180]="expandedSections['client']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div class="p-6" *ngIf="expandedSections['client']">
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20"
                >
                  {{ order.user?.name?.charAt(0) || '?' }}
                </div>
                <div>
                  <p class="text-lg font-bold text-text-primary">{{ order.user?.name || 'Unknown User' }}</p>
                  <p class="text-sm text-text-secondary">{{ order.user?.email || 'No email' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Details Card -->
          <div
            class="bg-gradient-to-br from-text-primary to-text-secondary rounded-2xl shadow-xl overflow-hidden transition-all duration-300"
          >
            <div
              class="p-6 flex justify-between items-center cursor-pointer hover:opacity-90"
              (click)="toggleSection('payment')"
            >
              <h3 class="text-xs font-bold text-surface/70 uppercase tracking-widest">
                Payment Summary
              </h3>
              <svg
                class="w-5 h-5 text-surface/70 transform transition-transform duration-300"
                [class.rotate-180]="expandedSections['payment']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div class="p-6 pt-0 text-white" *ngIf="expandedSections['payment']">
              <div class="space-y-4">
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-surface/70 text-xs mb-1">Total</p>
                    <p class="text-3xl font-bold">$ {{ order.price }}</p>
                  </div>
                  <div *ngIf="order.discountCode" class="text-right">
                    <p class="text-surface/70 text-xs mb-1">Coupon</p>
                    <span
                      class="bg-white/20 text-white px-2 py-1 rounded-lg text-xs font-bold border border-white/30"
                    >
                      {{ order.discountCode }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Floating Chat Button -->
      <button
        (click)="toggleChat()"
        class="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center hover:bg-primary/90 hover:scale-110 transition-all z-50 group border border-primary/50"
      >
        <svg
          *ngIf="!isChatOpen"
          class="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <svg
          *ngIf="isChatOpen"
          class="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span
          *ngIf="!isChatOpen"
          class="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full border-2 border-surface animate-pulse"
        ></span>
      </button>

      <!-- Floating Chat Window -->
      <div
        *ngIf="isChatOpen"
        class="fixed inset-x-4 bottom-28 md:inset-auto md:right-8 md:w-[400px] h-[550px] glass-panel bg-surface rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300 max-h-[70vh] md:max-h-none"
      >
        <div class="p-5 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold"
            >
              {{ order.user?.name?.charAt(0) || '?' }}
            </div>
            <div>
              <h3 class="font-bold">Chat with {{ order.user?.name || 'User' }}</h3>
              <p class="text-xs opacity-75">Online now</p>
            </div>
          </div>
        </div>

        <div
          #chatContainer
          (scroll)="handleScroll()"
          class="flex-1 overflow-y-auto p-5 space-y-4 bg-surface-highlight/30 custom-scrollbar"
        >
          <div
            *ngFor="let msg of order.messages"
            class="flex flex-col"
            [ngClass]="{
              'items-end': msg.sender.role === 'ADMIN',
              'items-start': msg.sender.role !== 'ADMIN'
            }"
          >
            <div
              class="max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm"
              [ngClass]="{
                'bg-primary text-primary-foreground rounded-br-none': msg.sender.role === 'ADMIN',
                'bg-surface border border-border text-text-primary rounded-bl-none':
                  msg.sender.role !== 'ADMIN'
              }"
            >
              <img
                *ngIf="msg.imageUrl"
                [src]="getApiUrl(msg.imageUrl)"
                alt="Uploaded content"
                class="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                (click)="openImage(getApiUrl(msg.imageUrl))"
              />
              <p *ngIf="msg.content">{{ msg.content }}</p>
            </div>
            <span class="text-[10px] text-text-muted mt-1.5 px-1 font-medium">
              {{ msg.createdAt | date : 'shortTime' }}
            </span>
          </div>
          <div #messagesEnd></div>
        </div>

        <form (submit)="sendMessage($event)" class="p-4 bg-surface border-t border-border">
          <div *ngIf="imagePreview" class="mb-4 relative inline-block">
            <img
              [src]="imagePreview"
              alt="Preview"
              class="w-20 h-20 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              (click)="removeSelectedImage()"
              class="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="flex gap-2">
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              accept="image/*"
              class="hidden"
            />
            <button
              type="button"
              (click)="fileInput.click()"
              class="w-12 h-12 bg-surface-highlight text-text-secondary rounded-2xl flex items-center justify-center hover:bg-surface-highlight/80 transition-all border border-border"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <input
              type="text"
              [(ngModel)]="newMessage"
              name="newMessage"
              placeholder="Type a message..."
              class="flex-1 px-4 py-3 bg-surface-highlight/50 border border-border rounded-2xl text-sm focus:outline-none focus:border-primary transition-all text-text-primary placeholder:text-text-muted"
            />
            <button
              type="submit"
              [disabled]="!newMessage.trim() && !selectedImage"
              class="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: var(--color-text-muted);
      }
    `,
  ],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  order: any;
  deliveryDate: string = '';
  newMessage: string = '';
  isChatOpen: boolean = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  private pollingInterval: any;
  private shouldAutoScroll: boolean = true;

  expandedSections: { [key: string]: boolean } = {
    details: true,
    timeline: true,
    client: true,
    status: true,
    payment: true,
  };

  isEditingDetails: boolean = false;
  editForm: { plan: string; price: number | null; deliveryDate: string } = { plan: '', price: null, deliveryDate: '' };

  projectForm: any = {
    name: '', url: '', adminPanelUrl: '', adminUsername: '', adminPassword: '', documentationUrl: '', description: ''
  };

  portfolioForm: any = {
    title: '',
    slug: '',
    tagline: '',
    description: '',
    detailedDescription: '',
    imageUrl: '',
    category: '',
    url: '',
    features: [],
    technologies: [],
    client: '',
    completionDate: '',
    testimonial: { text: '', author: '', role: '' },
    gallery: [],
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
    const id = params.get('id');

    if (!id) {
      return; 
    }

    this.loadOrder(id);
  });

  this.pollingInterval = setInterval(() => {
    if (this.order?.id) {
      this.loadOrder(this.order.id, false);
    }
  }, 5000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  loadOrder(id: string, showLoader = true) {
  this.adminService.getOrder(id).subscribe({
    next: (res: any) => {
      this.order = res.order; 
      if (this.order.status === 'FINISHED' && !this.portfolioForm.title) {
        this.portfolioForm.title = this.order.requirements?.businessName || `Project #${this.order.id}`;
        this.portfolioForm.description = this.order.requirements?.description || '';
        this.portfolioForm.client = this.order.user?.name || '';
        this.portfolioForm.completionDate = new Date().toISOString().split('T')[0];
        this.portfolioForm.slug = this.portfolioForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      }

      if (this.order.project) {
        this.projectForm = { ...this.order.project };
      }
    },
    error: (err) => {
      console.error(err);
    },
  });
}


  getApiUrl(path: string): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `\${environment.apiUrl.replace('/api', '')}\${path}`;
  }
  
  openImage(url: string) {
      window.open(url, '_blank');
  }

  getRequirementsList(reqs: any): { label: string; value: any }[] {
    if (!reqs) return [];
    const mapping: {[key: string]: string} = {
      businessName: 'Business Name',
      industry: 'Industry',
      targetAudience: 'Target Audience',
      description: 'Description',
      designPreferences: 'Visual Style',
      colors: 'Brand Colors',
      referenceSites: 'Reference Sites',
      pages: 'Pages Needed',
      functionalities: 'Functionalities',
      contentReady: 'Content Status'
    };
    
    return Object.keys(reqs)
      .filter(key => reqs[key] && mapping[key])
      .map(key => ({ label: mapping[key], value: reqs[key] }));
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDING: 'Pending',
      ACCEPTED: 'Accepted',
      PAYMENT_PENDING: 'Payment Pending',
      IN_PROGRESS: 'In Progress',
      FINISHED: 'Finished',
    };
    return labels[status] || status;
  }

  updateStatus(status: string) {
    this.adminService.updateOrderStatus(this.order.id, status).subscribe(() => {
      this.loadOrder(this.order.id);
    });
  }

  saveDeliveryDate() {
    if (!this.deliveryDate) return;
    this.adminService
      .updateOrderDeliveryDate(this.order.id, new Date(this.deliveryDate))
      .subscribe(() => {
        alert('Fecha de entrega actualizada');
      });
  }

  deleteOrder() {
    if (confirm('Are you sure you want to delete this order?')) {
      this.adminService.deleteOrder(this.order.id).subscribe(() => {
        this.router.navigate(['/orders']);
      });
    }
  }

  startEditDetails(event: Event) {
    event.stopPropagation();
    this.isEditingDetails = true;
    this.editForm = {
      plan: this.order.plan || '',
      price: this.order.price !== undefined ? this.order.price : null,
      deliveryDate: this.order.deliveryDate ? new Date(this.order.deliveryDate).toISOString().split('T')[0] : ''
    };
  }

  cancelEditDetails(event: Event) {
    event.stopPropagation();
    this.isEditingDetails = false;
  }

  saveOrderDetails(event: Event) {
    event.stopPropagation();
    this.adminService.updateOrder(this.order.id, this.editForm).subscribe({
      next: () => {
        this.isEditingDetails = false;
        this.loadOrder(this.order.id);
      },
      error: (err) => alert('Error saving order details: ' + err.message)
    });
  }

  addTimelineStep() {
    if (!this.order.timeline) {
      this.order.timeline = { steps: [] };
    }
    this.order.timeline.steps.push({
      title: 'New Step',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    });
  }

  removeTimelineStep(index: number) {
      this.order.timeline.steps.splice(index, 1);
  }

  setStepStatus(index: number, status: 'pending' | 'current' | 'completed') {
    this.order.timeline.steps[index].status = status;
  }

  toggleStepStatus(index: number) {
      const statuses: ('pending' | 'current' | 'completed')[] = ['pending', 'current', 'completed'];
      const currentStatus = this.order.timeline.steps[index].status;
      const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
      this.order.timeline.steps[index].status = statuses[nextIndex];
  }

  saveTimeline() {
    this.adminService
      .updateOrderTimeline(this.order.id, this.order.timeline)
      .subscribe(() => {
        alert('Timeline updated');
      });
  }

  deliverProject(event: Event) {
    event.preventDefault();
    this.adminService.updateProject(this.order.id, this.projectForm).subscribe({
      next: () => {
        alert('Project delivery details saved successfully!');
        this.loadOrder(this.order.id);
      },
      error: (err) => alert('Error saving project delivery: ' + err.message)
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  handleScroll() {
    const container = this.chatContainer.nativeElement;
    const atBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    this.shouldAutoScroll = atBottom;
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedImage() {
    this.selectedImage = null;
    this.imagePreview = null;
  }
sendMessage(event: Event) {
  event.preventDefault();

  if (!this.newMessage.trim() && !this.selectedImage) return;

  this.adminService
    .sendMessage(this.order.id, this.newMessage, this.selectedImage || undefined)
    .subscribe({
      next: () => {
        this.newMessage = '';
        this.removeSelectedImage();
        this.loadOrder(this.order.id);
      },
      error: (err) => console.error(err),
    });
}

  publishProject() {
    this.adminService.createExampleProject(this.portfolioForm).subscribe({
      next: () => {
        alert('Project successfully published to showcase!');
        this.router.navigate(['/content']);
      },
      error: (err) => alert('Error publishing project: ' + err.message),
    });
  }
}


