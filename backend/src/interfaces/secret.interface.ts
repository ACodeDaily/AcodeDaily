export interface Secret {
  _id?: string;
  token: string;
  cfUserName: string;
  discordId: string;
  date: Map<string, number>;
  updatedAt?: Date;
  tokenIssuedAt?: Date;
}

export interface CreateSecret {
  cfUserName: string;
  token: string;
  discordId: string;
}

export interface VerifySecret {
  token: string;
  cfUserName: string;
}

export interface GetSecret {
  token: string;
}

export interface VerifyAccessKeyAndSecretKey {
  access_key: string | undefined;
  secret_key: string | undefined;
}
