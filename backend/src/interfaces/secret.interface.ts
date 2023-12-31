export interface Secret {
  _id?: string;
  token: string;
  cfUserName: string;
  date: Map<string, number>;
  updatedAt?: Date;
  tokenIssuedAt?: Date;
}

export interface CreateSecret {
  cfUserName: string;
  token: string;
}

export interface GetSecret {
  token: string;
}

export interface VerifyAccessKeyAndSecretKey {
  access_key: string | undefined;
  secret_key: string | undefined;
}
