import express from 'express';
import { request } from 'http';
import { userController } from './controller.js';
import { User } from '../public/user.js';
import { customer } from './customer.js';
import { roleController } from './roles.js';
const route = express.Router();

route.get('/users', userController.getAll);
route.get('/users/:id', userController.getUserById);
route.post('/add', userController.createUser);
route.put('/update/:id', userController.updateUser);
route.delete('/delete/:id', userController.deleteUser);
route.get('/customer', customer.getCustomer);
route.get('/customers/:name', customer.getCustomerById);
route.get('/roles', roleController.getRoles);
route.get('/roles/:name', roleController.getRoleKeyByName);
export default route;
