'use strict';

import Base from './base.js';
import comF from '../common/common.js';

export default class extends Base {


  /**
   * 页面一逻辑部分
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }

  async loginAction(){
    this.weiApi = new comF();
  	// if(this.isPost()){
  	// 	this.json({status: 400, message: '请求方法错误'});
  	// 	return;
  	// }else{
  		// let js_tic = this.weiApi.getJsSdk(this);
  		let openid = this.weiApi.getOpenid(this);
  		this.json({status: 400, message: openid});
  	// }
  }
/**
 * 时间接口
 *  @return left:剩下的时间(天)
 * 		      already:已经过的时间
 */
  async getdayAction(){
  	const goleTime = [6, 25];
  	const startIndex = 1027;   //领导说包括节假日
  	let now = this.parsetime();
  	let already = startIndex + now[0] * 31 + parseInt(now[1]);
  	let left = parseInt(now[0]) === 5 ? 31 - now[1] + 25 : 25 - now[2];  
  	this.test([already, left]);
  }
/**
 * 
 * @return {[type]} 返回现在的月日用二维数组表示
 */
  parsetime(){
  	let time = think.datetime();
  	const partern = /\d+/g;
  	let res = time.match(partern);
  	return [res[1], res[2]];
  }

/**
 * 页面二逻辑部分
 * 依赖：model层get_samename
 */


/**
 * 
 * @return {[type]}
 * nameIndex{姓氏}
 * percent{所占百分比}        					
 */
  async samenameAction(){
    this.weiApi = new comF();
  	const allPerson = 6310;		//2012级所有人数


  	let openid = 'ouRCyjjdeNhd2v9MJt67rHfN9WA4';
  	let userInfo = await this.weiApi.getBindVerify(openid);
    //这里的获取应该才session中拿

  	let nameIndex = userInfo.realname[0];
  	let percent = await this.model('index').get_samename(nameIndex) / allPerson * 100;
  	this.test([nameIndex, percent]);
  }


/**
 * 页面三逻辑部分
 */


  /**
   * 返回生日birth
   */
  async getbirth(){
    let stunum = 2012210001;
    //这里的获取应该才session中拿
    
    let quereyRes = await this.model('index').get_idcard(stunum);
    let shenfenzheng = quereyRes[0].idnum;
    return shenfenzheng.substring(6, 14);
  }

  /**
   * 返回星座star
   */
  async getstar(){
    let birth = await this.getbirth();
    let month = parseInt(birth.substring(4, 6));
    let date = parseInt(birth.substring(6, 8));
    let value = this.xinzuo(month, date);
    return value;
  }

  xinzuo(month, date){
    let value;
    if (month == 1 && date >=20 || month == 2 && date <=18) {value = "水瓶座";} 
    else if (month == 1 && date > 31) {value = "Huh?";} 
    else if (month == 2 && date >=19 || month == 3 && date <=20) {value = "双鱼座";} 
    else if (month == 2 && date > 29) {value = "Say what?";} 
    else if (month == 3 && date >=21 || month == 4 && date <=19) {value = "白羊座";} 
    else if (month == 3 && date > 31) {value = "OK. Whatever.";} 
    else if (month == 4 && date >=20 || month == 5 && date <=20) {value = "金牛座";} 
    else if (month == 4 && date > 30) {value = "I'm soooo sorry!";} 
    else if (month == 5 && date >=21 || month == 6 && date <=21) {value = "双子座";} 
    else if (month == 5 && date > 31) {value = "Umm ... no.";} 
    else if (month == 6 && date >=22 || month == 7 && date <=22) {value = "巨蟹座";} 
    else if (month == 6 && date > 30) {value = "Sorry.";} 
    else if (month == 7 && date >=23 || month == 8 && date <=22) {value = "狮子座";} 
    else if (month == 7 && date > 31) {value = "Excuse me?";} 
    else if (month == 8 && date >=23 || month == 9 && date <=22) {value = "处女座";} 
    else if (month == 8 && date > 31) {value = "Yeah. Right.";} 
    else if (month == 9 && date >=23 || month == 10 && date <=22) {value = "天秤座";} 
    else if (month == 9 && date > 30) {value = "Try Again.";} 
    else if (month == 10 && date >=23 || month == 11 && date <=21) {value = "天蝎座";} 
    else if (month == 10 && date > 31) {value = "Forget it!";} 
    else if (month == 11 && date >=22 || month == 12 && date <=21) {value = "人马座";} 
    else if (month == 11 && date > 30) {value = "Invalid Date";} 
    else if (month == 12 && date >=22 || month == 1 && date <=19) {value = "摩羯座";} 
    return value;
  }
  /**
   * 同一个月出生人的 percent: 百分比,
   *               num: 人数
   */
  async getsamemonthAction(){
    const allPerson = 6310;   //2012级所有人数
    let birth = await this.getbirth();
    let month = birth.substring(4, 8);
    let people = await this.model("index").get_samemonth(month);
    let num = people[0].people; //同月同日出生的人数
    let percent = num / allPerson * 100;
    return{
      birth: birth, 
      num: num, 
      percent: percent
    }
  }
  /**
   * 同一个星座的人 percent: 百分比,
   *               num: 人数
   */
  async getsamestarAction(){
    const allPerson = 6310;   //2012级所有人数
    let birth = await this.getbirth();
    let star = await this.getstar();
    const starArrCount = {
      "水瓶座" : 487,
      "双鱼座" : 513,
      "白羊座" : 426,
      "金牛座" : 492,
      "双子座" : 502,
      "巨蟹座" : 417,
      "狮子座" : 638,
      "处女座" : 662,
      "天秤座" : 611,
      "天蝎座" : 529,
      "人马座" : 471,
      "摩羯座" : 507
    }
    let num = starArrCount[star];
    let percent = num / allPerson * 100;
    console.log({star: star, num: num, percent: percent});
  }


