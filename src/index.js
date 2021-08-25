import express from 'express';

const app = express();
const port = 3456;

function validate(object, schema) {
  return Object.keys(schema)
    .filter(key => !schema[key](object[key]))
    .map(key => new Error(`${key} is invalid.`));
}

const gameSchema = {
  title: value => typeof value === 'string',
  price: n => n === +n && parseFloat(n) === n, // is number and float,
  year: n => `${n}`.length === 4, // check if has 4 characters
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const fakeDb = {
  games: [
    {
      id: 32,
      title: 'Call of Duty',
      year: 2019,
      price: 60,
    },
    {
      id: 45,
      title: 'Resident Evil 4',
      year: 2005,
      price: 35,
    },
    {
      id: 74,
      title: 'Minecraft',
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

app.post('/game', (req, res) => {
  const { title, price, year } = req.body;
  const errors = validate({ title, price, year }, gameSchema);

  if (errors.length !== 0) {
    const invalidFields = errors.map(error => error.message).join(', ');
    const message = `Os seguintes campos estao no formato errado: ${invalidFields}`;
    return res.status(400).send({ message });
  }
  // tudo certo
  fakeDb.games.push({
    id: fakeDb.games.length + 1,
    title,
    price,
    year,
  });

  res.sendStatus(200);
});

/* 
  req.body, serve para pegar QUALQUER dado que você passe dentro
  da requisição POST
*/

app.delete('/game/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id, 10);
    const index = fakeDb.games.findIndex(g => g.id == id);

    if (index == -1) {
      res.sendStatus(404);
    } else {
      fakeDb.games.splice(index, 1);
      res.sendStatus(200);
    }
  }
});

// editar
app.put('/game/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id, 10);

    const game = fakeDb.games.find(g => g.id === id);

    if (game != undefined) {
      const { title, price, year } = req.body;

      if (title != undefined) {
        game.title = title;
      }

      if (price != undefined) {
        game.price = price;
      }

      if (year != undefined) {
        game.year = year;
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.listen(port, () =>
  console.log(`API started at port http://localhost:${port} 🚀`)
);
/**
 
  */
