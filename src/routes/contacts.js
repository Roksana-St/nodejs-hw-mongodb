import express from 'express';
import { getAllContacts, getContactById, createContact, deleteContactById} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact)); 
router.delete('/:contactId', ctrlWrapper(deleteContactById));

export default router;
