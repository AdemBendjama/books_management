import autoBind from 'auto-bind'
import BaseModel from "./BaseModel.js";


class OrderModel extends BaseModel {

  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }

}

export default OrderModel