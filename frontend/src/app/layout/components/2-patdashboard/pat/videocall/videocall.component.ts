import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { CallService } from 'src/app/architecture/services/call/call.service';
import { DialogComponent,DialogData } from './dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';
import { TranscribeService } from 'src/app/architecture/services/call/transcribe.service';
import { AuthService } from 'src/app/architecture/services/auth.service';
import { SharedService } from 'src/app/architecture/services/shared.service';
import { DoctorService } from 'src/app/architecture/services/doctor/doctor.service';
import { PatientService } from 'src/app/architecture/services/patient/patient.service';

@Component({
  selector: 'app-videocall',
  templateUrl: './videocall.component.html',
  styleUrls: ['./videocall.component.css']
})
export class VideocallComponent implements OnInit, OnDestroy {
  public isCallStarted$: Observable<boolean>;
  public peerId: string; 

  // this property accesses the local video element (Alice's video) in the HTML template using the @ViewChild decorator.
  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement> | null = null;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement> | null=null;

  currentUserRole: string='';

  getCurrentUserRole() {
    this.authService.user().subscribe((user: any) => {
      this.currentUserRole = user.role;
    });
  }


  videoData: any = {
    peer_id:'',
    doctor:'',
    patient:'',
  };

 


  constructor(public dialog: MatDialog, private callService: CallService, private route:ActivatedRoute, private transcribeService:TranscribeService, private authService:AuthService, private sharedService:SharedService,private doctorService:DoctorService,private uploadService:PatientService, private recordsService: PatientService) {

    this.getCurrentUserRole();
    
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer();
    
    console.log("real peer id is ",this.peerId)
    //peeridsending to django backend for storage
    this.videoData.peer_id=this.peerId;

    this.videoData.patient=this.route.snapshot.paramMap.get('patientId');

    this.videoData.doctor=this.route.snapshot.paramMap.get('doctorId');

    console.log("information to unlock sending peer id in vid ts : ",this.videoData);

    // this.callService.peerIdSend(this.videoData).subscribe((response:any)=>{
    //      console.log("the peer id have been sent vid ts.",response)
    //      this.sendCallIdToTranscribeService(response.call_id,response.patient);
    // })
    
  }

  selectedFile!:File;


  

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    }

  sendFileToBackend() {
    const fileData = {
      past_records: this.selectedFile,
    };
  
    const formData = new FormData();
    formData.append('past_records', this.selectedFile);

  
    this.uploadService.uploadFile(formData).subscribe((res: any) => {
      console.log('File sent to backend:', res);
    });
  }

  sendCallIdToTranscribeService(callId: any,patientId:any) {
    this.transcribeService.data.call_id = callId;
    this.transcribeService.data.patient_id=patientId;
  }

  transResponse: any='';
  loading: boolean = false;

  fakeData = {
    "key_points": [
        "Patient's name: Tripura Amanda Flores",
        "Patient reluctant to share their name",
        "Location unknown"
    ],
    "likely_diagnoses": [
      "Alzehemier 50%",
      "Headache 40%",
      "Hiv 30%"
    ],
    "followup_questions": [
        "Can you provide your date of birth?",
        "Are you experiencing any specific symptoms or health concerns?",
        "Do you have any medical conditions or take any medications regularly?",
        "Can you describe your current location or any recent travel history?"
    ]
  };


  results :any= [];
  viewRecords:boolean=false;

  
  isImage(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = this.getFileExtension(url);
    return imageExtensions.includes(fileExtension);
  }

  getFileExtension(url: string): string {
    const urlParts = url.split('.');
    return urlParts[urlParts.length - 1];
  }
  
  ngOnInit(): void {

    this.sharedService.onResponseAvailable().subscribe((data) => {
      this.loading = true; // Set loading to true when a new response is received
      setTimeout(() => {
        this.transResponse = data;
        this.loading = false; // Set loading to false after 5 seconds
      }, 5000);
    });


    this.recordsService.getRecords().subscribe((res:any)=>{
      this.results = res.results;
    })

    // The code sets up video elements for Alice and Dr. Bob's video consultation, subscribing to 
    // callService observables to display the streams when available.

     this.callService.localStream$   //Gets the observable for Alice's video stream.
      .pipe(filter(res => !!res))   //Filters out any null or undefined values from the stream.
      .subscribe(stream => {        //Subscribes to the filtered stream and sets up the local video element to display the stream.
        if (this.localVideo) {
          this.localVideo.nativeElement.srcObject = stream;
        }
      })
    this.callService.remoteStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => {
        if (this.remoteVideo) {
          this.remoteVideo.nativeElement.srcObject = stream;
        }
      })
  }
  
  notesSave:any='';

  onSendDocNotes()
  {
    const notesData = {
      doctor_notes: this.notesSave,
      patient: this.videoData.patient,
      doctor: this.videoData.doctor
    };
    
    this.doctorService.sendNotes(notesData).subscribe((res:any)=>{
      console.log("notes sent to backend",this.notesSave);
    })
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }

  
  // If joinCall is true, it sets peerId to undefined and joinCall to true; if joinCall is false, it sets peerId to this.peerId and joinCall to false.

  public showModal(joinCall: boolean): void {
    let dialogData: DialogData = joinCall ? ({ peerId: undefined, joinCall: true }) : ({ peerId: this.peerId, joinCall: false });
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: dialogData
    });

//     If joinCall is true, it establishes a media call with the peer.
 // If joinCall is false, it enables call answering.

    dialogRef.afterClosed()
      .pipe(
        switchMap(peerId => 
          joinCall ? of(this.callService.establishMediaCall(peerId)) : of(this.callService.enableCallAnswer())
        ),
      )
      .subscribe(_  => { });
  }

  public endCall() {
    this.callService.closeMediaCall();
  }
}
