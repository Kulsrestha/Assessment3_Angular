import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { IncidentService } from '../../../service/incident.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  incidents: any[] = [];

  constructor(
    private incidentService: IncidentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAllIncidents();
  }

  loadAllIncidents(): void {
    this.incidentService.getAllIncidents().subscribe((incidents) => {
      this.incidents = incidents;
    });
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
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
