import React, { createContext, useState, useContext } from 'react';
import { getMeetingsByUserId } from '../services/meetingService'; // Importar servicio
import { AuthContext } from './AuthContext';

interface Meeting {
  meeting_id: number;
  meeting_date: string;
  meeting_start_time: string;
  meeting_end_time: string;
  meeting_status: string;
  meeting_description: string;
  meeting_link: string;
  project_id: number;
}

interface MeetingsContextProps {
  meetings: Meeting[];
  fetchMeetings: (userId: number) => Promise<Meeting[]>;
  setMeetings: (meetings: Meeting[]) => void;
}

export const MeetingsContext = createContext<MeetingsContextProps | undefined>(undefined);

export const MeetingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext) || {};
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const fetchMeetings = async (userId: number): Promise<Meeting[]> => {
    if (!token) {
      return [];
    }

    try {
      const meetingsData = await getMeetingsByUserId(userId, token);
      setMeetings(meetingsData);
      return meetingsData;
    } catch (error) {
      return [];
    }
  };

  return (
    <MeetingsContext.Provider value={{ meetings, fetchMeetings, setMeetings }}>
      {children}
    </MeetingsContext.Provider>
  );
};

// Hook personalizado para usar el contexto de reuniones
export const useMeetings = () => {
  const context = useContext(MeetingsContext);
  if (!context) {
    throw new Error('useMeetings debe usarse dentro de un MeetingsProvider');
  }
  return context;
};
