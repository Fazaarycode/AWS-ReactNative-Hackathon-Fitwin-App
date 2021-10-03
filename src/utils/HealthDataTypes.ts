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