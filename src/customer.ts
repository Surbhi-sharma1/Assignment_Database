import { pool } from "./queries.js";
import { Request, Response } from "express";
class customerController {
    public async getCustomer(req: Request, res: Response) {
        pool.query('SELECT name FROM customer', (error: any, result: any) => {
            if (error) {
                throw error;
            }
            else {
                res.status(200).json(result.rows);
            }
        }
        );
    }
    public async getCustomerById(req: Request, res: Response) {
        const customerName = req.params.name;
        pool.query('SELECT customerid FROM customer WHERE name = $1', [customerName], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                res.status(200).send(result.rows);

            }
        })
    }

}

export const customer = new customerController()
