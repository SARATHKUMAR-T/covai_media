import "dotenv/config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db_connection";
import { APIresponse, MediaFine } from "../types";

class MediaFineService {
  private static instance: MediaFineService;

  private constructor() {}

  public static getInstance(): MediaFineService {
    if (!MediaFineService.instance) {
      MediaFineService.instance = new MediaFineService();
    }
    return MediaFineService.instance;
  }

  public async fetchMediaFine(id: string) {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM media_fine_details WHERE id=${id}`
      );
      if (result.length === 0) {
        return new APIresponse<null>(
          true,
          StatusCodes.NOT_FOUND,
          "No media fine Found"
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
  public async fetchMediaFineByMediaId(id: string) {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM media_fine_details WHERE media_tracking_id=${id}`
      );
      if (result.length === 0) {
        return new APIresponse<null>(
          true,
          StatusCodes.NOT_FOUND,
          "No media fine Found"
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
  public async allMediaFines() {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM media_fine_details `
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

  public async addMediaFine(media: MediaFine) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO media_fine_details (media_tracking_id,library_card,fine_amount${
          media.fine_imposed_at ? `,fine_imposed_at` : ""
        }
        ${media.fine_paid_at ? `,fine_paid_at` : ""}
     ) VALUES (${media.media_tracking_id},'${media.library_card}',${
          media.fine_amount
        }${media.fine_imposed_at ? `,'${media.fine_imposed_at}'` : ""}
      ${media.fine_paid_at ? `,'${media.fine_paid_at}'` : ""}
      )`
      );

      if (result?.insertId) {
        return this.fetchMediaFine(result.insertId.toString());
      }
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }

  public async updateMediaFine(media: MediaFine, id: string) {
    try {
      let sql = `UPDATE media_fine_details SET`;
      if (media.media_tracking_id) {
        sql += ` media_tracking_id = ${media.media_tracking_id},`;
      }
      if (media.library_card) {
        sql += ` library_card = '${media.library_card}',`;
      }
      if (media.fine_amount) {
        sql += ` fine_amount = '${media.fine_amount}',`;
      }
      if (media.fine_imposed_at) {
        sql += ` fine_imposed_at = '${media.fine_imposed_at}',`;
      }
      if (media.fine_paid_at) {
        sql += ` fine_paid_at = '${media.fine_paid_at}',`;
      }
      sql = sql.slice(0, -1);
      sql += ` WHERE id = ${id}`;
      const [result] = await db.query<ResultSetHeader>(sql);
      if (result.affectedRows > 0) {
        return this.fetchMediaFine(id);
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

  public async mediaFineStatics(range: { from: string; to: string }) {
    try {
      const [result] = await db.query<RowDataPacket[]>(`
     SELECT * FROM media_fine_details WHERE fine_imposed_at 
     BETWEEN '${range.from}' AND '${range.to}'`);
      if (result) {
        const totalRecords = result.length;
        const finePaid = result.filter((item) => {
          if (item.fine_imposed_at && item.fine_paid_at) return item;
        });
        const pendingFine = result.filter((item) => {
          if (item.fine_imposed_at && !item.fine_paid_at) return item;
        });

        const totalFine = result.reduce((a, b) => a + b.fine_amount, 0);
        return new APIresponse<{}>(
          false,
          StatusCodes.OK,
          "repost fetched successfully",
          {
            totalRecords,
            paid: finePaid.length,
            pending: pendingFine.length,
            finePaid,
            pendingFine,
            totalFine,
          }
        );
      }
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }
  public async updateFine(media: MediaFine, id: string) {
    try {
      let sql = `UPDATE media_fine_details SET`;
      if (media.fine_amount) {
        sql += ` fine_amount = fine_amount+${media.fine_amount},`;
      }
      sql = sql.slice(0, -1);
      sql += ` WHERE media_tracking_id = ${id}`;
      const [result] = await db.query<ResultSetHeader>(sql);
      if (result.affectedRows > 0) {
        return new APIresponse<null>(
          false,
          StatusCodes.OK,
          "fine updated successfully"
        );
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

export const mediaFineService = MediaFineService.getInstance();
