export class CommonDto {
  meta: any;
  data: any;
  errors?: string[];

  constructor(partial: Partial<CommonDto>) {
    Object.assign(this, partial);
  }
}
