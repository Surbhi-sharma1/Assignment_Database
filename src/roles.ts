import { Request, Response } from 'express';
import { pool } from './queries.js';

class RolesController {

    public async getRoles(req: Request, res: Response) {
        pool.query('SELECT name from roleuser', (err, result) => {
            if (err) {
                throw err;
            }
            else {
                res.status(200).json(result.rows);
            }
        })
    }
    public async getRoleKeyByName(req: Request, res: Response) {
        const roleName = req.params.name;
        pool.query('SELECT key FROM roleuser WHERE name = $1', [roleName], (err, result) => {
            if (err) {
                throw err;
            }
            else {
                res.status(200).send(result.rows);
            }
        })
    }
}

export const roleController = new RolesController();