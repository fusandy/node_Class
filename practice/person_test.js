// require可以動態匯入，不須放在檔案的最開頭

// 匯入單個
// const Person = require('./person');
// const p2 = new Person('Peter',25);
// console.log(p2);


// 匯入多個
// require機制: 若同個檔案重複寫require，事實上只會require一次
const obj = require('./person');
// exports object，require時可以用展開方式指定所需要的屬性
const {Person} = require('./person');

const p2 = new obj.Person('Peter',25);
const p3 = new Person('David', 30);

console.log(p2);
console.log(obj.f3(3));
console.log(p3);
console.log(obj.Person === Person);