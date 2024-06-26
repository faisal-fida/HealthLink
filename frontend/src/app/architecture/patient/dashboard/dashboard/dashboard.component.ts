import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/architecture/services/auth.service';
import { PatientService } from 'src/app/architecture/services/patient/patient.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  patientData: any = {};
  onbookAppointment:boolean=false;
 

  constructor(private patientService:PatientService, private router:Router,private authService:AuthService) {}
  
ngOnInit(): void {
  this.patientService.getPatient().subscribe((res:any)=>{
    this.patientData=res;
    // console.log("coming from dashboard",this.patientData);
  }
  )


  this.onbookedAppointments();
}

  

   searchQuery:string='';          // stores the words  that user types in search
  searchResults:any[]=[];          //stores the automcomplete searchResults of doctors
  selectedCity:string='';          //stores that city in which user wants to search doctor
  bookedAppointments:any[] = []; 


  // function to store book appointment data and to be sent to backend
  appointmentData: any = {
    start:'',
    doctor:'',
    patient:'',
    pkAppointment:''
  };



   cities:string[]=[
   'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Hyderabad', 'Quetta', 'Peshawar', 'Gujranwala', 'Sialkot', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas', 'Rahim Yar Khan', 'Sahiwal', 'Okara', 'Wah Cantonment', 'Dera Ghazi Khan', 'Mingora', 'Kamoke', 'Shekhupura', 'Mardan', 'Kasur', 'Gujrat', 'Chiniot', 'Jhang', 'Sadiqabad', 'Sheikhupura', 'Attock', 'Jhelum', 'Jacobabad', 'Khanewal', 'Muzaffargarh', 'Khanpur'
   ]

   //array that stores all results of doctor after clicking on search button

   afterSearchData:any[]=[];

  searchDoctors()
  {                                          //if userpresses backspace and clear the search bar then remove the search results showing on the screen
    if(this.searchQuery===''){
      this.clearSearchResults();
      return                                // after that don't go further and don't make any more calls
    }

   this.patientService.searchDoctors(this.searchQuery).subscribe(
      (response:any)=>{
          this.searchResults=response
          console.log(this.searchResults)
      },
    )
    }

    // for clearing auto complete search reuslts

    clearSearchResults()
    {
      this.searchResults=[];
    }

    // function that shows the searched results of doctors after clicking on search button

    doctorsSearched()
    {
      this.patientService.afterDoctorsSearched(this.searchQuery,this.selectedCity).subscribe((response:any)=>{
           this.afterSearchData=response.results;
           console.log('data came after search is : ',this.afterSearchData);
      })
    }

    // function that passes primary key of a specified doctor to doctor dshaboard and view that doctor

    viewDoctor(userId:any)
    {
      this.router.navigate(['/dboard',userId]);
        
    }

   
    // function for booking appointment

    onAppointment(docId:any)
    {

      this.onbookAppointment=true;
      
      this.authService.user().subscribe((res:any)=>{
        this.appointmentData.patient=res.id;
        console.log("the patient id is : ",res.id)
  
      
      
      this.appointmentData.doctor=docId;

      this.patientService.makeAppointment(this.appointmentData).subscribe((response:any)=>{
        console.log(response);
      })
    });
    }

    
    onbookedAppointments()
    {
       this.patientService.getbookedAppointments().subscribe(
        (response:any)=>{
          this.bookedAppointments=response;
        }
       )
    }

    updatePatientForm()
    {
      this.router.navigate(['/patient'],{queryParams:{updateMode:true}});
    }

    updatePatientProfile()
    {
      this.router.navigate(['/register'],{queryParams:{updateMode:true}});
    }


    onDeletePatient()
    {
      this.patientService.deletePatient().subscribe(
        (reponse:any)=>{
          console.log("patient deleted successfully",reponse)
        }
      )
    }
  
    onDeletePatientForm()
    {
      this.patientService.delPatForm().subscribe(
        (response:any)=>{
          console.log("paitent form deleted successfully",response);
        }
      )
    }

    onupdateAppointment:boolean=false;

    pkAppointment:any='';
    
    onUpdateAppointment(appointId:any,docId:any) {

      this.onupdateAppointment=true;
      this.appointmentData.doctor=docId;
      this.appointmentData.pkAppointment=appointId;
     
    }

    onSubmitUpdatedAppointment() {
      this.patientService.updateAppointment(this.appointmentData,this.appointmentData.pkAppointment).subscribe((response:any)=>{
        console.log(response);
      })
    }
    

    onDeleteAppointment(appointId:any)
    {
      this.patientService.delAppointment(appointId).subscribe(
        (response:any)=>{
          console.log("appointment deleted succesfully",response)
        }
      )
    }
  
}
