export class PaginationResponseDto<T> {
  row: T[];
  rowLength: number;
  totalLength: number;
  page: number;
  totalPage: number;

  constructor(row: T[], totalLength: number, page: number, size: number) {
    const data: PaginationResponseDto<T> = {
      row,
      rowLength: row.length,
      totalLength,
      page,
      totalPage:
        totalLength > 0 ? Math.ceil(totalLength / (size || totalLength)) : 1,
    };

    Object.assign(this, data);
  }
}
