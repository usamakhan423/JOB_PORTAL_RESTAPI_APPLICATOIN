export const testController = (req, res) => {
    const { name } = req.body;
    res.status(201).json({ message: `Your name is ${name}`})
}