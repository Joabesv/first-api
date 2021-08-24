import express from 'express';

const app = express();
const port = 3456;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const fakeDb = {
  games: [
    {
      id: 32,
      name: 'Call of Duty',
      year: 2019,
      price: 60,
    },
    {
      id: 45,
      name: 'Resident Evil 4',
      year: 2005,
      price: 35,
    },
    {
      id: 74,
      name: 'Minecraft',
      year: 2012,
      price: 50,
    },
  ],
};

app.get('/games', (req, res) => {
  res.statusCode = 200;
  res.json(fakeDb.games);
});

app.get('/game/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id, 10);

    const game = fakeDb.games.find(g => g.id === id);

    if (game != undefined) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  }
});

app.listen(port, () =>
  console.log(`API started at port http://localhost:${port} 🚀`)
);
