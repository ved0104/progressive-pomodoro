const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const saveSessions = async (sessions) => {
  try {
    for (const session of sessions) {
      await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });
    }
    return true;
  } catch (error) {
    console.error('Failed to save sessions to database:', error);
    return false;
  }
};

export const getSessions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch sessions from database:', error);
    return [];
  }
};

export const getSessionsForDateRange = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sessions/range?startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch sessions for date range:', error);
    return [];
  }
};
