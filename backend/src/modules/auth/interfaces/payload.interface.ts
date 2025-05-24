export interface PayloadLogin extends Payload {
  sub: string;
}

export interface Payload {
  iat?: number;
  exp?: number;
}
