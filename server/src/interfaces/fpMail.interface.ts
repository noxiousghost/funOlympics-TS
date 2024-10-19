import { IMail } from './mail.interface';

export interface IfpMail extends IMail {
  verified: boolean;
}
