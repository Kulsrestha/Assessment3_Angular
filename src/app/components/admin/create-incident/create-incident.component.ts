import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../service/incident.service';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-create-incident',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './create-incident.component.html',
  styleUrl: './create-incident.component.css'
})
export class CreateIncidentComponent {
  incidentTitle: string = ''; 
  incidentDescription: string = '';
  incidents: any[] = []; 

  constructor(
    private incidentService: IncidentService,
    private router: Router
  ) {}

 
  onSubmit(): void {
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
        this.loadIncidents();
      })
      .catch((error) => {
        console.error('Error creating incident:', error);
      });
  }


  loadIncidents(): void {
    this.incidentService.getAllIncidents().subscribe((incidents) => {
      this.incidents = incidents;
    });
  }


  onIncidentClick(incidentId: string): void {
    this.router.navigate(['/assign-incident', incidentId]);
  }


  ngOnInit(): void {
    this.loadIncidents();
  }
}