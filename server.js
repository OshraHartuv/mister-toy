const express = require('express');
// const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')


// const toyService = require('./services/toy-service');

const app = express();
const http = require('http').createServer(app)

 
// session setup
const session = expressSession({
  secret: 'coding is amazing',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})
// Express App Config
app.use(express.json())
app.use(session)
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  // Configuring CORS
  const corsOptions = {
      // Make sure origin contains the url your frontend is running on
      origin: ['http://127.0.0.1:8080', 'http://localhost:8080','http://127.0.0.1:3000', 'http://localhost:3000'],
      credentials: true
  }
  app.use(cors(corsOptions))
}


// routes
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const toyRoutes = require('./api/toy/toy.routes')
const reviewRoutes = require('./api/review/review.routes')
const {connectSockets} = require('./services/socket.service')


// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
app.use('/api/review', reviewRoutes)
connectSockets(http, session)


app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})


// package scripts
    // "test": "echo \"Error: no test specified\" && exit 1",
    // "start": "nodemon --ignore \"./data\" server.js"

    // "dependencies": {
    //   "cookie-parser": "^1.4.6",
    //   "cors": "^2.8.5",
    //   "express": "^4.17.1",
    //   "express-session": "^1.17.2"
    // },
// //LIST
// app.get('/api/toy', (req, res) => {
//   toyService.query()
//     .then((toys) => {
//         res.send(toys);
//     });
// });

// app.get('/api/toy/label', (req, res) => {
//   toyService.getLabels()
//     .then((labels) => {
//         res.send(labels);
//     });
// });

// //READ
// app.get('/api/toy/:toyId', (req, res) => {
//   const { toyId } = req.params;
//   toyService.getById(toyId)
//     .then((toy) => {
//         if (toy) res.send(toy);
//         else res.status(404).send('Toy not found');
//     });
// });
 
// //DELETE
// app.delete('/api/toy/:toyId', (req, res) => {
//   const { toyId } = req.params;
//   toyService
//     .remove(toyId)
//     .then(() => {
//       res.send('Deleted!');
//     })
//     .catch((err) => {
//       res.status(401).send('Not your toy!');
//     });
// });

// // CREATE
// app.post('/api/toy', (req, res) => {
//   const toy = req.body;
//   toyService.save(toy)
//     .then((savedToy) => {
//         console.log('Added New Toy: ', savedToy);
//         res.send(savedToy);
//     });
// });

// // UPDATE
// app.put('/api/toy/:toyId', (req, res) => {
//   const toy = req.body;
//   console.log('toy in sever', toy);
//   toyService
//     .save(toy)
//     .then((savedToy) => {
//       console.log('Toy Updated: ', savedToy);
//       res.send(savedToy);
//     })
//     .catch(() => {
//       console.log('Cannot update toy');
//       res.status(401).send('Not your toy!');
//     });
// });

// app.listen(port, () => {
//   console.log(`Server ready at http://localhost:${port}`);
// });
