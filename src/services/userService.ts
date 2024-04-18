import "dotenv/config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db_connection";
import { APIresponse } from "../types";
import { User } from "../types/user";
import { Encrypter, tokenGenerator } from "../utils";
import { mediaTrackingService } from "./mediaTrackingService";

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
      const token = tokenGenerator({ id: result[0].user_id });

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
  public async search(query: string) {
    try {
      const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM media
WHERE author_name LIKE "${query}%" OR journal LIKE '${query}%' OR published_year LIKE "${query}%"`);
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
  public async bookingMedia(id: string) {
    console.log(id);

    try {
      const [result] = await db.query<RowDataPacket[]>(
        `SELECT status FROM media WHERE id=${id}`
      );
      if (result[0].status === 1) {
        await mediaTrackingService.addMediaTracking({
          media_id: Number(id),
        });
      }
      console.log(result, "result");
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
