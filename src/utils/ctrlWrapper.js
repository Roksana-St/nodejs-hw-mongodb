export const ctrlWrapper = (ctrl) => async (req, res, next) => {
  try {
    await ctrl(req, res);
  } catch (err) {
    next(err); 
  }
};
