import { OAuth2Client } from 'google-auth-library';

export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string): Promise<any> => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token: empty payload');
    }

    // return the token payload (contains sub, email, name, picture, etc.)
    return payload;
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Invalid Google token');
  }
};