import express from 'express';
import { getAllContacts } from '../controllers/contacts.js';
import { getContactById } from '../controllers/contacts.js';


const router = express.Router();

router.get('/', getAllContacts);

router.get('/:contactId', getContactById);

export default router;


