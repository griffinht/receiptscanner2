import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.url}`);
  
  if (Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }
  
  next();
});

// Mock data generator function
const generateMockAnalysis = () => {
  const categories = [
    { name: 'Produce', amount: `$${(Math.random() * 50).toFixed(2)}`, percentage: Math.floor(Math.random() * 40) + 20 },
    { name: 'Dairy', amount: `$${(Math.random() * 30).toFixed(2)}`, percentage: Math.floor(Math.random() * 30) + 10 },
    { name: 'Meat', amount: `$${(Math.random() * 40).toFixed(2)}`, percentage: Math.floor(Math.random() * 35) + 15 },
    { name: 'Pantry', amount: `$${(Math.random() * 25).toFixed(2)}`, percentage: Math.floor(Math.random() * 25) + 10 }
  ];

  // Calculate total
  const total = categories.reduce((sum, cat) => {
    return sum + parseFloat(cat.amount.replace('$', ''));
  }, 0);

  return {
    total: `$${total.toFixed(2)}`,
    categories
  };
};

// Endpoint to handle receipt image upload and return mock analysis
app.post('/api/analyze-receipt', upload.single('receipt'), (req, res) => {
  // Log file information if present
  if (req.file) {
    console.log('Uploaded File Details:', {
      filename: req.file.originalname,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      mimetype: req.file.mimetype
    });
  }

  // Simulate processing delay
  setTimeout(() => {
    res.json(generateMockAnalysis());
  }, 1500);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});