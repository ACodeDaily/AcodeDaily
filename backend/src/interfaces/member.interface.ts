export interface Member {
  _id?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  org: string;
  message: string;
  resume: string;
  jobId: string;
  cfUserName: string;
  cgpa: number;
  yoe: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  referrerResponse?: string;
  secretId?: string;
}

export interface UpdateMember {
  status: string;
  referrerResponse: string;
  referrerId: string;
}

export interface MemberFilter {
  status?: string;
  org?: string;
  sort?: -1 | 1;
}
