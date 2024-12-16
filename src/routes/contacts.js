import express from 'express';
import { getAllContacts, createContact, updateContact } from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../utils/schemas.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.post('/', upload.single('photo'), validateBody(contactSchema), createContact);
router.patch('/:contactId', upload.single('photo'), updateContact);

export default router;
