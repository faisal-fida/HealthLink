import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/architecture/services/auth.service';
import { PatientService } from 'src/app/architecture/services/patient/patient.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-chat1',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  ngOnInit(): void {
    this.onbookedAppointments();
    console.log("here are book appointments in chat patient : ",this.bookedAppointments)
  }

  onbookedAppointments() {
    this.patientService.getbookedAppointments().subscribe(
      (response: any) => {
        this.bookedAppointments = response;    
      }
    );
  }


  newMessage = '';
  messages: string[] = [];

  chatSocket: WebSocket;

  currentUserRole: string='';

  getCurrentUserRole() {
    this.authService.user().subscribe((user: any) => {
      this.currentUserRole = user.role;
    });
  }

  bookedAppointments:any[] = []; 

  dr_id:any=''

  constructor(private authService:AuthService, private patientService:PatientService) {

    this.getCurrentUserRole();
    
    const token = localStorage.getItem('token');
    this.chatSocket = new WebSocket(`${environment.testApi} / ${this.dr_id}  /?token= ${token}`);
   console.log()

    this.chatSocket.onopen = (e) => {
      console.log('Chat socket successfully connected.');
    };

    this.chatSocket.onclose = (e) => {
      console.log('Chat socket closed unexpectedly');
    };

    this.chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const message = `${data.user}: ${data.message}`;
      this.messages.push(message);
    };
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatSocket.send(this.newMessage);
      this.newMessage = '';
    }
  }

  removeMessage(message: string): void {
    const index = this.messages.indexOf(message);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
  }
}
