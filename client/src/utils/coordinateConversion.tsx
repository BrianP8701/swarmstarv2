interface ElementCoordinates {
    pdfX: number;
    pdfY: number;
    width: number;
    height: number;
  }
  
  interface EditableElement {
    top: number;
    left: number;
    type: 'text' | 'form';
    content: string;
  }
  
  export const convertCoordinates = (
    element: EditableElement,
    pdfPageDimensions: { width: number; height: number }
  ): ElementCoordinates => {
    const { top, left } = element;
    const pdfX = (left / pdfPageDimensions.width) * 100;
    const pdfY = (top / pdfPageDimensions.height) * 100;
    return { pdfX, pdfY, width: element.left, height: element.top };
  };
  