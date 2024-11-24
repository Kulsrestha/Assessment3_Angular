/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../service/incident.service';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-create-incident',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-incident.component.html',
  styleUrl: './create-incident.component.css',
})
export class CreateIncidentComponent implements OnInit {
  incidentTitle = '';
  incidentDescription = '';
  incidents: any[] = [];
  users: any[] = [];

  constructor(
    private incidentService: IncidentService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  loadIncidents(): void {
    this.incidentService.getAllIncidents().subscribe((incidents) => {
      this.incidents = incidents;
    });
  }

  getUsername(userId: string): string {
    const user = this.users.find((user) => user.id === userId);
    return user ? user.username : 'Unassigned';
  }

  onSubmit(incidentForm: any): void {
    const incidentData = {
      title: this.incidentTitle,
      description: this.incidentDescription,
      status: 'Open',
      createdAt: new Date(),
      assignedTo: null,
    };

    this.incidentService
      .createIncident(incidentData)
      .then(() => {
        alert('Incident created successfully!');
        this.incidentTitle = '';
        this.incidentDescription = '';
        incidentForm.resetForm();
        this.loadIncidents();
      })
      .catch((error) => {
        console.error('Error creating incident:', error);
      });
  }

  onIncidentClick(incidentId: string): void {
    this.router.navigate(['/assign-incident', incidentId]);
  }

  goToDashboard() {
    this.router.navigate(['/admin-dashboard']);
  }
}
