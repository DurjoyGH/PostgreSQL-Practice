const prisma = require("../configs/prismaClient");

exports.getAll = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        name: true,
        writer: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Books retrieved successfully",
      count: books.length,
      books,
    });
  } catch (err) {
    console.error("Get all books error:", err);
    res.status(500).json({
      error: "Failed to retrieve books",
      message: err.message,
    });
  }
};

exports.addBook = async (req, res) => {
  const { name, writer, price } = req.body;

  if (!name || !writer || price === undefined) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Book name, writer and price are required",
    });
  }

  if (Number.isNaN(Number(price))) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Price must be a number",
    });
  }

  try {
    const book = await prisma.book.create({
      data: {
        name: name.trim(),
        writer: writer.trim(),
        price: Number(price),
      },
    });

    res.status(201).json({
      message: "Book added successfully!",
      book: {
        id: book.id,
        name: book.name,
      },
    });
  } catch (err) {
    console.error("Book add error:", err);

    res.status(500).json({
      error: "Book add failed",
      message: "Internal server error",
    });
  }
};

exports.deleteBook = async (req, res) => {
  const bookId = Number(req.params.id);

  if (!bookId || isNaN(bookId)) {
    return res.status(400).json({
      error: "Invalid book id",
    });
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      return res.status(404).json({
        error: "Book not found!",
      });
    }

    await prisma.book.delete({ where: { id: bookId } });

    res.status(200).json({
      message: "Book deleted successfully!",
      bookId,
    });
  } catch (err) {
    console.error("Book delete error:", err);
    res.status(500).json({
      error: "Failed to delete book!",
      message: err.message,
    });
  }
};

exports.updateBook = async (req, res) => {
  const name = req.body.name?.trim();
  const writer = req.body.writer?.trim();
  const price = req.body.price !== undefined ? Number(req.body.price) : undefined;
  const bookId = Number(req.params.id);

  if (!name && !writer && price === undefined) {
    return res.status(400).json({
      error: "At least one field is required!",
    });
  }

  if (!bookId || isNaN(bookId)) {
    return res.status(400).json({
      error: "Invalid book id",
    });
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      return res.status(404).json({
        error: "Book not found!",
      });
    }

    const data = {};
    if (name) data.name = name;
    if (writer) data.writer = writer;
    if (price !== undefined) data.price = price;

    await prisma.book.update({
      where: { id: bookId },
      data,
    });

    res.status(200).json({
      message: "Book updated successfully!",
      bookId,
    });
  } catch (err) {
    console.error("Book update error:", err);
    res.status(500).json({
      error: "Failed to update book!",
      message: err.message,
    });
  }
};