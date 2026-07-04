import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { MediaFile } from "./files.model";
import { Repository } from "typeorm";
import { Post } from "src/posts/posts.model";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(MediaFile) private fileRepository: Repository<MediaFile>,
  ) {}
  async createFile(file: Express.Multer.File, post: Post): Promise<string> {
    try {
      const fileName = uuid.v4() + ".jpg";
      const filePath = path.resolve(__dirname, "..", "..", "static");
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      const newFile = this.fileRepository.create({
        name: fileName,
        post: post,
      });
      await this.fileRepository.save(newFile);
      return fileName;
    } catch (e) {
      console.error("Error creating file:", e);
      throw new HttpException(
        "Ошибка при создании файла",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
