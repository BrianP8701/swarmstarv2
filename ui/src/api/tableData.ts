import { withApiErrorHandling, generateBackendUrl } from '@/api/apiUtils';

export const getTableData = withApiErrorHandling(async (user_id: number, table: string, page_size: number, page_index: number, sort_by: string, sort_direction: string, include_statuses: { [key: string]: boolean }, include_types: { [key: string]: boolean }) => {
    const response = await fetch(generateBackendUrl("get_table_data"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            table: table,
            page_size: page_size,
            page_index: page_index - 1,
            sort_by: sort_by,
            sort_direction: sort_direction,
            include_statuses: include_statuses,
            include_types: include_types
        })
    });
    return response.json();
});
