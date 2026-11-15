trigger GymCheckInTrigger on Gym_CheckIn__c (after insert) {
    if (Trigger.isAfter && Trigger.isInsert){
    GymCheckInTriggerHandler.handleAfterInsert(Trigger.new);
}
}