export interface Box {
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
}

export interface FormBox extends Box {
    type: string;
    text: string;
}

export interface TextBox extends Box {
    text: string;
}

export type Paperwork = {
    [id: number]: Box;
};
