import express from 'express';
import { getAllContacts, getContactById, createContact, deleteContactById, updateContactById} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact)); 
router.patch('/:contactId', ctrlWrapper(updateContactById));
router.delete('/:contactId', ctrlWrapper(deleteContactById));

export default router;
