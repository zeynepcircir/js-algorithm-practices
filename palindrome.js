const palindrome = (str) => {
    let newWord = str.split('').reverse().join('');

    if (str === newWord) {
        console.log(str, ", this is a palindrome word");
        
    }else{
        console.log(str, ", this is not a palindrome word");
        
    }
}
palindrome("küçük");

