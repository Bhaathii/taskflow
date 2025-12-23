const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Task API', () => {
    it('should create a task with due date and reminder', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('x-user-id', 'test-user-123')
            .send({
                title: 'Test Task',
                dueDate: '2023-12-31T10:00:00.000Z',
                reminder: true
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toEqual('Test Task');
        expect(res.body.dueDate).toEqual('2023-12-31T10:00:00.000Z');
        expect(res.body.reminder).toEqual(true);
    });

    it('should fetch tasks with due date', async () => {
        // Create a task first
        await request(app)
            .post('/api/tasks')
            .set('x-user-id', 'test-user-123')
            .send({
                title: 'Fetch Task',
                dueDate: '2024-01-01T12:00:00.000Z',
                reminder: false
            });

        const res = await request(app)
            .get('/api/tasks')
            .set('x-user-id', 'test-user-123');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        const task = res.body.find(t => t.title === 'Fetch Task');
        expect(task).toBeDefined();
        expect(task.dueDate).toEqual('2024-01-01T12:00:00.000Z');
    });
});
