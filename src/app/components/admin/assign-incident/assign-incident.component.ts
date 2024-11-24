/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../../service/incident.service';
import { UserService } from '../../../service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-incident',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './assign-incident.component.html',
  styleUrl: './assign-incident.component.css',
})
export class AssignIncidentComponent implements OnInit {
  incidentId = '';
  incidentTitle = '';
  incidentDescription = '';
  incidentStatus = '';
  users: any[] = [];
  selectedUser = '';

  constructor(
    private incidentService: IncidentService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.incidentId = params.get('id') || '';
      if (this.incidentId) {
        this.loadIncident();
        this.loadUsers();
      }
    });
  }

  loadIncident(): void {
    this.incidentService.getIncidentById(this.incidentId).subscribe((incident) => {
      this.incidentTitle = incident.title;
      this.incidentDescription = incident.description;
      this.incidentStatus = incident.status;
      this.selectedUser = incident.assignedTo || '';
    });
  }

  loadUsers(): void {
    console.log('Loading users...');
    this.userService.getUsers().subscribe((users) => {
      console.log('Fetched users:', users);
      if (users && users.length > 0) {
        // this.users = users;
        this.users = users.filter((user) => !user.isAdmin);
      } else {
        console.error('No users available.');
      }
    });
  }

  onAssignIncident(): void {
    if (this.selectedUser) {
      const updatedIncident = {
        title: this.incidentTitle,
        description: this.incidentDescription,
        status: this.incidentStatus,
        assignedTo: this.selectedUser,
      };

      this.incidentService
        .updateIncident(this.incidentId, updatedIncident)
        .then(() => {
          alert('Incident successfully assigned!');
          this.router.navigate(['/create-incident']);
        })
        .catch((error: any) => {
          console.error('Error assigning incident:', error);
        });
    } else {
      alert('Please select a user to assign the incident.');
    }
  }
}
