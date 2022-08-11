import { Types } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { MutationResponse } from 'src/types/MutationResponse';

function generateToken(payload: object, time = '10m') {
  const res = sign(payload, process.env.SECRET_KEY, {
    expiresIn: time,
  });
  return res;
}
function generateTokenReset(payload: object, time = '5m', secretKey: string) {
  const res = sign(payload, secretKey, {
    expiresIn: time,
  });
  return res;
}
function generateRefreshToken(payload: object, time = '60m') {
  const res = sign(payload, process.env.REFRESH_KEY, {
    expiresIn: time,
  });
  return res;
}
export function calculateReadingTime(body: string): number {
  // 200 word 1 min, 1 picture 12s
  const WORDS_PER_MIN = 200;
  const result = Math.ceil(
    body
      .replace(/<[^>]*>/g, '')
      .split(' ')
      .filter((x) => x !== '').length /
      WORDS_PER_MIN +
      (body.split('img').length - 1) * 0.2,
  );
  return result;
}
export const responseSuccess = (message: string): MutationResponse => {
  return {
    code: 200,
    success: true,
    message,
  };
};

export { generateToken, generateRefreshToken, generateTokenReset };
