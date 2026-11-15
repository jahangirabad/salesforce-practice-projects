import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDoctor from '@salesforce/apex/AppointmentController.getDoctor';
import bookAppointment from '@salesforce/apex/AppointmentController.bookAppointment';

export default class BookAppointment extends LightningElement {
    doctorOptions=[];
    selectedDoctorId=''; 
    patientName='';
    patientAge=null;
    appointmentDate=null;
    
    @wire(getDoctor)
    wireddoctor({error, data}){
        if(data){
            this.doctorOptions=data.map(dr=>{
                return{
                    label: dr.Name,
                    value: dr.Id
                };
            });
        }
        else if(error){
            const msg = error.body ? error.body.message : 'Unknown Error';
            this.showToast('Error Loading Doctors', msg, 'error');
        }
    }

    handleBookAppointment(){
        bookAppointment({Name: this.patientName, Age:this.patientAge, appointmentDate:this.appointmentDate, doctorId:this.selectedDoctorId}).then(()=>{
            this.showToast('Success','Appointment Booked Successfuly','success')
            this.selectedDoctorId='';
            this.patientName='';
            this.patientAge=null;
            this.appointmentDate=null;
        }).catch((error)=>{            
            this.showToast('Error',error.body.message,'error')
        });
    }

    handleDoctorChange(event){
        this.selectedDoctorId=event.detail.value;
    }
    handleAgeChange(event){
        this.patientAge=event.target.value;
    }
    handleNameChange(event){
        this.patientName=event.target.value;
    }
    handleDateChange(event){
        this.appointmentDate=event.target.value;
    }
    get minDate(){
        const dt=new Date();
        // ISO string "YYYY-MM-DDTHH:mm:ss.sssZ" hoti hai, split karke YYYY-MM-DD le lenge
        return dt.toISOString().split('T')[0];
    }
    showToast(t, m, v){
        const evt=new ShowToastEvent({
            title:t,
            message:m,
            variant:v
        });
        this.dispatchEvent(evt);
    }

}