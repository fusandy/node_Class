class Person {
    constructor(name='noname', age=0) {
        this.name = name;
        this.age = age;
    }
    toJSON(){
        return {
        name: this.name,
        age: this.age,
        }
    }
    sayHello(){
        return `Hello ${this.name}`;
    }
}
console.log('person.mjs');

// MJS module 匯出
// 分開寫，不用object包
// default 只能寫一個
const f3 = a => a*a*a;
const f1 = a => a*a;
// 也可以寫成 
export {f1,f3};
export default Person;
