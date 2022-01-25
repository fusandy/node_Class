const f1 = a => a*a;
console.log('func01:',f1(7));

// module為內建匯出物件，把要匯出的東西(這裡是f1)放到module.exports
module.exports = f1;





























// const f2 = ()=>{
//     let sum = 0;
//     for(let i=1; i<=10; i++) {
//     sum += i;
//     }
//     return sum;
// }
// console.log(f2());


// for(let i=0;i<10;i++){
//     console.log(`hello: ${i}`);
// }