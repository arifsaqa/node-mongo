const request = require('supertest');
const app = require('../../app');
const {
  connectMongo,
  disconnectMongo
} = require('../../services/mongo');


describe('Launches API', () => {
  beforeAll(async () => {
    await connectMongo()
  })
  afterAll(async () => {
    await disconnectMongo()
  })
  describe('test GET /launches', () => {
    test('this should return respond with status code 200', async () => {
      const response = await request(app)
        .get("/launches")
        .expect('Content-Type', /json/)
        .expect(200);
      ;

    });
  })

  describe('test POST /launches', () => {
    const completeLaunchData = {
      mission: 'USS Enterprice',
      rocket: 'NCC UDD 1',
      target: 'Kepler-705 b',
      launchDate: 'January 8, 2028'
    }

    const launchDataWithnoDate = {
      mission: 'USS Enterprice',
      rocket: 'NCC UDD 1',
      target: 'Kepler-705 b',
    }
    test('this should return respond with status code 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(response.body).toMatchObject(launchDataWithnoDate);
      expect(requestDate).toBe(responseDate)
    });

    test('it should catch missing required properties 400', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithnoDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });

    test('it should catch invalid date', async () => {
      const launchWithInvalidDate = {
        mission: 'USS Enterprice',
        rocket: 'NCC UDD 1',
        target: 'Kepler-705 b',
        launchDate: 'kajskiuay'
      }

      const response = await request(app)
        .post('/v1/launches')
        .send(launchWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
})