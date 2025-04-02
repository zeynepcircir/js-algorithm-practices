 const game = (number) => {
    for (let i = 0; i <= number; i++) {
        if(i % 3 === 0 && i % 5 === 0) { console.log("fizzbuzz")}
        else if(i % 3 === 0){ console.log("fizz") }
        else if(i % 5 === 0){ console.log("buzz") }
        else{console.log(i);} 
        }
    }

    game(50);