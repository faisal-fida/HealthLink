import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/architecture/services/auth.service';
import { PatientService } from 'src/app/architecture/services/patient/patient.service';
import { SharedService } from 'src/app/architecture/services/shared.service';
import { NotifyService } from '../../../notification/notify.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pappointment',
  templateUrl: './pappointment.component.html',
  styleUrls: ['./pappointment.component.css']
})
export class PappointmentComponent implements OnInit {

  goBack() {
    this.router.navigate(['/patient/dashboard'])
  }

  constructor(private currentPatient:AuthService,private authService:AuthService, private patientService:PatientService, private route:ActivatedRoute, private router:Router, private keyService:SharedService, private notifyService:NotifyService){}

  ngOnInit(): void {

    // by clicking book appoointment, get doctor id from docsearch
    this.appointmentData.doctor=this.route.snapshot.paramMap.get('doctorId');

    // get the current logged in patient user id 
    this.currentPatient.user().subscribe((res:any)=>{
           this.appointmentData.patient=res.id;
    })


    this.onbookedAppointments();

  }

  onupdateAppointment:boolean=false;

  pkAppointment:any='';
  
 

  appointmentData: any = {
    start:'',
    doctor:'',
    patient:'',
    pkAppointment:''
  };

  presentAppointments:boolean=false;

 

  onBookAppointment()
  {

    this.patientService.makeAppointment(this.appointmentData).subscribe((response:any)=>{
      console.log("appointment book boi",response);
      this.notifyService.showSuccess('Appointment Booked Successfully!'); // added showSuccess
    }, error => {
      console.error("appointment error boi",error);
      this.notifyService.showError('Error! Please Fill Out Form.'); // added showError
    });
  
 
  }

  bookedAppointments = new MatTableDataSource<any>();

  onbookedAppointments() {
    this.patientService.getbookedAppointments().subscribe(
      (response: any) => {
        this.bookedAppointments.data = response;
        
        // Add expiresAt property to each appointment
        this.bookedAppointments.data.forEach((appointment) => {
          appointment.expiresAt = new Date(appointment.start).getTime() + 30 * 60 * 1000; // 30 minutes
          // appointment.expiresAt = new Date(appointment.start).getTime() + 3 * 60 * 1000; // 3 minutes
        });
        
        // Sort appointments by latest appointment
        this.bookedAppointments.data.sort((a, b) => {
        return new Date(b.start).getTime() - new Date(a.start).getTime();
      });
    }
  );
  }

  onUpdateAppointment(appointId:any,docId:any) {

    this.onupdateAppointment=true;

    this.presentAppointments=false;

    this.appointmentData.doctor=docId;
    this.appointmentData.pkAppointment=appointId;

   
  }

  onSubmitUpdatedAppointment() {
    this.patientService.updateAppointment(this.appointmentData,this.appointmentData.pkAppointment).subscribe((response:any)=>{
      console.log(response);
    })
    this.onupdateAppointment=false;
  }


  onDeleteAppointment(appointId:any)
  {
    this.patientService.delAppointment(appointId).subscribe(
      (response:any)=>{
        console.log("appointment deleted succesfully",response)
      }
    )
    this.notifyService.showWarning("Appointment deleted Succcessfully")
  }


  isJoinVisible(start: string, expiresAt: number): boolean {
    const appointmentTime = new Date(start);
    const currentTime = new Date();
    return appointmentTime.getTime() <= currentTime.getTime() && currentTime.getTime() <= expiresAt;
  }
}

