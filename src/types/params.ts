export type RouteParams = {
  hospitalId?: string;
  serviceId?: string;
};

export type Params<T extends RouteParams = RouteParams> = Promise<T>;
