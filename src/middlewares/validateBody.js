import createError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(createError(400, error.details.map((err) => err.message).join(', ')));
    }
    next();
  };
};

