// import 一定要放在檔案的最一開始
// 不是export default，都要用大括號{}包起來

import Person, {f1, f3} from './person.mjs';

const p4 = new Person('Abby', 20);

console.log(p4);
console.log(f1(9));
console.log(f3(5));