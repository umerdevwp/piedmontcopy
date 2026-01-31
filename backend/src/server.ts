import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow images to be loaded cross-origin
}));
app.use(express.json());

// Professional Static File Serving
const uploadsPath = path.join(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadsPath));

import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import uploadRoutes from './routes/uploadRoutes';
import settingRoutes from './routes/settingRoutes';
import pageRoutes from './routes/pageRoutes';
import navigationRoutes from './routes/navigationRoutes';
import searchRoutes from './routes/searchRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'PiedmontCopy API is running' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
