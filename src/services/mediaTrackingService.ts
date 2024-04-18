import "dotenv/config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db_connection";
import { APIresponse, MediaTracking } from "../types";

class MediaTrackingService {
  private static instance: MediaTrackingService;

  private constructor() {}

  public static getInstance(): MediaTrackingService {
    if (!MediaTrackingService.instance) {
      MediaTrackingService.instance = new MediaTrackingService();
    }
    return MediaTrackingService.instance;
  }

  public async fetchMediaTracking(id: string) {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM media_tracking WHERE id=${id} AND status=1`
      );
      if (result.length === 0) {
        return new APIresponse<null>(
          true,
          StatusCodes.NOT_FOUND,
          "No media tracking Found"
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
  public async allMediaTracking() {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM media_tracking WHERE  status=1`
      );
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

  public async addMediaTracking(media: MediaTracking) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO media_tracking (media_id,library_card${
          media.issued_at ? `,issued_at` : ""
        }
        ${media.returned_at ? `,returned_at` : ""}
        ${media.deleted_at ? `,deleted_at` : ""}

     ) VALUES (${media.media_id},'${media.library_card}'${
          media.issued_at ? `',${media.issued_at}'` : ""
        }
      ${media.returned_at ? `',${media.returned_at}'` : ""}
      ${media.deleted_at ? `',${media.deleted_at}'` : ""}
      )`
      );

      if (result?.insertId) {
        return this.fetchMediaTracking(result.insertId.toString());
      }
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }

  public async removeMediaTracking(id: string) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        `UPDATE media_tracking SET status=0 WHERE id=${id}`
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

  public async updateMediaTracking(media: MediaTracking, id: string) {
    try {
      let sql = `UPDATE media_tracking SET`;

      if (media.media_id) {
        sql += ` media_id = ${media.media_id},`;
      }
      if (media.library_card) {
        sql += ` library_card = '${media.library_card}',`;
      }

      if (media.issued_at) {
        sql += ` created_at = '${media.issued_at}',`;
      }
      if (media.deleted_at) {
        sql += ` deleted_at = '${media.deleted_at}',`;
      }
      if (media.returned_at) {
        sql += ` returned_at = ${media.returned_at},`;
      }
      if (media.status) {
        sql += ` status = ${media.status},`;
      }

      sql = sql.slice(0, -1);
      sql += ` WHERE id = ${id}`;
      const [result] = await db.query<ResultSetHeader>(sql);
      if (result.affectedRows > 0) {
        return this.fetchMediaTracking(id);
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

export const mediaTrackingService = MediaTrackingService.getInstance();
