import express from 'express';
import { getContactById } from '../controllers/contacts.js';

const router = express.Router();

router.get('/:contactId', getContactById);


export default router;
