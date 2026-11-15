public with sharing class AppointmentTriggerHandler {
    
    public static void validate(List<Appointment__c> newAppointment){
        Set<Id> DrId=new Set<Id>();
        
        for(Doctor__c doc:[SELECT Id FROM Doctor__c WHERE Is_Active__c = true]){
            DrId.add(doc.Id);
        }        

        Set<Date> AppDate=new Set<Date>();
        for(Appointment__c dd:newAppointment){
            if(dd.Appointment_Date__c!=null){
                AppDate.add(dd.Appointment_Date__c);
            }            
        }

        List<Appointment__c> existingAppointments = [
        SELECT Id, Appointment_Date__c, Doctor__c 
        FROM Appointment__c 
        WHERE Doctor__c IN :DrId
        AND Appointment_Date__c IN :AppDate
        ];

        

    Map<String, Integer> countMap = new Map<String, Integer>();

    for (Appointment__c existApp : existingAppointments) {
    // 1. Unique Key Banao
    String key = existApp.Doctor__c + '_' + existApp.Appointment_Date__c; 

    // 2. Dekho notebook/map mein pehle se is key par koi number hai ya nahi
    Integer totalCount = countMap.containsKey(key) ? countMap.get(key) : 0;

    // 3. Number +1 karke Map mein wapas save kar do
    if (totalCount > 2) {
        existApp.addError('Limit Exceeded!');
    } else {
        // Safe hai! Toh Map ke counter ko Memory mein +1 badha do
        countMap.put(key, totalCount + 1);
    }
    
    }    

    }
}