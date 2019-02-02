export interface HekaConfig {
  env?: string;
  root?: string;
  port?: number;
  ip?: string;
  seedDB?: boolean;
  secrets?: {
    session: string
  };
  session?: {
    lifetime: number
  };
  mongo?: {
    uri?: string,
    useNewUrlParser: boolean
  };
  userRoles?: [string];
}