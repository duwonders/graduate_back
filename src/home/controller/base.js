'use strict';
export default class extends think.controller.base {
  /**
   * some base method in here
   */
  test(data){
  	this.json({res: data});
  }
}