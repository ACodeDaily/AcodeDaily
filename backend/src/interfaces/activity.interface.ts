export interface Activity {
  _id?: string;
  email: string;
  cfUsername: string;
  status: string;
  referrerResponse: string;
  jobId: string;
  responseDate?: Date;
  applicationDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  activities?: string[];
}

export interface CreateActivity {
  email: string;
  cfUserName: string;
  status: string;
  referrerResponse: string;
  jobId: string;
  referrerId?: string;
  applicationDate: Date;
  message: string;
}
