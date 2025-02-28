import { Server } from "socket.io";

const cards = [
  {
    id: 1,
    columnId: 1,
    title: "This is Going to Hurt",
    isFavorite: true,
    checksum: "1",
  },
  {
    id: 2,
    columnId: 1,
    title: "Interpreter of Maladies",
    isFavorite: false,
    checksum: "2",
  },
  {
    id: 3,
    columnId: 2,
    title: "Harry Potter",
    isFavorite: false,
    checksum: "3",
  },
  { id: 4, columnId: 2, title: "Star Wars", isFavorite: false, checksum: "4" },
  { id: 5, columnId: 3, title: "The Witcher", isFavorite: true, checksum: "5" },
  { id: 6, columnId: 3, title: "Skyrim", isFavorite: false, checksum: "6" },
];

const io = new Server(8000);

const updateCards = (socket) => {
  // console.log("updateCards", cards);
  socket.emit("updateCards", cards); // for some reason emit seems to work only on 1 client ???
  // socket.broadcast.emit("updateCards", cards); // for some reason emit seems to work only on 1 client ???
};

io.on("connection", (socket) => {
  console.log(String(socket.id) + " connected");
  socket.emit("updateCards", cards);
  socket.on("disconnect", () => {
    console.log(String(socket.id) + " disconnected");
  });
  socket.on("addCard", (card) => {
    cards.push(card);
    // socket.emit("updateCards", cards);
    updateCards(io);
  });
  socket.on("removeCard", (cardId) => {
    console.log("removeCard", cardId);
    const index = cards.findIndex((card) => card.id === cardId);
    cards.splice(index, 1);
    // socket.emit("updateCards", cards);
    updateCards(io);
  });
  socket.on("updateCard", (card) => {
    console.log("updateCard", card);
    const cardId = card.id;
    const index = cards.findIndex((card) => card.id === cardId);
    cards[index] = card;
    // socket.emit("updateCards", cards);
    updateCards(io);
  });
});
