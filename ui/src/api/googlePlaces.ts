import { withApiErrorHandling, generateBackendUrl } from '@/api/apiUtils';

export const getAddressAutocomplete = withApiErrorHandling(async (query: string, session_token: string) => {
    const response = await fetch(generateBackendUrl(`address_autocomplete/${query}/${session_token}`), {
        method: 'GET'
    });
    console.log("response", response);
    const response_json = await response.json();
    console.log("response_json", response_json);
    return response_json["data"];
});

export const getPlaceDetails = withApiErrorHandling(async (place_id: string, session_token: string) => {
    const response = await fetch(generateBackendUrl(`get_place_details/${place_id}/${session_token}`), {
        method: 'GET'
    });
    const response_json = await response.json();
    return response_json["data"];
});
