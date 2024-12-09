import express from 'express';
import { getAllContacts, createContact } from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../utils/schemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.post('/', validateBody(contactSchema), createContact);

export default router;
