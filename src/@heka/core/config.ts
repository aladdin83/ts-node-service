export interface HekaConfig {
  env?: string;
  root?: string;
  port?: number;
  ip?: string;
  seedDB?: boolean;
  secrets?: {
    session: string
  };
  mongo?: {
    uri?: string,
    useNewUrlParser: boolean
  };
}