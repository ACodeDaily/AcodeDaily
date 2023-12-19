export interface renderTemplateData {
  otp?: number;
  expiresIn?: number;
  to: string;
  template: string;
  username?: string;
  subject: string;
  reason?: string;
}
