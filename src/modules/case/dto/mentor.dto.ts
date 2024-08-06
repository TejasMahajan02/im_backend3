import { IsString } from "class-validator";

export class MentorDto {
    @IsString()
    uuid: string;
}