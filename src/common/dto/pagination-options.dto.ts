import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationOptions {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1_000)
    @Type(() => Number)
    limit: number = 20;
}
