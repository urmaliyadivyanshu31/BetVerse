import axios from 'axios';

const API_KEY = process.env.CRICKET_DATA_API_KEY || '';
const API_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}`;

export async function fetchCricketScores(): Promise<number | null> {
  try {
    const response = await axios.get(API_URL);
    const match = response.data.data[0];
    const score = match.score || '0';
    const numericScore = parseFloat(score.match(/\d+/)?.[0] || '0');
    console.log(`Fetched Score: ${score}`);
    return numericScore;
  } catch (error) {
    console.error('Error fetching scores:', (error as Error).message);
    return null;
  }
}