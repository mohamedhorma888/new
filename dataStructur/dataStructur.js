class Contact {
    constructor(name, phone) {
        this.name = name;
        this.phone = phone;
        this.next = null; // For Doubly Linked List
        this.prev = null; // For Doubly Linked List
    }
}

class ContactManager {
    constructor() {
        // Doubly Linked List properties
        this.head = null;
        this.tail = null;
        // Hash Table properties (using JS object for simplicity)
        this.contactsByName = {};
    }

    // --- Hash Table Functionality: Quick Lookups ---

    // A simple hash function (uses the name as the key)
    hash(name) {
        return name.toLowerCase();
    }

    // Add contact to the hash table
    addToHashTable(contact) {
        const key = this.hash(contact.name);
        if (!this.contactsByName[key]) {
            // Store a reference to the actual Contact object in the linked list
            this.contactsByName[key] = contact; 
        }
    }

    // Quickly look up a contact by exact name
    lookupByName(name) {
        const key = this.hash(name);
        return this.contactsByName[key] || null;
    }

    // --- Doubly Linked List Functionality: Ordered Viewing ---

    addContact(name, phone) {
        const newContact = new Contact(name, phone);

        if (!this.head) {
            this.head = newContact;
            this.tail = newContact;
        } else {
            this.tail.next = newContact;
            newContact.prev = this.tail;
            this.tail = newContact;
        }
        // Also add to the hash table for quick lookups
        this.addToHashTable(newContact);
    }

    viewForward() {
        let current = this.head;
        const contactsList = [];
        while (current) {
            contactsList.push(`${current.name}: ${current.phone}`);
            current = current.next;
        }
        console.log("--- Contacts (Forward Order) ---");
        console.log(contactsList.join('\n'));
    }

    viewBackward() {
        let current = this.tail;
        const contactsList = [];
        while (current) {
            contactsList.push(`${current.name}: ${current.phone}`);
            current = current.prev;
        }
        console.log("--- Contacts (Backward Order) ---");
        console.log(contactsList.join('\n'));
    }

    // --- String Matching Functionality: Searching ---

    search(substring) {
        const results = [];
        const lowerCaseSub = substring.toLowerCase();
        let current = this.head;

        while (current) {
            // Simple substring search using JavaScript's built-in string methods
            if (current.name.toLowerCase().includes(lowerCaseSub) || current.phone.includes(lowerCaseSub)) {
                results.push(`${current.name}: ${current.phone}`);
            }
            current = current.next;
        }
        console.log(`--- Search Results for "${substring}" ---`);
        if (results.length > 0) {
            console.log(results.join('\n'));
        } else {
            console.log("No contacts found.");
        }
    }
}

// --- Demonstration ---

const manager = new ContactManager();

// 1. Add contacts
manager.addContact("Alice", "123-4567");
manager.addContact("Bob", "987-6543");
manager.addContact("Charlie", "555-1234");
manager.addContact("David", "444-4444");

// 2. View contacts in forward and backward order (using DLL)
manager.viewForward();
manager.viewBackward();

// 3. Search for contacts using a substring (string matching)
manager.search("li");
manager.search("456");
manager.search("Eve");

// 4. Quickly look up contacts by exact name (using Hash Table)
console.log("--- Quick Lookup ---");
const alice = manager.lookupByName("Alice");
console.log(`Found Alice: ${alice ? alice.phone : 'Not found'}`);

const frank = manager.lookupByName("Frank");
console.log(`Found Frank: ${frank ? frank.phone : 'Not found'}`);
