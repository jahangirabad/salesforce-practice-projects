import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getVehicleType from '@salesforce/apex/VehicleBookingController.getVehicleType';
import bookVehicle from '@salesforce/apex/VehicleBookingController.bookVehicle';
export default class VehicleBookingWizard extends LightningElement {
    vehicleOptions = [];
    selecetdVehicleId = '';
    pickUpLocation = '';
    dropLocation = '';
    pickUpDate = '';
    distanceCovered = '';
    totalFare = '';
    rate = 0;
    name='';
    phone='';
    email='';
    vehicleRates = {};

    @wire(getVehicleType)
    wiredVehicleType({ error, data }) {
        if (data) {
           
            this.vehicleOptions = data.map(vehicle => {
                this.vehicleRates[vehicle.Id] = vehicle.Per_Km_Rate__c; 
                return{
                label: vehicle.Name+' ('+vehicle.Type__c+')',
                value: vehicle.Id
                };
                
            });
    }
    else if(error) {this.showToast('Error', error.body.message, 'error');}
    }

    handleVehicleTypeChange(event) {
        this.selecetdVehicleId = event.detail.value;
    }

    handlePickUpLocationChange(event) {
        this.pickUpLocation = event.detail.value;
    }

    handleDropLocationChange(event) {
        this.dropLocation = event.detail.value;
    }

    handlePickUpDateChange(event) {
        this.pickUpDate = event.detail.value;
    }

    get minDate(){
        const dt=new Date();
        // ISO string "YYYY-MM-DDTHH:mm:ss.sssZ" hoti hai, split karke YYYY-MM-DD le lenge
        return dt.toISOString().split('T')[0];
    }
    
    handleDistanceCoveredChange(event) {
        this.distanceCovered = event.detail.value;
        this.totalFare = this.calculateTotalFare();
    }

    calculateTotalFare() {
        // Simple fare calculation, e.g., ₹10/km
        const distance = this.distanceCovered || 0;
        this.rate = this.vehicleRates[this.selecetdVehicleId] || 0;
        return distance*this.rate;
    }

    handleNameChange(event){
        this.name=event.detail.value;
    }
    handlePhoneChange(event){
        this.phone=event.detail.value;
    }
    handleEmailChange(event){
        this.email=event.detail.value;
    }

    handleBookVehicle() {
        // Implement booking logic here
        bookVehicle({Name:this.name, Mobile:this.phone, Email:this.email, vehicleId:this.selecetdVehicleId, 
            PickUpDate:this.pickUpDate, PickUpAddress:this.pickUpLocation, DropAddress:this.dropLocation, 
            Dis:this.distanceCovered}).then(()=>{
            this.showToast('Success','Appointment Booked Successfuly','success')
            this.name='';
            this.phone='';
            this.email='';
            this.selecetdVehicleId='';
            this.pickUpDate='';
            this.pickUpLocation='';
            this.dropLocation='';
            this.distanceCovered='';            
        }).catch((error)=>{            
            this.showToast('Error',error.body.message,'error')
        });
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