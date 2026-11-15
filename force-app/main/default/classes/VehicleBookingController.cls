public with sharing class VehicleBookingController {
     public VehicleBookingController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Vehicle__c> getVehicleType(){
        try {
            return[SELECT Id, Name, Type__c,Per_Km_Rate__c FROM Vehicle__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void bookVehicle(String Name, String Mobile, String Email, 
    Id vehicleId, Date PickUpDate, String PickUpAddress, String DropAddress, String Dis){        
        
        Savepoint sp=Database.setSavepoint();
        try {
            if(vehicleId==null){
                throw new AuraHandledException('Vehicle id is required');
            }
            Client__c cl=new Client__c();
            Booking__c bk=new Booking__c();
            cl.Name=Name;
            cl.Phone__c=Mobile;
            cl.Email__c=Email;

            insert cl;

            bk.Vehicle__c=vehicleId;
            bk.Distance_Km__c=Decimal.valueOf(Dis);
            bk.Pickup_Location__c=PickUpAddress;
            bk.Drop_Location__c=DropAddress;
            bk.Status__c='Confirmed';
            bk.Booking_Date__c=PickUpDate;
            bk.Client__c=cl.Id;
            
            insert bk;

        } catch (Exception e) {
            Database.rollback(sp);
            throw new AuraHandledException(e.getMessage());
        }


    }

}