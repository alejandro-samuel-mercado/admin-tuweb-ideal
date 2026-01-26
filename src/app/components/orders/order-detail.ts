import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin';
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
              class="p-6 border-b border-border bg-surface-highlight/30 flex justify-between items-center cursor-pointer hover:bg-surface-highlight/50 transition-colors"
              (click)="toggleSection('details')"
            >
              <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
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
                Project Details
              </h2>
              <svg
                class="w-5 h-5 text-text-muted transform transition-transform duration-300"
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
            <div class="p-6 space-y-6" *ngIf="expandedSections['details']">
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <label class="text-xs text-primary uppercase font-bold tracking-wider"
                    >Plan</label
                  >
                  <p class="text-xl font-bold text-text-primary capitalize">{{ order.plan }}</p>
                </div>
                <div class="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                  <label class="text-xs text-secondary uppercase font-bold tracking-wider"
                    >Price</label
                  >
                  <p class="text-xl font-bold text-text-primary">\${{ order.price }}</p>
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
            
            <div class="p-8">
              <div class="relative">
                <!-- Vertical Line -->
                <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-border/50"></div>

                <div class="space-y-8 relative">
                  <div *ngFor="let step of order.timeline?.steps; let i = index" class="flex gap-6 group">
                   
                    <!-- Step Indicator -->
                    <div class="relative z-10 w-16 flex flex-col items-center">
                       <button
                         (click)="toggleStepStatus(i)"
                         class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all border-2"
                         [ngClass]="{
                           'bg-success border-success text-white': step.status === 'completed',
                           'bg-surface border-primary text-primary': step.status === 'current',
                           'bg-surface-highlight border-border text-text-muted': step.status === 'pending'
                         }"
                       >
                          <svg *ngIf="step.status === 'completed'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                          <span *ngIf="step.status !== 'completed'" class="font-bold text-lg">{{ i + 1 }}</span>
                       </button>
                    </div>

                    <!-- Step Content -->
                    <div class="flex-1">
                      <div class="bg-surface-highlight/30 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors group-hover:shadow-md">
                        <div class="flex flex-col md:flex-row gap-4 mb-3">
                          <input
                            [(ngModel)]="step.title"
                            class="flex-1 bg-transparent border-none p-0 font-bold text-text-primary focus:ring-0 text-lg placeholder:text-text-muted"
                            placeholder="Step name"
                          />
                          <div class="flex items-center gap-2">
                             <input
                                type="date"
                                [(ngModel)]="step.date"
                                class="text-sm bg-surface border-border rounded-lg py-1 px-2 focus:ring-primary text-text-primary"
                              />
                              <button (click)="removeTimelineStep(i)" class="text-text-muted hover:text-error p-1">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                          </div>
                        </div>

                        <!-- Step Actions -->
                        <div class="flex gap-2">
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
          </div>
        </div>

        <!-- Right Column: Client & Status -->
        <div class="space-y-8">
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

          <!-- Status Management Card -->
          <div
            class="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div
              class="p-6 border-b border-border bg-surface-highlight/30 flex justify-between items-center cursor-pointer hover:bg-surface-highlight/50 transition-colors"
              (click)="toggleSection('status')"
            >
              <h3 class="text-sm font-bold text-text-muted uppercase tracking-widest">
                Status Management
              </h3>
              <svg
                class="w-5 h-5 text-text-muted transform transition-transform duration-300"
                [class.rotate-180]="expandedSections['status']"
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
            <div class="p-6" *ngIf="expandedSections['status']">
              <div class="space-y-3">
                <button
                  *ngIf="order.status === 'PENDING'"
                  (click)="updateStatus('ACCEPTED')"
                  class="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Accept Order
                </button>
                <button
                  *ngIf="order.status === 'ACCEPTED'"
                  (click)="updateStatus('PAYMENT_PENDING')"
                  class="w-full py-3 bg-warning text-white rounded-xl font-bold hover:bg-warning/90 transition-all shadow-lg shadow-warning/20"
                >
                  Mark Payment Pending
                </button>
                <button
                  *ngIf="order.status === 'PAYMENT_PENDING'"
                  (click)="updateStatus('IN_PROGRESS')"
                  class="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Start Project
                </button>
                <button
                  *ngIf="order.status === 'IN_PROGRESS'"
                  (click)="updateStatus('FINISHED')"
                  class="w-full py-3 bg-success text-white rounded-xl font-bold hover:bg-success/90 transition-all shadow-lg shadow-success/20"
                >
                  Finish Project
                </button>

                <div class="pt-4 border-t border-border">
                  <label
                    class="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block"
                    >Estimated Delivery</label
                  >
                  <div class="flex gap-2">
                    <input
                      type="date"
                      [(ngModel)]="deliveryDate"
                      class="flex-1 bg-surface-highlight/50 border border-border rounded-xl focus:ring-primary focus:border-primary text-sm text-text-primary"
                    />
                    <button
                      (click)="saveDeliveryDate()"
                      class="p-2 bg-surface text-text-secondary rounded-xl hover:bg-surface-highlight border border-border transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
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
                    <p class="text-3xl font-bold">\${{ order.price }}</p>
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
        class="fixed bottom-28 right-8 w-[400px] h-[550px] glass-panel bg-surface rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300"
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadOrder(params['orderId']);
    });
    this.pollingInterval = setInterval(() => {
      if (this.order && this.order.id) {
        this.loadOrder(this.order.id, false);
      }
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  loadOrder(id: string, showLoading = true) {
    if (!id || id === 'undefined' || id === 'null') {
       console.error('Invalid Order ID:', id);
       return;
    }
    this.adminService.getOrder(id).subscribe((order: any) => {
      this.order = order;
      if (order.deliveryDate) {
        this.deliveryDate = new Date(order.deliveryDate).toISOString().split('T')[0];
      }
      if (showLoading || this.shouldAutoScroll) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
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

    if (this.selectedImage) {
      this.adminService
        .uploadOrderImage(this.order.id, this.selectedImage)
        .subscribe((res: any) => {
          this.sendTextMessage(res.imageUrl);
          this.removeSelectedImage();
        });
    } else {
      this.sendTextMessage();
    }
  }

  private sendTextMessage(imageUrl?: string) {
    const content = this.newMessage; 
    
    this.adminService
      .sendMessage(this.order.id, content, imageUrl)
      .subscribe(() => {
        this.newMessage = '';
        this.loadOrder(this.order.id);
      });
  }
}
