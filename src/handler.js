const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const finished = parseInt(pageCount) === parseInt(readPage)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    books.push(newBook)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  const { name, finished, reading } = request.query

  let bookFiltered = books

  if (finished) {
    bookFiltered = books.filter((book) => book.finished === true)
  }

  if (reading) {
    bookFiltered = books.filter((book) => book.reading === true)
  }

  if (name !== undefined) {
    bookFiltered = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  const booksList = bookFiltered.map((item) => ({
    id: item.id,
    name: item.name,
    publisher: item.publisher
  }))

  const response = h.response({
    status: 'success',
    data: {
      books: booksList
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const updatedAt = new Date().toISOString()
  const finished = parseInt(pageCount) === parseInt(readPage)

  const index = books.findIndex((book) => book.id === bookId)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
