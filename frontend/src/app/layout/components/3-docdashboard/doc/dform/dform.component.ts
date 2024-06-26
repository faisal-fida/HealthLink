import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/architecture/services/auth.service';
import { DoctorService } from 'src/app/architecture/services/doctor/doctor.service';
import {SPECIALIZATION_CHOICES,QUALIFICATION_CHOICES,availableDays} from './doctorExtras'
import { onChange } from './doctorExtras';
import { NotifyService } from '../../../notification/notify.service';

@Component({
  selector: 'app-dform',
  templateUrl: './dform.component.html',
  styleUrls: ['./dform.component.css']
})
export class DformComponent {

  form!: FormGroup;
  message = '';

  isUpdateMode=false;

  SPECIALIZATION_CHOICES=SPECIALIZATION_CHOICES;
  QUALIFICATION_CHOICES=QUALIFICATION_CHOICES;
  availableDays=availableDays;
  

  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private authService: AuthService,
    private router: Router,
    private route:ActivatedRoute,
    private notifyService:NotifyService
  ) {}

  ngOnInit(): void {
   

    this.route.queryParams.subscribe(params=>{
      this.isUpdateMode=params['updateMode'] ||false;        //catch the boolean value from dashboard compoent
      this.createForm();                                     //create the entire form fields
      if (this.isUpdateMode) {                               //if update is true
        this.getDoctorDataFields();                         // fill out the form fields with patient data
      }
    })
    
  }

  createForm()
  {
    this.form = this.formBuilder.group({
      specialization: '',
      qualification: '',
      experience_years: '',
      city: '',

      available_timings: '',

      consultation_fees: '',

      availability_data:this.formBuilder.group({
        days: this.formBuilder.array([]),// Initialize as an empty array
        start:'',
        end:''
      }),

      summary: '',
      wait_time: '',
    });
  }



  onChange(e:any)      //function which saves the weekend data to the form in array
  {
    onChange(e,this.form);
  }


  submit() {
    const method = this.isUpdateMode ? 'updateDoctorProfile' : 'register';   
    this.doctorService[method](this.form.getRawValue())
      .subscribe((res:any) => {
        console.log(res);
        this.notifyService.showSuccess('Successfully Created Doctor Profile!'); // added showSuccess
        this.router.navigate(['/doctor/dashboard']);
      }, error => {
        console.error(error);
        this.notifyService.showError('Error! Please Fill Out Form.'); // added showError
      });
  }

  Done() {
    this.router.navigate(['/doctor/dashboard']);
  }

  getDoctorDataFields() {
    this.doctorService.getDoctor().subscribe(data => this.form.patchValue(data));   //re-write the patient data on the form fields
  }

  toggleUpdateMode() {                               //used for cancel button which empties out the form fields and does not update the form
    this.isUpdateMode = !this.isUpdateMode;
    
  }


}
