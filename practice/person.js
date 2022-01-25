class Person {
    // class 類別內的沒有function，而是用constructor建構類別屬性
    // name,age為形式參數(區域變數)
    constructor(name='noname', age=0) {
        // this.name  this.age為class類別的屬性，把傳進來的參數設定成類別的屬性
        this.name = name;
        this.age = age;
    }
    // 類別內定義的function稱之為方法
    toJSON(){
        return {
        name: this.name,
        age: this.age,
        }
    };
    // 類別內定義的function稱之為方法
    sayHello(){
        return `Hello ${this.name}`;
    }
}
console.log('person.js');
const f3 = a => a*a*a;


// CJS 匯出單個
// module.exports = Person;

// CJS 匯出多個(用{object}包起來)
// 也可以匯出array，但一般是使用object
module.exports = {Person , f3};


// const p1 = new Person('Bill',23);
// console.log(p1.sayHello());

// // return class 物件
// console.log(p1);

// // return class 物件
// console.log(p1.toJSON());

// toJSON()底層是有功能的，如果JSON.stringify一起用，結果是JSON字串而不是物件
// console.log(JSON.stringify(p1.toJSON()));

// // return JSON字串
// console.log(JSON.stringify(p1));

    
