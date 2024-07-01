export type TableDataRequest = {
    table: string;
    page_size: number;
    page_index: number;
    sort_by: string;
    sort_direction: string;
    include_properties: { [key: string]: boolean };
};
