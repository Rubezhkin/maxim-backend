import { Module } from "@nestjs/common";
import { MediaFile } from "./files.model";
import { FilesService } from "./files.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([MediaFile])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
