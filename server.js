const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// ====== Middleware ======
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== Database Connection ======
mongoose.connect('mongodb+srv://chhavichandna_db_user:vv7ROJtc1qUU8p5q@crowdsolve.jqmowur.mongodb.net/?appName=crowdsolve', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// ====== Schemas ======
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Updated question schema: answers have likes & comments
const commentSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const answerSchema = new mongoose.Schema({
  answer: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  location: String,
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // question-level likes (optional)
  createdAt: { type: Date, default: Date.now },
  answers: [answerSchema],
});

const Question = mongoose.model('Question', questionSchema);

// ====== Auth Middleware ======
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader)
    return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// ====== Multer Setup ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ====== Routes ======

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '2h' });
    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Post Question
app.post('/api/questions', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, location } = req.body;

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newQuestion = new Question({
      userId: req.user.id,
      title,
      description,
      location,
      image: imagePath,
    });

    await newQuestion.save();
    res.status(201).json({ msg: 'Question added successfully', newQuestion });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get User’s Questions (Dashboard)
app.get('/api/questions', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'username')
      .populate('answers.user', 'username')
      .populate('answers.comments.user', 'username');

    const formatted = questions.map(q => ({
      ...q._doc,
      image: q.image ? `http://localhost:5000${q.image}` : null,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get All Questions (Public Page)
app.get('/api/questions/all', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('userId', 'username')
      .populate('answers.user', 'username')
      .populate('answers.comments.user', 'username')
      .sort({ createdAt: -1 });

    const formatted = questions.map(q => ({
      ...q._doc,
      image: q.image ? `http://localhost:5000${q.image}` : null,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update Question
app.put('/api/questions/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description, location } = req.body;

  try {
    const updatedData = { title, description, location };
    if (req.file) updatedData.image = `/uploads/${req.file.filename}`;

    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedQuestion) return res.status(404).json({ msg: 'Question not found' });

    res.json({ msg: 'Question updated successfully', updatedQuestion });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete Question
app.delete('/api/questions/:id', authMiddleware, async (req, res) => {
  try {
    await Question.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Add Answer (pushes an answer object with likes/comments)
app.post('/api/questions/:id/answer', authMiddleware, async (req, res) => {
  const { answer } = req.body;
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const newAnswer = {
      answer,
      user: req.user.id,
      likes: [],
      comments: []
    };

    question.answers.push(newAnswer);
    await question.save();

    res.json({ message: 'Answer added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like/Unlike Answer
app.post('/api/questions/:qId/answers/:ansId/like', authMiddleware, async (req, res) => {
  try {
    const { qId, ansId } = req.params;
    const question = await Question.findById(qId);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    const answer = question.answers.id(ansId);
    if (!answer) return res.status(404).json({ msg: 'Answer not found' });

    const userId = req.user.id;
    const idx = answer.likes.findIndex(id => id.toString() === userId);

    if (idx > -1) {
      // unlike
      answer.likes.splice(idx, 1);
    } else {
      // like
      answer.likes.push(userId);
    }

    await question.save();
    res.json({ likes: answer.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Add comment to an answer
app.post('/api/questions/:qId/answers/:ansId/comment', authMiddleware, async (req, res) => {
  try {
    const { qId, ansId } = req.params;
    const { text } = req.body;
    if (!text || text.trim() === '') return res.status(400).json({ msg: 'Comment cannot be empty' });

    const question = await Question.findById(qId);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    const answer = question.answers.id(ansId);
    if (!answer) return res.status(404).json({ msg: 'Answer not found' });

    answer.comments.push({ text, user: req.user.id });
    await question.save();

    res.json({ msg: 'Comment added' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// (Optional) Like/unlike question-level like (kept if you want)
app.post('/api/questions/:id/like', authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: 'Question not found' });

    const userId = req.user.id;
    const idx = question.likes.findIndex(id => id.toString() === userId);
    if (idx > -1) question.likes.splice(idx, 1);
    else question.likes.push(userId);

    await question.save();
    res.json({ likes: question.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
