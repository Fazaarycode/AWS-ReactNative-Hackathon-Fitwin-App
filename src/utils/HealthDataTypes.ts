export interface FWHealthData {
  valid: boolean;
  value: number;
  startDate: string;
  endDate: string;
}

export interface FWHealthTarget {
  valid: boolean;
  targetValue: number;
}

export interface FWCoupon {
  id: number;
  contentType: string;
  width: number,
  height: number;
  imgData: string; // b64 image data
  type?: string;
  name?: string;
  validDate?: string;  
  
}