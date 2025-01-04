export interface IAttendance {
  id: number;
  userId: number;
  entryTime: string;
  exitTime?: string;
}
