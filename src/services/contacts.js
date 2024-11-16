import { Contact } from '../models/contact.js';

export const fetchAllContacts = async () => {
  return await Contact.find();
};
