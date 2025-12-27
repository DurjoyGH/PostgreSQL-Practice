const prisma = require("../configs/prismaClient");

exports.addReview = async (req, res) => {
  const comment = req.body.comment?.trim();
  const rating = Number(req.body.rating);
  const userId = req.user.id;
  const bookId = Number(req.params.bookId);

  if (!rating || rating < 0 || rating > 10) {
    return res.status(400).json({
      error: "Rating must be 0-10",
    });
  }

  if (!bookId || isNaN(bookId)) {
    return res.status(400).json({
      error: "Invalid book ID",
    });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({
        error: "Book not found!",
      });
    }

    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        userId,
        bookId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            name: true,
            writer: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Review added successfully!",
      review,
    });
  } catch (err) {
    console.error("Add review error:", err);

    if (err.code === "P2002") {
      return res.status(409).json({
        error: "You already reviewed this book!",
      });
    }

    res.status(500).json({
      error: "Failed to add review!",
      message: err.message,
    });
  }
};

exports.getAll = async (req, res) => {
  const bookId = Number(req.params.bookId);

  if (!bookId || isNaN(bookId)) {
    return res.status(400).json({
      error: "Invalid book ID!",
    });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({
        error: "Book not found!",
      });
    }

    res.json({
      message: "Reviews retrieved successfully!",
      count: book.reviews.length,
      book: {
        id: book.id,
        name: book.name,
        writer: book.writer,
        price: book.price,
      },
      reviews: book.reviews,
    });
  } catch (err) {
    console.error("Get all reviews error:", err);
    res.status(500).json({
      error: "Failed to retrieve reviews!",
      message: err.message,
    });
  }
};
