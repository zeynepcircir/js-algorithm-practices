const maxChar = (str) => {
    const charMap= {};
    let max = 0;
    let maxChar= '';
    for (let char of str) {
        if(charMap[char]){
            charMap[char]++;
        }else{
            charMap[char]=1;
        }
        
    }
    console.log(charMap);
    for(let char in charMap){
        if(charMap[char]>max){
            max = charMap[char];
            maxChar = char;
        }
    }
    console.log(maxChar, max);
    
}

maxChar("lifeeee is beautiful!")
