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

// payload for the metrics
export interface FWStepData {
  id: number;  
  email: string;
  date: string;
  startTime: string; // ISO Date object
  endTime: string; // ISO Date object
  description?: string;
  dailySteps: number;
  deltaSteps: number;
  dailyDist: number;
  deltaDist: number;
  latitude: number;
  longitude: number;  
  deltaLocDist: number;
}
 