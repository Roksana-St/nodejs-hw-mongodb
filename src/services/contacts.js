import { Contact } from '../models/contacts.js';

export const fetchAllContacts = async () => {
  return await Contact.find();
};
