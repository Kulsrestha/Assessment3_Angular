/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { IncidentService } from '../../../service/incident.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  incidents: any = [];
  users: any[] = [];
  constructor(
    private incidentService: IncidentService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAllIncidents();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  getUsername(userId: string): string {
    const user = this.users.find((user) => user.id == userId);
    return user ? user.username : 'Unassigned';
  }

  loadAllIncidents(): void {
    this.incidentService.getAllIncidents().subscribe((incidents) => {
      this.incidents = incidents;
    });
  }

  deleteIncident(incidentId: string): void {
    this.incidentService
      .deleteIncident(incidentId)
      .then(() => {
        console.log(`Incident ${incidentId} deleted successfully`);
        this.loadAllIncidents();
      })
      .catch((error) => {
        console.error('Error deleting incident:', error);
      });
  }
}
