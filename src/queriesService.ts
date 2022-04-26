import e, { Request, response, Response } from 'express';
import fs from 'fs/promises';
import { User } from '../public/user';
import { customer } from './customer';
import { pool } from './queries.js';
class Queries {
    static async getQuery() {
        const query = `select usertable.id,firstname,middlename,lastname,email,phone,roleuser.name as role,customer.name as customer,usertable.address,created_on,modified_on from usertable left join customer on usertable.customerid=customer.customerid left join roleuser on usertable.role=roleuser.name ORDER BY id ASC`;
        const result = await pool.query(query);
        return result.rows;
    }
    static async CreateQuery(user: User) {
        const query = 'INSERT INTO usertable(customerid,id,firstname,middlename,lastname,email,phone,role,customername,address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)'
        const result = await pool.query(query, [

            user.id,
            user.firstname,
            user.middlename,
            user.lastname,
            user.email,
            user.phone,
            user.role,
            user.customer,
            user.address,
            user.created_on,
            user.modified_on
        ]);
        return result.rows;
    }
    static async deleteQuery(id: number) {
        const query = 'DELETE FROM usertable WHERE id = $1';
        const result = pool.query(query, [id]);
        return result;
    }
    static async updateQuery(user: User) {
        const query = 'UPDATE usertable SET firstname = $1, middlename = $2, lastname = $3, email = $4, phone = $5, role = $6,customername=$7, address = $8 WHERE id = $9'
        const result = pool.query(query,
            [user.firstname,
            user.middlename,
            user.lastname,
            user.email,
            user.phone,
            user.role,
            user.customer,
            user.address,
            user.id]);
        return result;
    }
    static async getQueryById(id: number) {
        const query = 'SELECT * FROM usertable WHERE id = $1';
        const result = pool.query(query, [id]);
        return result;
    }

}
export default Queries;
