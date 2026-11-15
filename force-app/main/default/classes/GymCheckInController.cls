public with sharing class GymCheckInController {
    public GymCheckInController() {

    }
    @AuraEnabled
    public static void createCheckIn(Id memberId) {
        try {
            Gym_CheckIn__c checkIn = new Gym_CheckIn__c();
            checkIn.Gym_Member__c = memberId;
            checkIn.CheckIn_Time__c = System.now();
            insert checkIn;}
            catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
}
    @AuraEnabled(cacheable=true)
    public static List<Gym_Member__c> getMemberList(){
        return [SELECT Name FROM Gym_Member__c WHERE Status__c='Active' WITH USER_MODE];

    }

}