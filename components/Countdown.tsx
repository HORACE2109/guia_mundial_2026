import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Fecha objetivo: 11 de Junio de 2026
const TARGET_DATE = new Date('2026-06-11T00:00:00').getTime();

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      // Cálculos de tiempo
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="bg-white/10 backdrop-blur-md border border-wc-green/30 rounded-lg p-3 md:p-4 w-20 md:w-24 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(163,255,0,0.1)]">
        <span className="text-2xl md:text-4xl font-bold text-white font-mono">
          {value < 10 ? `0${value}` : value}
        </span>
      </div>
      <span className="text-xs md:text-sm uppercase tracking-widest text-wc-green font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      <div className="flex justify-center flex-wrap">
        <TimeBox value={timeLeft.days} label="Días" />
        <TimeBox value={timeLeft.hours} label="Horas" />
        <TimeBox value={timeLeft.minutes} label="Min" />
        <TimeBox value={timeLeft.seconds} label="Seg" />
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-400 bg-black/50 px-4 py-1 rounded-full">
        <Clock className="w-4 h-4 mr-2 text-wc-blue" />
        <span>Hasta el partido inaugural</span>
      </div>
    </div>
  );
};

export default Countdown;