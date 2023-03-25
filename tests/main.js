const chai = require('chai');
const request = require('supertest');
const app = require('../src');

const expect = chai.expect;

describe('POST /tweets', () => {
  it('should return a PDF file of the tweets', async () => {

    const res = await request(app)
      .post('/tweets')
      .send({ username: 'testuser' });

    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.equal('application/pdf');
    expect(res.headers['content-disposition']).to.equal(
      'attachment; filename="testuser_tweets.pdf"'
    );
    expect(res.body.length).to.be.above(0);
  });
});
