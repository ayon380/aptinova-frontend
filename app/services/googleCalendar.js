const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export const initGoogleAuth = () => {
  return window.gapi.client.init({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scope: SCOPES.join(' '),
  });
};

export const createCalendarEvent = async (eventDetails, attendees) => {
  const event = {
    summary: 'Interview for Job Position',
    location: eventDetails.location,
    description: eventDetails.notes,
    start: {
      dateTime: `${eventDetails.date}T${eventDetails.time}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: new Date(new Date(`${eventDetails.date}T${eventDetails.time}`).getTime() + eventDetails.duration * 60000).toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    attendees: attendees.map(email => ({ email })),
    reminders: {
      useDefault: true,
    },
  };

  try {
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });
    return response.result;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};
