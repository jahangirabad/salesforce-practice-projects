public with sharing class AppointmentController {
    public AppointmentController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getDoctor(){
        try {
            return[
                SELECT Id, Name, Specialization__c
                FROM Doctor__c
                WHERE Is_Active__c = TRUE
                
            ];            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void bookAppointment(String Name, Integer Age, Date appointmentDate, Id doctorId){
        Savepoint sp=Database.setSavepoint();
        try {
            if(doctorId==null){
                throw new AuraHandledException('Doctor id is required');
            }
            Patient__c pat=new Patient__c();
            Appointment__c appoint=new Appointment__c();
            pat.Name=Name;
            pat.Age__c=Age;

            insert pat;
            appoint.Doctor__c=doctorId;
            appoint.Patient__c=pat.Id;
            appoint.Appointment_Date__c=appointmentDate;
            appoint.Status__c='Scheduled';
            
            insert appoint;

        } catch (Exception e) {
            Database.rollback(sp);
            throw new AuraHandledException(e.getMessage());
        }
    }
   
}