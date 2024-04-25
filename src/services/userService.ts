import "dotenv/config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db_connection";
import { APIresponse, Media } from "../types";
import { User } from "../types/user";
import { Encrypter, tokenGenerator } from "../utils";
import { mediaTrackingService } from "./mediaTrackingService";
import { mediaService } from "./mediaService";

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async fetchUser(id: string) {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM users WHERE id=${id} AND status=1`
      );
      if (result.length === 0) {
        return new APIresponse<null>(
          true,
          StatusCodes.NOT_FOUND,
          "No user Found"
        );
      }
      const token = tokenGenerator({ id: result[0].id });
      return new APIresponse<RowDataPacket[]>(
        false,
        StatusCodes.OK,
        ReasonPhrases.OK,
        result,
        token
      );
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }
  public async allUsers() {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM users WHERE  status=1`
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

  public async addUser(user: User) {
    try {
      if (user.password) user.password = Encrypter(user.password, 10);

      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO users (firstname,${
          user.lastname ? "lastname," : ""
        }mobile_number,date_of_birth,email,password,library_card,type${
          user.created_at ? ",created_at" : ""
        }${user.deleted_at ? ",deleted_at" : ""}
     ) VALUES ('${user.firstname}',${
          user.lastname ? `'${user.lastname}',` : ""
        }${user.mobile_number},'${user.date_of_birth}','${user.email}','${
          user.password
        }','${user.library_card}','${user.type}'${
          user.created_at ? `',${user.created_at}'` : ""
        }
      ${user.deleted_at ? `',${user.deleted_at}'` : ""}
      )`
      );

      if (result?.insertId) {
        return this.fetchUser(result.insertId.toString());
      }
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }
  public async search(query: Media) {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT * FROM media WHERE ${
          query.author_name ? `author_name LIKE '${query.author_name}%'` : ""
        } ${query.journal ? `journal LIKE '${query.journal}%'` : ""} ${
          query.published_year
            ? `published_year LIKE '${query.published_year}%'`
            : ""
        }`
      );

      if (result.length === 0) {
        return new APIresponse<null>(false, StatusCodes.OK, "no result found");
      }
      return new APIresponse<RowDataPacket[]>(
        false,
        StatusCodes.OK,
        "media fetched successfully",
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
  public async removeUser(id: string) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        `UPDATE users SET status=0 WHERE id=${id}`
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
  public async bookingMedia(id: string, user: any) {
    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT status FROM media WHERE id=${id}`
      );

      if (result[0].status === 1) {
        const issue_date = new Date()
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);
        const res = await mediaTrackingService.addMediaTracking({
          media_id: Number(id),
          library_card: user[0].library_card,
          issued_at: issue_date,
        });

        if (!res?.isError) {
          const updation = await mediaService.updateMedia({ status: 0 }, id);
        }
        const return_date = new Date();
        return_date.setDate(return_date.getDate() + 7);
        return new APIresponse<{}>(
          false,
          StatusCodes.OK,
          "media booked successfully",
          {
            return_date: return_date.toLocaleDateString(),
            note: "Please return the media before or on return date to avoid fine.",
          }
        );
      }
      return new APIresponse<null>(
        false,
        StatusCodes.ACCEPTED,
        "media is not availble for booking.somebody is holding the media"
      );
    } catch (error: Error | any) {
      return new APIresponse<null>(
        true,
        StatusCodes.BAD_REQUEST,
        error.message
      );
    }
  }

  public async updateUser(user: User, id: string) {
    try {
      let sql = `UPDATE users SET`;
      if (user.firstname) {
        sql += ` firstname = '${user.firstname}',`;
      }
      if (user.mobile_number) {
        sql += ` mobile_number = '${user.mobile_number}',`;
      }
      if (user.date_of_birth) {
        sql += ` date_of_birth = '${user.date_of_birth}',`;
      }
      if (user.library_card) {
        sql += ` library_card = '${user.library_card}',`;
      }
      if (user.type) {
        sql += ` type = '${user.type}',`;
      }
      if (user.created_at) {
        sql += ` created_at = '${user.created_at}',`;
      }
      if (user.deleted_at) {
        sql += ` deleted_at = '${user.deleted_at}',`;
      }
      if (user.lastname) {
        sql += ` last_name = '${user.lastname}',`;
      }
      if (user.email) {
        sql += ` email = '${user.email}',`;
      }
      if (user.password) {
        const password = Encrypter(user.password, 10);
        sql += ` password = '${password}',`;
      }
      sql = sql.slice(0, -1);
      sql += ` WHERE id = ${id}`;
      const [result] = await db.query<ResultSetHeader>(sql);
      if (result.affectedRows > 0) {
        return this.fetchUser(id);
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

export const userService = UserService.getInstance();
