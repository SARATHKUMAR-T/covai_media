import "dotenv/config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db_connection";
import { APIresponse, Media } from "../types";

class MediaService {
  private static instance: MediaService;

  private constructor() {}

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  public async fetchMedia(id: string) {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM media WHERE id=${id}`
      );
      if (result.length === 0) {
        return new APIresponse<null>(
          true,
          StatusCodes.NOT_FOUND,
          "No media Found"
        );
      }

      return new APIresponse<RowDataPacket[]>(
        false,
        StatusCodes.OK,
        ReasonPhrases.OK,
        result
      );
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }
  public async allMedias() {
    try {
      const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM media`);
      if (result.length === 0) {
        return new APIresponse<null>(
          true,
          StatusCodes.NOT_FOUND,
          "unable to fetch"
        );
      }

      return new APIresponse<RowDataPacket[]>(
        false,
        StatusCodes.OK,
        ReasonPhrases.OK,
        result
      );
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }

  public async addMedia(media: Media) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO media (author_name,journal,type,created_by${
          media.published_year ? `,published_year` : ""
        }
        ${media.created_at ? `,created_at` : ""}
     ) VALUES ('${media.author_name}','${media.journal}','${media.type}','${
          media.created_by
        }'${media.published_year ? `',${media.published_year}'` : ""}
      ${media.created_at ? `',${media.created_at}'` : ""}
      )`
      );

      if (result?.insertId) {
        return this.fetchMedia(result.insertId.toString());
      }
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }

  public async removeMedia(id: string) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        `UPDATE media SET status=0 WHERE id=${id}`
      );
      return new APIresponse<null>(false, StatusCodes.OK, ReasonPhrases.OK);
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }

  public async updateMedia(media: Media, id: string) {
    try {
      let sql = ` UPDATE media SET `;
      if (media.author_name) {
        sql += ` author_name = '${media.author_name}',`;
      }
      if (media.journal) {
        sql += ` journal = '${media.journal}',`;
      }
      if (media.published_year) {
        sql += ` published_year = '${media.published_year}',`;
      }
      if (media.created_by) {
        sql += ` created_by = '${media.created_by}',`;
      }
      if (media.type) {
        sql += ` type = '${media.type}',`;
      }
      if (media.created_at) {
        sql += ` created_at = '${media.created_at}',`;
      }
      if (media.deleted_at) {
        sql += ` deleted_at = '${media.deleted_at}',`;
      }
      if (media.status) {
        sql += ` status = ${media.status},`;
      }
      if (!media.status) {
        sql += ` status = ${media.status},`;
      }

      sql = sql.slice(0, -1);
      sql += ` WHERE id = ${id}`;

      const [result] = await db.query<ResultSetHeader>(sql);
      if (result.affectedRows > 0) {
        return this.fetchMedia(id);
      }
      return new APIresponse<null>(false, StatusCodes.OK, ReasonPhrases.OK);
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }
}

export const mediaService = MediaService.getInstance();
