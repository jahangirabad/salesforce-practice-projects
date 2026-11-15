public with sharing class GymCheckInTriggerHandler {
    public GymCheckInTriggerHandler() {

    }
    public static void handleAfterInsert(List<Gym_CheckIn__c> newCheckIns) {
        // Implement logic as needed
        Set<Id> memberId = new Set<Id>();
        for (Gym_CheckIn__c checkIn : newCheckIns) {
            if (checkIn.Gym_Member__c != null) {
                memberId.add(checkIn.Gym_Member__c);
    }
    }
    List<Gym_Member__c> members = [SELECT Id, Name, Last_Visit_DateTime__c, Status__c, Total_Visits__c FROM Gym_Member__c WHERE Id IN :memberId];
    for (Gym_Member__c GM :members) {
            GM.Last_Visit_DateTime__c = System.now();
            GM.Total_Visits__c = GM.Total_Visits__c + 1;
        }
    update members;
           
    }
}
