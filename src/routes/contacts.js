import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { contactSchema, contactUpdateSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', validateBody(contactSchema), ctrlWrapper(createContact));
router.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(updateContactById));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactById));

export default router;
