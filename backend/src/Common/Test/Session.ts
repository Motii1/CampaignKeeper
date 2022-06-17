import { Session } from '../../Domain/Campaign/Session/Session';
import { saveSession } from '../../Infrastracture/Entity/Session/SessionRepository';

export const MOCKED_SESSION_ID = 1;

export const MOCKED_SESSION: Session = {
  name: 'mocked session',
  campaignId: 1,
  id: MOCKED_SESSION_ID,
  createdAt: new Date(),
};

export const insertMockedSession = async (): Promise<void> => {
  await saveSession(MOCKED_SESSION);
};
