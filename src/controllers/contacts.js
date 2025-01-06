import createError from 'http-errors';
import { Contact } from '../models/contacts.js';
import { fetchAllContacts, createNewContact, updateContactByIdService, deleteContactById, findContactByIdAndOwner } from '../services/contacts.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = await saveFileToCloudinary(req.file); 
    res.status(200).json({
      status: 200,
      message: 'File uploaded successfully',
      data: { fileUrl }, 
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error uploading file to Cloudinary',
      error: error.message,
    });
  }
};



export const getAllContacts = async (req, res) => {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
  const userId = req.user.userId; 

  const currentPage = parseInt(page, 10);
  const limit = parseInt(perPage, 10);
  const skip = (currentPage - 1) * limit;

  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = { userId }; 
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter).sort(sortOptions).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: currentPage,
      perPage: limit,
      totalItems,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
  });
};



export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user.userId;

  const contact = await findContactByIdAndOwner(contactId, userId); 

  if (!contact) {
    throw createError(404, 'Contact not found or does not belong to this user');
  }

  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};




export const createContact = async (req, res) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    let photoUrl = null;
    if (req.file) {
      photoUrl = await saveFileToCloudinary(req.file);
    }

    const newContact = await createNewContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user.userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact',
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error creating contact',
      error: error.message,
    });
  }
};


export const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;
    const userId = req.user.userId;

    if (req.file) {
      const photoUrl = await saveFileToCloudinary(req.file);
      updateData.photo = photoUrl;
    }

    const contact = await findContactByIdAndOwner(contactId, userId); 
    if (!contact) {
      throw createError(404, 'Contact not found or does not belong to this user');
    }

  const updatedContact = await updateContactByIdService(contactId, userId, updateData);

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error updating contact',
      error: error.message,
    });
  }
};


export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user.userId;

  const deletedContact = await deleteContactById(contactId, userId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found or does not belong to this user');
  }

  res.status(204).send(); 
};