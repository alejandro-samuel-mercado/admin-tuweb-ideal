import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private contentUrl = `${environment.apiUrl}/content`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  getUsers(search?: string): Observable<any> {
    let params: any = {};
    if (search) params.search = search;
    return this.http.get(`${this.apiUrl}/users`, { params, withCredentials: true });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { withCredentials: true });
  }

  getOrders(filters?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, { params: filters, withCredentials: true });
  }

  getOrder(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${id}`, { withCredentials: true });
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${id}`, { withCredentials: true });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`, { withCredentials: true });
  }

  updateOrder(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}`, data, { withCredentials: true });
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}/status`, { status }, { withCredentials: true });
  }

  updateOrderDeliveryDate(id: number, date: Date): Observable<any> {
      return this.http.put(`${this.apiUrl}/orders/${id}/delivery-date`, { deliveryDate: date }, { withCredentials: true });
  }
  
  updateOrderTimeline(id: number, timeline: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/orders/${id}/timeline`, { timeline }, { withCredentials: true });
  }

  updateProject(orderId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${orderId}`, data, { withCredentials: true });
  }


  getPlans(): Observable<any> {
    return this.http.get(`${this.contentUrl}/plans`, { withCredentials: true });
  }

  createPlan(data: any): Observable<any> {
    return this.http.post(`${this.contentUrl}/plans`, data, { withCredentials: true });
  }

  updatePlan(id: number, data: any): Observable<any> {
    return this.http.put(`${this.contentUrl}/plans/${id}`, data, { withCredentials: true });
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.contentUrl}/plans/${id}`, { withCredentials: true });
  }

  getProjects(): Observable<any> { 
     return this.http.get(`${this.contentUrl}/projects`, { withCredentials: true });
  }

  createProject(data: any): Observable<any> {
      return this.http.post(`${this.contentUrl}/projects`, data, { withCredentials: true });
  }

  updateContentProject(id: number, data: any): Observable<any> {
      return this.http.put(`${this.contentUrl}/projects/${id}`, data, { withCredentials: true });
  }

  deleteProject(id: number): Observable<any> {
      return this.http.delete(`${this.contentUrl}/projects/${id}`, { withCredentials: true });
  }


  getExampleProjects(): Observable<any> {
    return this.http.get(`${this.contentUrl}/example-projects`, { withCredentials: true });
  }

  createExampleProject(data: any): Observable<any> {
    return this.http.post(`${this.contentUrl}/example-projects`, data, { withCredentials: true });
  }

  updateExampleProject(id: number, data: any): Observable<any> {
    return this.http.put(`${this.contentUrl}/example-projects/${id}`, data, {
      withCredentials: true,
    });
  }

  deleteExampleProject(id: number): Observable<any> {
    return this.http.delete(`${this.contentUrl}/example-projects/${id}`, { withCredentials: true });
  }

 sendMessage(orderId: number, content: string, imageUrl?: string) {
  return this.http.post(
    `${environment.apiUrl}/orders/${orderId}/messages`,
    { content, imageUrl },
    { withCredentials: true }
  );
}
  uploadOrderImage(orderId: number, file: File): Observable<any> {
      const formData = new FormData();
      formData.append('image', file);
      return this.http.post(`${environment.apiUrl}/orders/${orderId}/upload-image`, formData, { withCredentials: true });
  }
}
