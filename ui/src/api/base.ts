import { withApiErrorHandling, generateBackendUrl } from '@/api/apiUtils';

import { Person, PersonSchema } from '@/types/person';
import { Property } from '@/types/property';
import { Transaction } from '@/types/transaction';

export const addPerson = withApiErrorHandling(async (person: Person) => {
    // Validate and parse the person object using Zod
    const validPerson = PersonSchema.parse(person);

    const response = await fetch(generateBackendUrl("add_person"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validPerson) // Send the validated person object
    });
    console.log('Response:', response);
    return response.json();
});

export const addProperty = withApiErrorHandling(async (user_id: string, address: string, street_number: string, street_name: string, street_suffix: string, unit: string, city: string, state: string, zip: string) => {

});

export const deletePeople = withApiErrorHandling(async (payload: { id: number[] | number }) => {
    const response = await fetch(generateBackendUrl("delete_person"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
});

export const deleteProperty = withApiErrorHandling(async (payload: { id: number[] | number }) => {
    const response = await fetch(generateBackendUrl("delete_property"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
});

export const deleteTransaction = withApiErrorHandling(async (payload: { id: number[] | number }) => {
    const response = await fetch(generateBackendUrl("delete_transaction"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
});
