'use strict';
/**
 * model
 */
export default class extends think.model.base {

	/**
	 * @return 返回res[同姓氏人的个数]
	 */
	async get_samename(nameIndex){
		let biao = this.model("user");
		let res = await biao.where({realname: ['like', nameIndex + '%']}).count();
		return res;
	}

	async get_idcard(stunum){
		let biao = this.model("user");
		let shenfenzheng = await biao.where({usernumber: stunum}).field('idnum').select();
		return shenfenzheng;
	}

	async get_samemonth(month_day){
		let biao = this.model("user");
		let people = await biao.query("SELECT count(*) as people FROM user WHERE idnum REGEXP '" + month_day + "'");
		return people;
	}

	
}