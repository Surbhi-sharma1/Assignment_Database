import e, { Request, response, Response } from 'express';
import fs from 'fs/promises';
import { User } from '../public/user';
import { pool } from './queries.js';
//import Queries from './queriesService.js';

class controller {

    public async getAll(req: Request, res: Response) {
        pool.query(`select usertable.id,firstname,middlename,lastname,email,phone,roleuser.name as role,customer.name as customer,usertable.address,created_on,modified_on from usertable left join customer on usertable.customerid=customer.customerid left join roleuser on usertable.role=roleuser.name ORDER BY id ASC`, (error: any, result: any) => {
            if (error) {
                throw error;
            }
            else {
                for (let columns of result.rows) {
                    let createdTime = new Date(columns.created_on).toLocaleString('en-US');
                    let modifiedTime = new Date(columns.modified_on).toLocaleString('en-US');
                    columns.created_on = createdTime;
                    columns.modified_on = modifiedTime;
                }
                res.status(200).json(result.rows);
            }
        }
        );

    }

    public async getUserById(req: Request, res: Response) {

        const id = Number(req.params.id);
        pool.query('SELECT * FROM usertable WHERE id = $1', [id], (error, result) => {
            if (error) {
                res.status(404).send("You have entered wrong id");
            }
            else {
                res.status(200).json(result.rows);
            }
        }
        );
    }
    public async createUser(req: Request, res: Response) {

        const { customerid, id, firstname, middlename, lastname, email, phone, role, customername, address } = req.body;
        pool.query('INSERT INTO usertable(customerid,id,firstname,middlename,lastname,email,phone,role,customername,address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
            [customerid, id, firstname, middlename, lastname, email, phone, role, customername, address], (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    res.status(200).send("User added successfully");
                }
            }
        );

    }
    public async updateUser(req: Request, res: Response) {

        const id = Number(req.params.id);
        const { firstname, middlename, lastname, email, phone, role, customername, address } = req.body;
        pool.query('UPDATE usertable SET firstname = $1, middlename = $2, lastname = $3, email = $4, phone = $5, role = $6,customername=$7, address = $8 WHERE id = $9',
            [firstname, middlename, lastname, email, phone, role, customername, address, id], (err, result) => {
                if (err) {
                    res.status(400).send("Failed due to bad input");
                    throw err;
                }
                else {
                    res.status(200).send("Updated");
                }
            }
        );
    }
    public async deleteUser(req: Request, res: Response) {

        const id = Number(req.params.id);
        pool.query('DELETE FROM usertable WHERE id = $1', [id], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                res.status(200).send("Deleted");
            }
        });

    }


}

export const userController = new controller();
