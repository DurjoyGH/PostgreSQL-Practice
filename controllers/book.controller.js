const prisma = require("../configs/prismaClient");

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
        }
    });

    res.status(201).json({
        message: "Book added successfully!",
        book: {
            id: book.id,
            name: book.name
        }
    });
    
  } catch (err) {
    console.error("Book add error:", err);

    res.status(500).json({
      error: "Book add failed",
      message: "Internal server error",
    });
  }
};


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
