export interface ApiResponse<T> {
  isError: boolean;
  message?: string;
  data?: T;
  status: number;
}

export class APIresponse<T> implements ApiResponse<T> {
  constructor(
    public isError: boolean,
    public status: number,
    public message?: string,
    public data?: T,
    public token?: string
  ) {}
}
