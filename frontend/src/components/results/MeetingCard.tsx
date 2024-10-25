import React from 'react';

interface MeetingCardProps {
  meeting: {
    meeting_date: string;
    meeting_start_time: string;
    meeting_end_time: string;
    meeting_status: string;
    meeting_description: string;
  };
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md shadow-md mb-2">
      <h3 className="text-lg font-semibold text-blue-700">Fecha: {meeting.meeting_date}</h3>
      <p className="text-gray-800">
        Hora: {meeting.meeting_start_time} - {meeting.meeting_end_time}
      </p>
      <p className="text-sm font-bold text-blue-600 mt-2">Estado: {meeting.meeting_status}</p>
      <p className="text-gray-700 mt-1">Descripción: {meeting.meeting_description}</p>
    </div>
  );
};

export default MeetingCard;