  /**
   * 
   * 该方法用于算出星座比例
   */
  async contstarpercentAction(){
    let model = this.model('user');
    let allnum = await model.field('idnum').select();
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    let count6 = 0;
    let count7 = 0;
    let count8 = 0;
    let count9 = 0;
    let count10 = 0;
    let count11 = 0;
    let count12 = 0;
    allnum.map((item, index) => {
      let month = item.idnum.substring(10, 12);
      let date = item.idnum.substring(12, 14);
      let star = this.xinzuo(month, date);
      switch(star){
      case "水瓶座":
        count1++
        break;
      case "双鱼座":
        count2++
        break;
      case "白羊座":
        count3++
        break;
      case "金牛座":
        count4++
        break;
      case "双子座":
        count5++
        break;
      case "巨蟹座":
        count6++
        break;
      case "狮子座":
        count7++
        break;
      case "处女座":
        count8++
        break;
      case "天秤座":
        count9++
        break;
      case "天蝎座":
        count10++
        break;
      case "人马座":
        count11++
        break;
      case "摩羯座":
        count12++
        break;
      }
    });
  }
  /**
   * 页面四逻辑部分
   * 
   */
  

  /**
   * 返回{
   *   city: 你的故乡
   *   percent: 你的老乡所占百分比
   * }
   */
  async getsamecityAction(){
    const area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 
      21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",

      33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 
      43: "湖南", 44: "广东", 45: "广西",

      46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 
      62: "甘肃", 63: "青海", 64: "宁夏",

      65: "新疆" }; 
    let idcardob = await this.model('index').get_idcard(2012210001);
    let cityCode = idcardob[0].idnum.substring(0, 2);
    let city = area[cityCode];
    let message = await this.getSameCity(cityCode);
    console.log({
      city: city,
      num: message.num,
      percent: message.percent
    })
  }

  /**
   * 参数 citycode 城市代码
   * 返回 {
   *       percent 对应城市的同乡比例
   *       num 对应城市的人数
   *     }
   */
  async getSameCity(cityCode){
    const cityObj = {
      11: 5,
      12: 4,
      13: 140,
      14: 110,
      15: 55,
      21: 41,
      22: 33,
      23: 39,
      31: 7,
      32: 73,
      33: 73,
      34: 278,
      35: 94,
      36: 46,
      37: 114,
      41: 246,
      42: 218,
      43: 132,
      44: 67,
      45: 101,
      46: 56,
      50: 3065,
      51: 632,
      52: 188,
      53: 153,
      54: 10,
      61: 100,
      62: 125,
      63: 23,
      64: 14,
      65: 67,
    }
    return {
      num: cityObj[cityCode], 
      percent: cityObj[cityCode] / 6310 * 100
    }
  }
}





