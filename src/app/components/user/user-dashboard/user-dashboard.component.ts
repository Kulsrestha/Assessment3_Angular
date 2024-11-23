/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { IncidentService } from '../../../service/incident.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  incidents: any[] = [];
  currentUserId = '';

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUserIncidents();
      }
    });
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  loadUserIncidents(): void {
    this.incidentService.getIncidentsAssignedToUser(this.currentUserId).subscribe((incidents) => {
      this.incidents = incidents;
    });
  }

  updateStatus(incidentId: string, status: string): void {
    this.incidentService
      .updateIncidentStatus(incidentId, status)
      .then(() => {
        console.log(`Incident ${incidentId} status updated to ${status}`);
        this.loadUserIncidents();
      })
      .catch((error) => {
        console.error('Error updating incident status:', error);
      });
  }
}
