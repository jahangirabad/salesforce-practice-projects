trigger AppointmentTrigger on Appointment__c (before insert, before update) {
    if(trigger.isBefore){
        if(trigger.isInsert || trigger.isUpdate){
            AppointmentTriggerHandler.validate(trigger.new);
        }
    }
}