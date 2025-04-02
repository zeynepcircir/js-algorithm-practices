const parcala = (dizi, eleman) => {
    parcalanmis = [];
    index = 0;

    while (index < dizi.length) {
        parcalanmis.push(dizi.slice(index, index + eleman))
        index += eleman
    }
    console.log(parcalanmis);
    
}
parcala([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 2);