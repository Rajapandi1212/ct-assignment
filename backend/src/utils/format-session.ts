import { SessionData } from '../../../types/session-data';

export function formatSession(
  existingSessionData: SessionData,
  newSessionData: SessionData
) {
  const result: SessionData = {
    ...existingSessionData,
    ...newSessionData,
    cartId: {
      ...existingSessionData.cartId,
      ...newSessionData.cartId,
    },
  };

  // Remove undefined values to clear them from session
  if (newSessionData.customerId === undefined) {
    delete result.customerId;
  }
  if (newSessionData.anonymousId === undefined) {
    delete result.anonymousId;
  }

  // Remove undefined cart IDs for each locale
  if (result.cartId) {
    Object.keys(result.cartId).forEach((locale) => {
      if (result.cartId![locale] === undefined) {
        delete result.cartId![locale];
      }
    });
  }

  return result;
}
