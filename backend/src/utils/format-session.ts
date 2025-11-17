import { SessionData } from '../../../types/session-data';

export function formatSession(
  existingSessionData: SessionData,
  newSessionData: SessionData
) {
  return {
    ...existingSessionData,
    ...newSessionData,
    cartId: {
      ...existingSessionData.cartId,
      ...newSessionData.cartId,
    },
  };
}
