const book = function(flightNumber, name) {
    console.log(`${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNumber}`);
    this.bookings.push({
        flight: `${this.iataCode}${flightNumber}`,
        name,         
    })
}


const Saudia = {
    airline : 'Saudia Airline',
    iataCode : 'SV',
    bookings : [],
    book,
}


const flyADeal = {
    airline: 'Fly A Deal',
    iataCode: 'FD',
    bookings: [],
}


// book.call(Saudia, 786, 'Abdul Rahman')
// book.call(flyADeal, 732, 'Ramesh')
// console.log(Saudia.bookings);
// console.log(flyADeal.bookings);

bookSAU = book.bind(Saudia);
bookSAU(333, 'Abdul Rahman')