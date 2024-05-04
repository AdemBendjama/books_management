import autoBind from "auto-bind";
import httpStatus from "http-status";
import BaseController from "./baseController.js";
import OrderModel from "../models/Order.js";
import BookModel from "../models/Book.js";
import { ByCustomerIdRequest, CreateOrderRequestSchema, ByIdAndCustomerIdRequest } from "../requests/requests.js";
import { errorResponse, notFoundResponse } from "../helpers/handleErrorResponse.js";
import { okResponse } from "../helpers/handleOkResponse.js";

const bookModel = new BookModel('books')
class OrderController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }


  // Read all orders
  async readOwnAll(req, res) {
    const customer_id = req.params.customer_id
    // Validate the request
    const { error } = ByCustomerIdRequest().validate({ customer_id })

    if (error) {
      res.status(httpStatus.BAD_REQUEST).json(errorResponse(error))
    }

    try {
      const data = await orderModel.readAll({ customer_id })

      if (!data) {
        res.status(httpStatus.NOT_FOUND).json(notFoundResponse())
      }

      res.status(httpStatus.OK).json(okResponse(data))
    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(error))
    }
  }

  // Read an order by id
  async readOwnById(req, res) {
    const { customer_id, id } = req.params

    // Validate the request
    const { error } = ByIdAndCustomerIdRequest().validate({ customer_id, id })

    if (error) {
      res.status(httpStatus.BAD_REQUEST).json(errorResponse(error))
    }

    try {
      const data = await orderModel.readById(id)

      if (!data) {
        res.status(httpStatus.NOT_FOUND).json(notFoundResponse())
      }

      if (data[0].customer_id !== parseInt(customer_id)) {
        return res.status(httpStatus.FORBIDDEN).json(errorResponse('You are not authorized to view this order'))
      }

      res.status(httpStatus.OK).json(okResponse(data))
    } catch (error) {
      // console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(error))
    }
  }

  // Order a book
  async order(req, res) {
    // Validathe the request
    const { error } = CreateOrderRequestSchema().validate(req.body)

    if (error) {
      res.status(httpStatus.BAD_REQUEST).json(errorResponse(error))
    }

    const data = {
      book_id: req.body.book_id,
      customer_id: req.body.customer_id,
      status: 'pending',
    }

    const connection = await orderModel.getConnection()

    // We check if the book exists then if it not approved yet
    try {
      const book = await bookModel.readById(data.book_id)

      if (!book) {
        res.status(httpStatus.NOT_FOUND).json(notFoundResponse())
      }

      try {
        await connection.beginTransaction()

        try {
          const result = await orderModel.create(data)

          await bookModel.update(data.book_id, { stock_quantity: book[0].stock_quantity - 1 })

          await connection.commit()
          res.status(httpStatus.CREATED).json(okResponse(result))
        } catch (error) {
          await connection.rollback()
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(error))
        } finally {
          connection.release()
        }
      } catch (error) {
        console.log(error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(error))
      }
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(error))
    }
  }
}

const orderModel = new OrderModel('orders')

export default new OrderController(orderModel)