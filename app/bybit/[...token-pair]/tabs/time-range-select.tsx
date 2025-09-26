import { DatePicker } from '@medusajs/ui';

import { useEffect, useState } from 'react';

import { OrderFilter } from './order-filter';

export function TimeRangeSelect({
  days,
  setDays,
  dateRange,
  setDateRange,
}: {
  days: string | null;
  setDays: (value: string | null) => void;
  dateRange: number[] | null;
  setDateRange: (value: number[] | null) => void;
}) {
  const today = new Date();

  const [startDate, setStartDate] = useState<Date | null>(
    dateRange?.[0] ? new Date(dateRange[0]) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    dateRange?.[1] ? new Date(dateRange[1]) : null
  );

  useEffect(() => {
    setStartDate(dateRange?.[0] ? new Date(dateRange[0]) : null);
    setEndDate(dateRange?.[1] ? new Date(dateRange[1]) : null);
  }, [dateRange]);

  useEffect(() => {
    if (days) {
      setDateRange(null);
    }
  }, [days]);

  const dayOptions = [
    {
      label: 'Last 7D',
      value: '7',
    },
    {
      label: 'Last 30D',
      value: '30',
    },
  ];

  function handleDaysChange(d: string) {
    setDays(d);
    setDateRange(null);
  }

  function handleStartDateChange(sDate: Date | null) {
    if (sDate) {
      sDate.setHours(0, 0, 0, 0);
    }

    setStartDate(sDate);
    if (endDate && sDate && sDate.getTime() <= endDate.getTime()) {
      setDateRange([sDate.getTime(), endDate.getTime()]);
      setDays(null);
    }
  }

  function handleEndDateChange(eDate: Date | null) {
    if (eDate) {
      eDate.setHours(23, 59, 59, 0);
    }
    setEndDate(eDate);
    if (startDate && eDate && startDate.getTime() <= eDate.getTime()) {
      setDateRange([startDate.getTime(), eDate.getTime()]);
      setDays(null);
    }
  }

  return (
    <div className="py-[10px] px-6 flex items-center select-none">
      <OrderFilter
        options={dayOptions}
        activeTab={days || 'none'}
        setActiveTab={handleDaysChange}
      />
      <div className="flex items-center gap-2 ml-6">
        <DatePicker
          minValue={endDate ? new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000) : undefined}
          maxValue={today}
          className="w-40"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <span>-</span>
        <DatePicker
          minValue={startDate || undefined}
          maxValue={startDate ? new Date(Math.min(startDate.getTime() + 6 * 24 * 60 * 60 * 1000, today.getTime())) : today}
          className="w-40"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
}
