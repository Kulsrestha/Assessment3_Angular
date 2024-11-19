import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// interface Incident {
//   id?: string;
//   title: string;
//   description: string;
//   status: string;
//   createdAt: Date;
//   assignedTo?: {
//     userId: string;
//     username: string;
//   };
// }


@Injectable({
  providedIn: 'root',
})
export class IncidentService {

  constructor(private firestore: AngularFirestore) { }


  createIncident(incidentData: any): Promise<string> {
    return this.firestore.collection('incidents').add(incidentData)
      .then(docRef => {
        return docRef.id;
      })
      .catch(error => {
        console.error('Error adding incident:', error);
        throw error;
      });
  }


  getAllIncidents(): Observable<any[]> {
    return this.firestore
      .collection('incidents')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as {
              title: string;
              description: string;
              assignedTo: string;
              status: string;
              comments: any[];
            };
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }



  getIncidentById(incidentId: string): Observable<any> {
    return this.firestore.collection('incidents').doc(incidentId).valueChanges();
  }


  assignIncidentToUser(incidentId: string, userId: string, assignedUser: string): Promise<void> {

    return this.firestore.collection('incidents').doc(incidentId).update({
      assignedTo: {
        userId: userId,
        username: assignedUser,
      },
    })
      .then(() => {
        console.log(`Incident ${incidentId} assigned to ${assignedUser}`);
      })
      .catch((error) => {
        console.error('Error assigning incident:', error);
        throw error;
      });
  }

  isIncidentAssigned(incidentId: string): Observable<string | null> {
    return this.firestore.collection('incidents').doc(incidentId).valueChanges().pipe(
      map((incident) => {
        const typedIncident = incident as { assignedTo?: { username: string } };
        return typedIncident?.assignedTo?.username || null;
      })
    );
  }


  updateIncident(incidentId: string, updatedData: any): Promise<void> {
    return this.firestore.collection('incidents').doc(incidentId).update(updatedData)
      .catch(error => {
        console.error('Error updating incident:', error);
        throw error;
      });
  }

  getIncidentsAssignedToUser(userId: string): Observable<any[]> {
    return this.firestore
      .collection('incidents', (ref) => ref.where('assignedTo', '==', userId))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as {
              title: string;
              description: string;
              assignedTo: string;
              status: string;
            };
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }


  updateIncidentStatus(incidentId: string, status: string): Promise<void> {
    return this.firestore
      .collection('incidents')
      .doc(incidentId)
      .update({ status: status });
  }

  deleteIncident(incidentId: string): Promise<void> {
    return this.firestore
      .collection('incidents')
      .doc(incidentId)
      .delete();
  }
}
