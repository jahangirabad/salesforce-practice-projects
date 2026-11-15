import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Aapki GymCheckInController class ke exact methods import kiye gaye hain
import getMemberList from '@salesforce/apex/GymCheckInController.getMemberList';
import createCheckIn from '@salesforce/apex/GymCheckInController.createCheckIn';

export default class GymCheckInApp extends LightningElement {
    @track selectedMemberId = ''; // Selected member ID hold karne ke liye
    @track memberOptions = [];    // Combobox ke options [{label, value}]
    @track isLoading = false;      // Spinner control karne ke liye

    // 1. Wire Service: getMemberList se Active Members lana
    @wire(getMemberList)
    wiredMembers({ error, data }) {
        if (data) {
            // Apex data ko combobox ke required format mein map kar rahe hain
            this.memberOptions = data.map(member => ({
                label: member.Name, // Member ka naam dropdown mein dikhega
                value: member.Id    // Member ki ID select hone par JS mein aayegi
            }));
        } else if (error) {
            this.showToast('Error Loading Members', error.body ? error.body.message : 'Unknown error', 'error');
        }
    }

    // 2. Dropdown Change Handler: User selection handle karna
    handleMemberChange(event) {
        this.selectedMemberId = event.detail.value;
    }

    // 3. Getter: Button enable/disable state
    get isButtonDisabled() {
        return !this.selectedMemberId;
    }

    // 4. Check-In Button Click Handler
    handleCheckIn() {
        if (!this.selectedMemberId) {
            return;
        }

        this.isLoading = true; // Spinner start

        // Apex Method Call: parameter name 'memberId' hai jo Apex mein expect kar raha hai
        createCheckIn({ memberId: this.selectedMemberId })
            .then(() => {
                // Success Toast Message
                this.showToast('Success', 'Check-In Record Created Successfully!', 'success');
                
                // Dropdown reset (clear selection)
                this.selectedMemberId = '';
            })
            .catch(error => {
                // Error Toast Message
                const errorMsg = error.body ? error.body.message : 'Check-In fail ho gaya.';
                this.showToast('Check-In Error', errorMsg, 'error');
            })
            .finally(() => {
                this.isLoading = false; // Spinner stop
            });
    }

    // Helper Method: Toast notification dispatch karne ke liye
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}