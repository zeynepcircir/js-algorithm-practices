const integerReversal = (n) => {
    let reversed = n.toString().split('').reverse().join('');
    console.log(parseInt(reversed) * Math.sign(n));
}

integerReversal(-50);